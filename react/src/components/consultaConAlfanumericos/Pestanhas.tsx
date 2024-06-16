import React, { useState, useEffect } from 'react';
import { General } from 'components/consultaConAlfanumericos/general/General';
import DatosConsultados from 'tipos/datosConsultados';
import ComunidadesEnTerritorioDatosConsultados from 'tipos/comunidadesEnTerritorioDatosConsultados';
import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';
import { buscarDatosPorComunidadesEnTerritorio, buscarDatosParaTodosTerritoriosYComunidades, buscarDatosPorTerritorio } from 'buscadores/paraAlfanumerica';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
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

const comunidadesEnTerritorioDatosConsultadosIniciales: ComunidadesEnTerritorioDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  sexoEdadPorComunidad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null
};

const datosConsultadosIniciales: DatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  sexoEdadPorComunidad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null,
};

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [tipoConsulta, establecerTipoConsulta] = useState('');
  const [activo, establecerActivo] = useState('pestanha_general');
  const [datosConsultados, establecerDatosConsultados] = useState<DatosConsultados>(datosConsultadosIniciales);
  const [comunidadesEnTerritorioDatosConsultados, establecerComunidadesEnTerritorioDatosConsultados] = useState<ComunidadesEnTerritorioDatosConsultados>(comunidadesEnTerritorioDatosConsultadosIniciales);
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
    general: [],
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo]);

  useEffect(() => {
    if (datosConsultados) {
      establecerDatosPorPestanha({
        general: [
          datosConsultados.sexo,
          datosConsultados.familias,
          datosConsultados.sexoEdad,
          datosConsultados.familiasPorComunidad,
          datosConsultados.sexoEdadPorComunidad,
          datosConsultados.comunidadesGeoJson,
          datosConsultados.territoriosGeoJson
        ],
        cultural: [],
        educacion: []
      });
    }
  }, [datosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanha({
      general: [
        comunidadesEnTerritorioDatosConsultados.sexo,
        comunidadesEnTerritorioDatosConsultados.familias,
        comunidadesEnTerritorioDatosConsultados.sexoEdad,
        comunidadesEnTerritorioDatosConsultados.familiasPorComunidad,
        comunidadesEnTerritorioDatosConsultados.sexoEdadPorComunidad,
        comunidadesEnTerritorioDatosConsultados.comunidadesGeoJson,
        comunidadesEnTerritorioDatosConsultados.territoriosGeoJson
      ],
      cultural: [],
      educacion: []
    });
  }, [comunidadesEnTerritorioDatosConsultados]);

  const buscarDatosParaPestanha = async () => {
    if (datosParaConsultar.comunidadesId && datosParaConsultar.comunidadesId[0] !== 'Todas') {
      establecerComunidadesEnTerritorioDatosConsultados(await buscarDatosPorComunidadesEnTerritorio({ datosParaConsultar, modo }));
      establecerTipoConsulta('consultaComunidadesEnTerritorio');
    } else if (datosParaConsultar.territoriosId[0] === 'Todos' && datosParaConsultar.comunidadesId[0] === 'Todas') {
      establecerDatosConsultados(await buscarDatosParaTodosTerritoriosYComunidades(modo));
    } else if (datosParaConsultar.comunidadesId[0] === 'Todas') {
      establecerDatosConsultados(await buscarDatosPorTerritorio(datosParaConsultar, modo));
    } else {
      throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
    };
  };

  const determinarTipoConsulta = async () => {
    if (comunidadesEnTerritorioDatosConsultados === comunidadesEnTerritorioDatosConsultadosIniciales) establecerTipoConsulta('consultaComunidadesEnTerritorio');
    if (datosConsultados === datosConsultadosIniciales) establecerTipoConsulta('POR LLENAR ESTA FUNCIÓN');
    /////////////////////////////////////////////////////////////////////////////////
    ///////////// CONTINUAR AQUÍ MAÑANA /////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
  }

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
        {activo === 'pestanha_general' && <General datosGenerales={datosPorPestanha.general} modo={modo} tipoConsulta={tipoConsulta} />}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;