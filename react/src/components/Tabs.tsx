// src/components/Tabs.tsx
import React, { useState, useEffect } from 'react';

import { General } from 'components/graficos/general/General';
import consultasGeneralesPorTerritorio from 'consultas/generales/porTerritorio';
import consultasGeneralesTodosGeoTerritorios from 'consultas/generales/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from 'consultas/generales/todasGeoComunidadesPorTerritorio';

import { Contenedor, ListaTabs, EstiloTab, PanelTabs, Titulo } from 'components/estilos/Tabs';

interface TabsImp {
  datos: any;
}

interface DatosPorTabImp {
  general: any[];
  cultural: any[];
  educacion: any[];
}

const Tabs: React.FC<TabsImp> = ({ datos }) => {
  const [activo, establecerActivo] = useState('general_tab');
  const [datosPorTab, establecerDatosPorTab] = useState<DatosPorTabImp>({
    general: [],
    cultural: [],
    educacion: []
  });

  useEffect(() => {

    const buscarDatos = async () => {
      if (datos.comunidad_id !== 'Todas') {
        await buscarDatosPorTerritorioYComunidad(datos);
      } else if (datos.territorio_id === 'Todos' && datos.comunidad_id === 'Todas') {
        await buscarDatosParaTodosTerritoriosYComunidades();
      } else if (datos.comunidad_id === 'Todas') {
        await buscarDatosPorTerritorio(datos);
      } else {
        throw new Error(`Tipo de filtrado (comunidad: ${datos.comunidad_id}, territorio: ${datos.territorio_id})`);
      }
    };

    buscarDatos();

  }, [datos.comunidad_id, datos.territorio_id]);

  const buscarDatosPorTerritorioYComunidad = async (datos: any) => {

    const sexo = await buscarDatos(consultasGeneralesPorTerritorio.sexo(datos.comunidad_id));
    const familias = await buscarDatos(consultasGeneralesPorTerritorio.familias(datos.comunidad_id));
    const edad = await buscarDatos(consultasGeneralesPorTerritorio.sexo_edad(datos.comunidad_id));
    const territorio = await buscarDatos(consultasGeneralesPorTerritorio.territorio(datos.comunidad_id));
    const comunidades_en_territorio = await buscarDatos(consultasGeneralesPorTerritorio.comunidades_en_territorio(datos.comunidad_id));

    establecerDatosPorTab(datosPrevios => ({
      ...datosPrevios,
      general: [sexo, familias, edad, territorio, comunidades_en_territorio],
    }));

  };

  const buscarDatosParaTodosTerritoriosYComunidades = async () => {

    const sexo = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo);
    const familias = await buscarDatos(consultasGeneralesTodosGeoTerritorios.familias);
    const edad = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo_edad);
    const territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.territorio);
    const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.comunidades_en_territorio);

    establecerDatosPorTab(datosPrevios => ({
      ...datosPrevios,
      general: [sexo, familias, edad, territorio, comunidades_en_territorio],
    }));

  };

  const buscarDatosPorTerritorio = async (datos: any) => {

    const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datos.territorio_id));
    const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datos.territorio_id));
    const edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datos.territorio_id));
    const territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datos.territorio_id));
    const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datos.territorio_id));

    establecerDatosPorTab(datosPrevios => ({
      ...datosPrevios,
      general: [sexo, familias, edad, territorio, comunidades_en_territorio],
    }));

  };

  return (
    <Contenedor>
      <Titulo>Temáticas</Titulo>
      <ListaTabs>
        <EstiloTab active={activo === 'general_tab'} onClick={() => establecerActivo('general_tab')}>General</EstiloTab>
        <EstiloTab active={activo === 'cultural_tab'} onClick={() => establecerActivo('cultural_tab')}>Cultural</EstiloTab>
        <EstiloTab active={activo === 'educacion_tab'} onClick={() => establecerActivo('educacion_tab')}>Educación</EstiloTab>
      </ListaTabs>
      <PanelTabs>
        {activo === 'general_tab' && <General data={datosPorTab.general} />}
        {activo === 'cultural_tab' && <div>{JSON.stringify(datosPorTab.cultural, null, 2)}</div>}
        {activo === 'educacion_tab' && <div>{JSON.stringify(datosPorTab.educacion, null, 2)}</div>}
      </PanelTabs>
    </Contenedor>
  );
};

const buscarDatos = async (consulta: string) => {
  const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
  return await respuesta.json();
};

export default Tabs;
