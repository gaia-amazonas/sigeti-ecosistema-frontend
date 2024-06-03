// src/components/Pestanhas.tsx
import React, { useState, useEffect } from 'react';

import { General } from 'components/graficos/general/General';
import BotonReiniciar from 'components/BotonReiniciar';
import { buscarDatos } from 'buscadores/datosSQL';
import consultasGeneralesPorTerritorio from '../../consultas/generales/porTerritorio';
import consultasGeneralesTodosGeoTerritorios from '../../consultas/generales/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from '../../consultas/generales/todasGeoComunidadesPorTerritorio';
import { buscarTerritorios } from '../../utils/geoJsonUtils';

import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/estilos/Pestanhas';
import { FeatureCollection } from 'geojson';

interface PestanhasImp {
  datos: any;
  reiniciar: () => void;
  modo: string;
}

interface DatosPorPestanhaImp {
  general: any[];
  cultural: any[];
  educacion: any[];
}

const Pestanhas: React.FC<PestanhasImp> = ({ datos = { comunidad_id: '', territorio_id: '' }, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanha_general');
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
    general: [],
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    const buscarDatosParaPestanha = async () => {
      if (datos.comunidad_id && datos.comunidad_id !== 'Todas') {
        await buscarDatosPorTerritorioYComunidad(datos);
      } else if (datos.territorio_id === 'Todos' && datos.comunidad_id === 'Todas') {
        await buscarDatosParaTodosTerritoriosYComunidades();
      } else if (datos.comunidad_id === 'Todas') {
        await buscarDatosPorTerritorio(datos);
      } else {
        throw new Error(`Tipo de filtrado no manejado (comunidad: ${datos.comunidad_id}, territorio: ${datos.territorio_id})`);
      }
    };

    const buscarDatosPorTerritorioYComunidad = async (datos: any) => {
      const sexo = await buscarDatos(consultasGeneralesPorTerritorio.sexo(datos.comunidad_id), modo);
      const familias = await buscarDatos(consultasGeneralesPorTerritorio.familias(datos.comunidad_id), modo);
      const sexo_edad = await buscarDatos(consultasGeneralesPorTerritorio.sexo_edad(datos.comunidad_id), modo);
      const territorio = await buscarDatos(consultasGeneralesPorTerritorio.territorio(datos.comunidad_id), modo);
      const comunidades_en_territorio = await buscarDatos(consultasGeneralesPorTerritorio.comunidades_en_territorio(datos.comunidad_id), modo);
      const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorTerritorio.territorio(datos.comunidad_id), modo);

      establecerDatosPorPestanha(datosPrevios => ({
        ...datosPrevios,
        general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio, territoriosGeoJson],
      }));
    };

    const buscarDatosParaTodosTerritoriosYComunidades = async () => {
      const sexo = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo, modo);
      const familias = await buscarDatos(consultasGeneralesTodosGeoTerritorios.familias, modo);
      const sexo_edad = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo_edad, modo);
      const territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.territorio, modo);
      const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.comunidades_en_territorio, modo);
      const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodosGeoTerritorios.territorio, modo);

      establecerDatosPorPestanha(datosPrevios => ({
        ...datosPrevios,
        general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio, territoriosGeoJson],
      }));
    };

    const buscarDatosPorTerritorio = async (datos: any) => {
      const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datos.territorio_id), modo);
      const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datos.territorio_id), modo);
      const sexo_edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datos.territorio_id), modo);
      const territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datos.territorio_id), modo);
      const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datos.territorio_id), modo);
      const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datos.territorio_id), modo);

      establecerDatosPorPestanha(datosPrevios => ({
        ...datosPrevios,
        general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio, territoriosGeoJson],
      }));
    };

    buscarDatosParaPestanha();
  }, [datos, modo]);

  useEffect(() => {
    console.log("TERRITORIOS GEOJSON", territoriosGeoJson);
  }, [territoriosGeoJson]);

  useEffect(() => {
    console.log("DATOS PESTANHA", datosPorPestanha);
  }, [datosPorPestanha]);

  return (
    <Contenedor>
      <BotonReiniciar onClick={reiniciar} />
      <Titulo>Temáticas</Titulo>
      <ListaPestanhas>
        <EstiloPestanha active={activo === 'pestanha_general'} onClick={() => establecerActivo('pestanha_general')}>General</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_cultural'} onClick={() => establecerActivo('pestanha_cultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_educacional'} onClick={() => establecerActivo('pestanha_educacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanha_general' && <General datos={datosPorPestanha.general} />}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;
