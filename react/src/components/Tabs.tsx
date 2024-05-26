// src/components/Tabs.tsx
import React, { useState, useEffect } from 'react';

import { General } from 'components/graficos/general/General';
import generalesQueries from 'components/consultas/generalesQueries';

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

    async function buscarDatosPorCategoria() {

      const sexo = await buscarDatos(generalesQueries.sexo(datos.comunidad_id, datos.territorio_id));
      const familias = await buscarDatos(generalesQueries.familias(datos.comunidad_id));
      const edad = await buscarDatos(generalesQueries.sexo_edad(datos.comunidad_id, datos.territorio_id));
      const territorio = await buscarDatos(generalesQueries.territorio(datos.territorio_id));
      const comunidades_en_territorio = await buscarDatos(generalesQueries.comunidades_en_territorio(datos.territorio_id));

      establecerDatosPorTab(datosPrevios => ({
        ...datosPrevios,
        general: [sexo, familias, edad, territorio, comunidades_en_territorio],
      }));

    };

    buscarDatosPorCategoria();

  }, [datos.comunidad_id, datos.territorio_id]);

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
