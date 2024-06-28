import React, { useState, useEffect } from 'react';
import CulturalBubbleChartD3 from 'components/consultaConAlfanumericos/cultural/Contenido';
import GeneralTerritorio from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorio/Contenido';
import GeneralTerritorios from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorios/Contenido';

import GeneralComunidadesEnTerritorioDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import GeneralComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';
import CulturalComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import logger from 'utilidades/logger';

import {
  buscarPorComunidadesEnTerritorio as buscarGeneralPorComunidadesEnTerritorio,
  buscarPorTodasComunidadesEnTerritorio as buscarGeneralPorTodasComunidadesEnTerritorio,
  buscarPorComunidadesEnTerritorios as buscarGeneralPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorios as buscarGeneralPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarGeneralPorTodasComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/General';

import {
  buscarPorComunidadesEnTerritorio as buscarCulturalPorComunidadesEnTerritorio
} from 'buscadores/paraAlfanumerica/Cultural';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface PestanhasImp {
  datosParaConsultar: DatosParaConsultar;
  reiniciar: () => void;
  modo: string;
}

interface DatosPorPestanhaEnTerritorioImp {
  general: GeneralComunidadesEnTerritorioDatosConsultados;
  cultural: CulturalComunidadesEnTerritorioDatosConsultados;
  educacion: any[];
}

interface DatosPorPestanhaEnTerritoriosImp {
  general: GeneralComunidadesEnTerritoriosDatosConsultados;
  cultural: any[];
  educacion: any[];
}

const generalComunidadesEnTerritorioDatosIniciales: GeneralComunidadesEnTerritorioDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  poblacionPorComunidad: null,
  familiasConElectricidadPorComunidad: null,
  comunidadesGeoJson: null,
  territorioGeoJson: null
};

const generalComunidadesEnTerritoriosDatosIniciales: GeneralComunidadesEnTerritoriosDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  poblacionPorComunidad: null,
  familiasConElectricidadPorComunidad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null,
  comunidadesEnTerritorios: null
};

