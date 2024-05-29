// src/components/Pestanhas.tsx
import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import Link from 'next/link'; // Import the Link component from next/link

import { General } from 'components/graficos/general/General';
import consultasGeneralesPorTerritorio from 'consultas/generales/porTerritorio';
import consultasGeneralesTodosGeoTerritorios from 'consultas/generales/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from 'consultas/generales/todasGeoComunidadesPorTerritorio';

import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/estilos/Pestanhas';

interface PestanhasImp {
  datos: any;
}

interface DatosPorPestanhaImp {
  general: any[];
  cultural: any[];
  educacion: any[];
}

const Pestanhas: React.FC<PestanhasImp> = ({ datos }) => {
  
  const [activo, establecerActivo] = useState('pestanha_general');
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
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
    const sexo_edad = await buscarDatos(consultasGeneralesPorTerritorio.sexo_edad(datos.comunidad_id));
    const territorio = await buscarDatos(consultasGeneralesPorTerritorio.territorio(datos.comunidad_id));
    const comunidades_en_territorio = await buscarDatos(consultasGeneralesPorTerritorio.comunidades_en_territorio(datos.comunidad_id));

    establecerDatosPorPestanha(datosPrevios => ({
      ...datosPrevios,
      general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio],
    }));
  };

  const buscarDatosParaTodosTerritoriosYComunidades = async () => {
    const sexo = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo);
    const familias = await buscarDatos(consultasGeneralesTodosGeoTerritorios.familias);
    const sexo_edad = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo_edad);
    const territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.territorio);
    const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.comunidades_en_territorio);

    establecerDatosPorPestanha(datosPrevios => ({
      ...datosPrevios,
      general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio],
    }));
  };

  const buscarDatosPorTerritorio = async (datos: any) => {
    const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datos.territorio_id));
    const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datos.territorio_id));
    const sexo_edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datos.territorio_id));
    const territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datos.territorio_id));
    const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datos.territorio_id));

    establecerDatosPorPestanha(datosPrevios => ({
      ...datosPrevios,
      general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio],
    }));
  };

  return (
    <Contenedor>
      <Titulo>
        Temáticas
        <Link href="/">
        </Link>
      </Titulo>
      <ListaPestanhas>
        <EstiloPestanha active={activo === 'pestanha_general'} onClick={() => establecerActivo('pestanha_general')}>General</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_cultural'} onClick={() => establecerActivo('pestanha_cultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_educacional'} onClick={() => establecerActivo('pestanha_educacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanha_general' && <General data={datosPorPestanha.general} />}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

const buscarDatos = async (consulta: string) => {
  const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
  return await respuesta.json();
};

export default Pestanhas;
