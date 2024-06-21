import React, { useState, useEffect } from 'react';

import General from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorio/General';

import { ComunidadesEnTerritorioDatosConsultados, TodasComunidadesEnTerritorioDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorio';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import { buscarPorComunidadesEnTerritorio,
  buscarPorTodasComunidadesTerritorio,
  buscarPorComunidadesEnTerritorios } from 'buscadores/paraAlfanumerica';

  // buscarPorComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTodosTerritorios } from 'buscadores/paraAlfanumerica';

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
  general: ComunidadesEnTerritorioDatosConsultados;
  cultural: any[];
  educacion: any[];
}


const comunidadesEnTerritorioDatosIniciales: ComunidadesEnTerritorioDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  poblacionPorComunidad: null,
  familiasConElectricidadPorComunidad: null,
  comunidadesGeoJson: null,
  territorioGeoJson: null
};


const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanha_general');
  const [comunidadesEnTerritorioDatosConsultados, establecerComunidadesEnTerritorioDatosConsultados] = useState<ComunidadesEnTerritorioDatosConsultados>(comunidadesEnTerritorioDatosIniciales);
  const [todasComunidadesEnTerritorioDatosConsultados, establecerTodasComunidadesEnTerritorioDatosConsultados] = useState<TodasComunidadesEnTerritorioDatosConsultados>(comunidadesEnTerritorioDatosIniciales);
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
    general: comunidadesEnTerritorioDatosIniciales,
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo]);

  useEffect(() => {
    establecerDatosPorPestanha({
      general: {
        sexo: comunidadesEnTerritorioDatosConsultados.sexo,
        familias: comunidadesEnTerritorioDatosConsultados.familias,
        sexoEdad: comunidadesEnTerritorioDatosConsultados.sexoEdad,
        familiasPorComunidad: comunidadesEnTerritorioDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: comunidadesEnTerritorioDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: comunidadesEnTerritorioDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: comunidadesEnTerritorioDatosConsultados.comunidadesGeoJson,
        territorioGeoJson: comunidadesEnTerritorioDatosConsultados.territorioGeoJson
      },
      cultural: [],
      educacion: []
    });
  }, [comunidadesEnTerritorioDatosConsultados]);

  const buscarDatosParaPestanha = async () => {
    let consultaValida: boolean = false;
    if (datosParaConsultar.territoriosId.length === 1) {
      if (datosParaConsultar.comunidadesId[0] !== 'Todas') {
        establecerComunidadesEnTerritorioDatosConsultados(await buscarPorComunidadesEnTerritorio({ datosParaConsultar, modo }));
        consultaValida = !consultaValida;
      } else {
        establecerComunidadesEnTerritorioDatosConsultados(await buscarPorTodasComunidadesTerritorio({ datosParaConsultar, modo }));
        consultaValida = !consultaValida;
      }
    }
    if (datosParaConsultar.territoriosId.length > 1) {
      if (datosParaConsultar.territoriosId[0] !== 'Todas') {
        establecerTodasComunidadesEnTerritorioDatosConsultados(await buscarDatosPorComunidadesEnTerritorios({ datosParaConsultar, modo }));
        consultaValida = !consultaValida;
      } else {
        establecerTodasComunidadesEnTerritorioDatosConsultados(await buscarDatosPorComunidadesEnTerritorios({ datosParaConsultar, modo}));
        consultaValida = !consultaValida;
      }
    }
    if (!consultaValida) {
      throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
    };
  };

  return (
    <Contenedor>
      <BotonReiniciar onClick={reiniciar} />
      <Titulo>Temáticas</Titulo>
      <ListaPestanhas>
        <EstiloPestanha $activo={activo === 'pestanha_general'} onClick={() => establecerActivo('pestanha_general')}>General</EstiloPestanha>
        <EstiloPestanha $activo={activo === 'pestanha_cultural'} onClick={() => establecerActivo('pestanha_cultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha $activo={activo === 'pestanha_educacional'} onClick={() => establecerActivo('pestanha_educacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanha_general' && <General datosGenerales={datosPorPestanha.general} modo={modo} />}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;