const culturalComunidadesEnTerritorioDatosIniciales: CulturalComunidadesEnTerritorioDatosConsultados = {
  sexosPorLenguaEnComunidades: null
};

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanhaGeneral');
  const [tipoConsulta, establecerTipoConsulta] = useState('');
  const [generalComunidadesEnTerritorioDatosConsultados, establecerGeneralComunidadesEnTerritorioDatosConsultados] = useState<GeneralComunidadesEnTerritorioDatosConsultados>(generalComunidadesEnTerritorioDatosIniciales);
  const [generalComunidadesEnTerritoriosDatosConsultados, establecerGeneralComunidadesEnTerritoriosDatosConsultados] = useState<GeneralComunidadesEnTerritoriosDatosConsultados>(generalComunidadesEnTerritoriosDatosIniciales);
  const [generalTodasComunidadesEnTerritoriosDatosConsultados, establecerGeneralTodasComunidadesEnTerritoriosDatosConsultados] = useState<GeneralComunidadesEnTerritoriosDatosConsultados>(generalComunidadesEnTerritoriosDatosIniciales);
  const [culturalComunidadesEnTerritorioDatosConsultados, establecerCulturalComunidadesEnTerritorioDatosConsultados] = useState<CulturalComunidadesEnTerritorioDatosConsultados>(culturalComunidadesEnTerritorioDatosIniciales);

  const [datosPorPestanhaEnTerritorio, establecerDatosPorPestanhaEnTerritorio] = useState<DatosPorPestanhaEnTerritorioImp>({
    general: generalComunidadesEnTerritorioDatosIniciales,
    cultural: culturalComunidadesEnTerritorioDatosIniciales,
    educacion: []
  });
  const [datosPorPestanhaEnTerritorios, establecerDatosPorPestanhaEnTerritorios] = useState<DatosPorPestanhaEnTerritoriosImp>({
    general: generalComunidadesEnTerritoriosDatosIniciales,
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo, activo]);

  const buscarDatosParaPestanha = async () => {
    if (enUnTerritorio(datosParaConsultar)) {
      await consultarTerritorio(datosParaConsultar, modo);
      return;
    }
    if (enTerritorios(datosParaConsultar)) {
      await consultarTerritorios(datosParaConsultar, modo);
      return;
    }
    if (esTodosLosTerritoriosYComunidades(datosParaConsultar)) {
      await consultarTodosTerritoriosConTodasComunidades(datosParaConsultar, modo);
      return;
    }
    throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
  };

  const enUnTerritorio = (datos: DatosParaConsultar) => {
    return datos.territoriosId.length === 1 && datos.territoriosId[0] !== 'Todos';
  };

  const enTerritorios = (datos: DatosParaConsultar) => {
    return datos.territoriosId.length > 1;
  };

  const esTodosLosTerritoriosYComunidades = (datos: DatosParaConsultar) => {
    return datos.territoriosId.length === 1 && datos.territoriosId[0] === 'Todos' && datos.comunidadesId.length === 1 && datos.comunidadesId[0] === 'Todas';
  };

  const consultarTerritorio = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (datos.comunidadesId[0] !== 'Todas') {
      if (activo === 'pestanhaGeneral') {
        establecerGeneralComunidadesEnTerritorioDatosConsultados(await buscarGeneralPorComunidadesEnTerritorio(datos, modo));
      }
      if (activo === 'pestanhaCultural') {
        establecerCulturalComunidadesEnTerritorioDatosConsultados(await buscarCulturalPorComunidadesEnTerritorio(datos, modo));
      }
    } else {
      establecerGeneralComunidadesEnTerritorioDatosConsultados(await buscarGeneralPorTodasComunidadesEnTerritorio(datos, modo));
    }
  };

  const consultarTerritorios = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (datos.comunidadesId[0] !== 'Todas') {
      if (activo === 'pestanhaGeneral') {
        establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorComunidadesEnTerritorios(datos, modo));
      }
      if (activo === 'pestanhaCultural') {
        logger.log("What I need?");
      }
    } else {
      establecerGeneralTodasComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorTodasComunidadesEnTerritorios(datos, modo));
    }
  };

  const consultarTodosTerritoriosConTodasComunidades = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (activo === 'pestanhaGeneral') {
      establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorTodasComunidadesEnTodosTerritorios(datos, modo));
    }
    if (activo === 'pestanhaCultural') {
      logger.log("What I need?");
    }
  };

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorio({
      general: {
        sexo: generalComunidadesEnTerritorioDatosConsultados.sexo,
        familias: generalComunidadesEnTerritorioDatosConsultados.familias,
        sexoEdad: generalComunidadesEnTerritorioDatosConsultados.sexoEdad,
        familiasPorComunidad: generalComunidadesEnTerritorioDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: generalComunidadesEnTerritorioDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: generalComunidadesEnTerritorioDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: generalComunidadesEnTerritorioDatosConsultados.comunidadesGeoJson,
        territorioGeoJson: generalComunidadesEnTerritorioDatosConsultados.territorioGeoJson
      },
      cultural: culturalComunidadesEnTerritorioDatosIniciales,
      educacion: []
    });
    establecerTipoConsulta('enTerritorio');
  }, [generalComunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorio({
      general: generalComunidadesEnTerritorioDatosConsultados,
      cultural: {
        sexosPorLenguaEnComunidades: culturalComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades
      },
      educacion: []
    });
    establecerTipoConsulta('enTerritorio');
  }, [culturalComunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: {
        sexo: generalComunidadesEnTerritoriosDatosConsultados.sexo,
        familias: generalComunidadesEnTerritoriosDatosConsultados.familias,
        sexoEdad: generalComunidadesEnTerritoriosDatosConsultados.sexoEdad,
        familiasPorComunidad: generalComunidadesEnTerritoriosDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: generalComunidadesEnTerritoriosDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: generalComunidadesEnTerritoriosDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: generalComunidadesEnTerritoriosDatosConsultados.comunidadesGeoJson,
        territoriosGeoJson: generalComunidadesEnTerritoriosDatosConsultados.territoriosGeoJson,
        comunidadesEnTerritorios: generalComunidadesEnTerritoriosDatosConsultados.comunidadesEnTerritorios
      },
      cultural: [],
      educacion: []
    });
    establecerTipoConsulta('enTerritorios');
  }, [generalComunidadesEnTerritoriosDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: {
        sexo: generalTodasComunidadesEnTerritoriosDatosConsultados.sexo,
        familias: generalTodasComunidadesEnTerritoriosDatosConsultados.familias,
        sexoEdad: generalTodasComunidadesEnTerritoriosDatosConsultados.sexoEdad,
        familiasPorComunidad: generalTodasComunidadesEnTerritoriosDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: generalTodasComunidadesEnTerritoriosDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: generalTodasComunidadesEnTerritoriosDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: generalTodasComunidadesEnTerritoriosDatosConsultados.comunidadesGeoJson,
        territoriosGeoJson: generalTodasComunidadesEnTerritoriosDatosConsultados.territoriosGeoJson,
        comunidadesEnTerritorios: generalTodasComunidadesEnTerritoriosDatosConsultados.comunidadesEnTerritorios
      },
      cultural: [],
      educacion: []
    });
    establecerTipoConsulta('enTerritorios');
  }, [generalTodasComunidadesEnTerritoriosDatosConsultados]);

  return (
    <Contenedor>
      <BotonReiniciar onClick={reiniciar} />
      <Titulo>Temáticas</Titulo>
      <ListaPestanhas>
        <EstiloPestanha $activo={activo === 'pestanhaGeneral'} onClick={() => establecerActivo('pestanhaGeneral')}>General</EstiloPestanha>
        <EstiloPestanha $activo={activo === 'pestanhaCultural'} onClick={() => establecerActivo('pestanhaCultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha $activo={activo === 'pestanhaEducacional'} onClick={() => establecerActivo('pestanhaEducacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanhaGeneral' && tipoConsulta === 'enTerritorio' &&
          (<GeneralTerritorio datosGenerales={datosPorPestanhaEnTerritorio.general} modo={modo} />)}
        {activo === 'pestanhaGeneral' && tipoConsulta !== 'enTerritorio' && 
          (<GeneralTerritorios datosGenerales={datosPorPestanhaEnTerritorios.general} modo={modo} />)}
        {activo === 'pestanhaCultural' && culturalComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades && (
          <CulturalBubbleChartD3 data={culturalComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades.rows} />
        )}
        {activo === 'pestanhaEducacional' &&  <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;
