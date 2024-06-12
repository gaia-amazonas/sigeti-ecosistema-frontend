// src/components/Pestanhas.tsx
import React, { useState, useEffect } from 'react';

import { General } from 'components/consultaConAlfanumericos/general/General';
import BotonReiniciar from 'components/BotonReiniciar';
import { buscarDatos } from 'buscadores/datosSQL';
import consultasGeneralesPorTerritorio from 'consultas/bigQuery/alfanumerico/porTerritorios';
import consultasGeneralesTodosGeoTerritorios from 'consultas/bigQuery/alfanumerico/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from 'consultas/bigQuery/alfanumerico/todasGeoComunidadesPorTerritorio';
import { buscarTerritorios } from 'buscadores/geoJson';

import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

interface DatosParaConsultar {
  territorios_id: string[];
  comunidades_id: string[];
}

interface PestanhasImp {
  datosParaConsultar: DatosParaConsultar;
  reiniciar: () => void;
  modo: string;
}

interface DatosPorPestanhaImp {
  general: any[];
  cultural: any[];
  educacion: any[];
}

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanha_general');
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
    general: [],
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    
    const buscarDatosParaPestanha = async () => {
      if (datosParaConsultar.comunidades_id && datosParaConsultar.comunidades_id[0] !== 'Todas') {
        await buscarDatosPorTerritorioYComunidad(datosParaConsultar);
      } else if (datosParaConsultar.territorios_id[0] === 'Todos' && datosParaConsultar.comunidades_id[0] === 'Todas') {
        await buscarDatosParaTodosTerritoriosYComunidades();
      } else if (datosParaConsultar.comunidades_id[0] === 'Todas') {
        await buscarDatosPorTerritorio(datosParaConsultar);
      } else {
        throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidades_id}, territorio: ${datosParaConsultar.territorios_id})`);
      }
    };

    const buscarDatosPorTerritorioYComunidad = async (datos: any) => {

      const sexo = await buscarDatos(consultasGeneralesPorTerritorio.sexo(datosParaConsultar.comunidades_id), modo);
      const familias = await buscarDatos(consultasGeneralesPorTerritorio.familias(datosParaConsultar.comunidades_id), modo);
      const sexo_edad = await buscarDatos(consultasGeneralesPorTerritorio.sexo_edad(datosParaConsultar.comunidades_id), modo);
      const territorio = await buscarDatos(consultasGeneralesPorTerritorio.territorio(datosParaConsultar.comunidades_id), modo);
      const comunidades_en_territorio = await buscarDatos(consultasGeneralesPorTerritorio.comunidades_en_territorio(datosParaConsultar.comunidades_id), modo);
      const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorTerritorio.territorio(datosParaConsultar.comunidades_id), modo);
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

      const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datosParaConsultar.territorios_id), modo);
      const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datosParaConsultar.territorios_id), modo);
      const sexo_edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datosParaConsultar.territorios_id), modo);
      const territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datosParaConsultar.territorios_id), modo);
      const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datosParaConsultar.territorios_id), modo);
      const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datosParaConsultar.territorios_id), modo);
      establecerDatosPorPestanha(datosPrevios => ({
        ...datosPrevios,
        general: [sexo, familias, sexo_edad, territorio, comunidades_en_territorio, territoriosGeoJson],
      }));

    };
    buscarDatosParaPestanha();
    
  }, [datosParaConsultar, modo]);

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
