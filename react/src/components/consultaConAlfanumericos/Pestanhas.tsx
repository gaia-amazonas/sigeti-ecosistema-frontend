// src/components/consultaConAlfanumericos/Pestanhas.tsx

import React, { useState, useEffect } from 'react';
import CulturalGraficoBurbuja from 'components/consultaConAlfanumericos/cultural/Contenido';
import GeneralTerritorio from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorio/Contenido';
import GeneralTerritorios from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorios/Contenido';

import GeneralComunidadesEnTerritorioDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import GeneralComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';
import CulturalComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';
import CulturalTodasComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';
import CulturalComunidadesEnTerritoriosDatosConsultados from 'tipos/cultural/datosConsultados';
import CulturalTodasComunidadesEnTerritoriosDatosConsultados from 'tipos/cultural/datosConsultados';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import {
  buscarPorComunidadesEnTerritorio as buscarGeneralPorComunidadesEnTerritorio,
  buscarPorTodasComunidadesEnTerritorio as buscarGeneralPorTodasComunidadesEnTerritorio,
  buscarPorComunidadesEnTerritorios as buscarGeneralPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorios as buscarGeneralPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarGeneralPorTodasComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/General';

import {
  buscarPorComunidadesEnTerritorio as buscarCulturalPorComunidadesEnTerritorio,
  buscarPorComunidadesEnTerritorio as buscarCulturalPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorio as buscarCulturalPorTodasComunidadesEnTerritorio,
  buscarPorTodasComunidadesEnTerritorios as buscarCulturalPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarCulturalPorTodasComunidadesEnTodosTerritorios
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
  cultural: CulturalComunidadesEnTerritoriosDatosConsultados;
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
  sexosPorLenguaEnComunidades: null,
  etniasEnComunidades: null
};

const culturalTodasComunidadesEnTerritorioDatosIniciales: CulturalTodasComunidadesEnTerritorioDatosConsultados = {
  sexosPorLenguaEnComunidades: null,
  etniasEnComunidades: null
}

const culturalComunidadesEnTerritoriosDatosIniciales: CulturalComunidadesEnTerritoriosDatosConsultados = {
  sexosPorLenguaEnComunidades: null,
  etniasEnComunidades: null
}

const culturalTodasComunidadesEnTerritoriosDatosIniciales: CulturalTodasComunidadesEnTerritoriosDatosConsultados = {
  sexosPorLenguaEnComunidades: null,
  etniasEnComunidades: null
}

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanhaGeneral');
  const [tipoConsulta, establecerTipoConsulta] = useState('');
  const [generalComunidadesEnTerritorioDatosConsultados, establecerGeneralComunidadesEnTerritorioDatosConsultados] = useState<GeneralComunidadesEnTerritorioDatosConsultados>(generalComunidadesEnTerritorioDatosIniciales);
    const [generalTodasComunidadesEnTerritorioDatosConsultados, establecerGeneralTodasComunidadesEnTerritorioDatosConsultados] = useState<GeneralComunidadesEnTerritorioDatosConsultados>(generalComunidadesEnTerritorioDatosIniciales);
  const [generalComunidadesEnTerritoriosDatosConsultados, establecerGeneralComunidadesEnTerritoriosDatosConsultados] = useState<GeneralComunidadesEnTerritoriosDatosConsultados>(generalComunidadesEnTerritoriosDatosIniciales);
  const [generalTodasComunidadesEnTerritoriosDatosConsultados, establecerGeneralTodasComunidadesEnTerritoriosDatosConsultados] = useState<GeneralComunidadesEnTerritoriosDatosConsultados>(generalComunidadesEnTerritoriosDatosIniciales);
  const [culturalComunidadesEnTerritorioDatosConsultados, establecerCulturalComunidadesEnTerritorioDatosConsultados] = useState<CulturalComunidadesEnTerritorioDatosConsultados>(culturalComunidadesEnTerritorioDatosIniciales);
  const [culturalTodasComunidadesEnTerritorioDatosConsultados, establecerCulturalTodasComunidadesEnTerritorioDatosConsultados] =  useState<CulturalTodasComunidadesEnTerritorioDatosConsultados>(culturalTodasComunidadesEnTerritorioDatosIniciales);
  const [culturalTodasComunidadesEnTerritoriosDatosConsultados, establecerCulturalTodasComunidadesEnTerritoriosDatosConsultados] = useState<CulturalTodasComunidadesEnTerritoriosDatosConsultados>(culturalTodasComunidadesEnTerritoriosDatosIniciales);
  const [culturalComunidadesEnTerritoriosDatosConsultados, establecerCulturalComunidadesEnTerritoriosDatosConsultados] = useState<CulturalComunidadesEnTerritoriosDatosConsultados>(culturalComunidadesEnTerritoriosDatosIniciales);
  const [culturalTodasComunidadesEnTodosTerritoriosDatosConsultados, establecerCulturalTodasComunidadesEnTodosTerritoriosDatosConsultados] = useState<CulturalComunidadesEnTerritoriosDatosConsultados>(culturalComunidadesEnTerritoriosDatosIniciales)

  const [datosPorPestanhaEnTerritorio, establecerDatosPorPestanhaEnTerritorio] = useState<DatosPorPestanhaEnTerritorioImp>({
    general: generalComunidadesEnTerritorioDatosIniciales,
    cultural: culturalComunidadesEnTerritorioDatosIniciales,
    educacion: []
  });

  const [datosPorPestanhaEnTerritorios, establecerDatosPorPestanhaEnTerritorios] = useState<DatosPorPestanhaEnTerritoriosImp>({
    general: generalComunidadesEnTerritoriosDatosIniciales,
    cultural: culturalComunidadesEnTerritoriosDatosIniciales,
    educacion: []
  });

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo, activo]);

  useEffect(() => {
    console.log("sssssssssss", culturalTodasComunidadesEnTodosTerritoriosDatosConsultados);
  }, [culturalTodasComunidadesEnTodosTerritoriosDatosConsultados]);

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

  const consultarTerritorio = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (datos.comunidadesId[0] !== 'Todas') {
      if (activo === 'pestanhaGeneral') {
        establecerGeneralComunidadesEnTerritorioDatosConsultados(await buscarGeneralPorComunidadesEnTerritorio(datos, modo));
      }
      if (activo === 'pestanhaCultural') {
        establecerCulturalComunidadesEnTerritorioDatosConsultados(await buscarCulturalPorComunidadesEnTerritorio(datos, modo));
      }
    } else {
      if (activo === 'pestanhaGeneral') {
        establecerGeneralTodasComunidadesEnTerritorioDatosConsultados(await buscarGeneralPorTodasComunidadesEnTerritorio(datos, modo));
      } 
      if (activo === 'pestanhaCultural') {
        establecerCulturalTodasComunidadesEnTerritorioDatosConsultados(await buscarCulturalPorTodasComunidadesEnTerritorio(datos, modo))
      }
    }
  };

  const consultarTerritorios = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (datos.comunidadesId[0] !== 'Todas') {
      if (activo === 'pestanhaGeneral') {
        establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorComunidadesEnTerritorios(datos, modo));
      }
      if (activo === 'pestanhaCultural') {
        establecerCulturalComunidadesEnTerritoriosDatosConsultados(await buscarCulturalPorComunidadesEnTerritorios(datos, modo));
      }
    } else {
      if (activo === 'pestanhaGeneral') {
        establecerGeneralTodasComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorTodasComunidadesEnTerritorios(datos, modo));
      }
      if (activo === 'pestanhaCultural') {
        establecerCulturalTodasComunidadesEnTerritoriosDatosConsultados(await buscarCulturalPorTodasComunidadesEnTerritorios(datos, modo));
      }
    }
  };

  const consultarTodosTerritoriosConTodasComunidades = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (activo === 'pestanhaGeneral') {
      establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorTodasComunidadesEnTodosTerritorios(modo));
    }
    if (activo === 'pestanhaCultural') {
      establecerCulturalTodasComunidadesEnTodosTerritoriosDatosConsultados(await buscarCulturalPorTodasComunidadesEnTodosTerritorios(modo));
    }
  };

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorio({
      general: generalComunidadesEnTerritorioDatosConsultados,
      cultural: culturalComunidadesEnTerritorioDatosIniciales,
      educacion: []
    });
    establecerTipoConsulta('enTerritorio');
  }, [generalComunidadesEnTerritorioDatosConsultados, culturalComunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    console.log("general", generalTodasComunidadesEnTerritorioDatosConsultados);
    console.log("cultural", culturalTodasComunidadesEnTerritorioDatosConsultados);
    establecerDatosPorPestanhaEnTerritorio({
      general: generalTodasComunidadesEnTerritorioDatosConsultados,
      cultural: culturalTodasComunidadesEnTerritorioDatosConsultados,
      educacion: []
    });
    establecerTipoConsulta('enTerritorio');
  }, [generalTodasComunidadesEnTerritorioDatosConsultados, culturalTodasComunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: generalComunidadesEnTerritoriosDatosConsultados,
      cultural: culturalComunidadesEnTerritoriosDatosConsultados,
      educacion: []
    });
    establecerTipoConsulta('enTerritorios');
  }, [generalComunidadesEnTerritoriosDatosConsultados, culturalComunidadesEnTerritoriosDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: generalTodasComunidadesEnTerritoriosDatosConsultados,
      cultural: culturalTodasComunidadesEnTerritoriosDatosConsultados,
      educacion: []
    });
    establecerTipoConsulta('enTerritorios');
  }, [generalTodasComunidadesEnTerritoriosDatosConsultados, culturalTodasComunidadesEnTerritoriosDatosConsultados]);

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
        {
          activo === 'pestanhaGeneral' &&
          tipoConsulta === 'enTerritorio' &&
          (
            <GeneralTerritorio datosGenerales={datosPorPestanhaEnTerritorio.general} modo={modo} />
          )
        }
        {
          activo === 'pestanhaGeneral' &&
          tipoConsulta !== 'enTerritorio' && 
          (
            <GeneralTerritorios datosGenerales={datosPorPestanhaEnTerritorios.general} modo={modo} />
          )
        }
        {
          activo === 'pestanhaCultural' &&
          culturalComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades &&
          culturalComunidadesEnTerritorioDatosConsultados.etniasEnComunidades && 
          (
          <>
            <CulturalGraficoBurbuja datos={culturalComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades.rows} labelKey="lengua" valueKey="conteo" />
            <CulturalGraficoBurbuja datos={culturalComunidadesEnTerritorioDatosConsultados.etniasEnComunidades.rows} labelKey="etnia" valueKey="conteo" />
          </>
          )
        }
        { activo === 'pestanhaCultural' &&
          culturalComunidadesEnTerritoriosDatosConsultados.sexosPorLenguaEnComunidades &&
          culturalComunidadesEnTerritoriosDatosConsultados.etniasEnComunidades &&
          (
          <>
            <CulturalGraficoBurbuja datos={culturalComunidadesEnTerritoriosDatosConsultados.sexosPorLenguaEnComunidades.rows} labelKey="lengua" valueKey="conteo" />
            <CulturalGraficoBurbuja datos={culturalComunidadesEnTerritoriosDatosConsultados.etniasEnComunidades.rows} labelKey="etnia" valueKey="conteo" />
          </>
          )
        }
        {
          activo === 'pestanhaCultural' &&
          culturalTodasComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades &&
          culturalTodasComunidadesEnTerritorioDatosConsultados.etniasEnComunidades &&
          (
            <>
              <CulturalGraficoBurbuja datos={culturalTodasComunidadesEnTerritorioDatosConsultados.sexosPorLenguaEnComunidades.rows} labelKey="lengua" valueKey="conteo" />
              <CulturalGraficoBurbuja datos={culturalTodasComunidadesEnTerritorioDatosConsultados.etniasEnComunidades.rows} labelKey="etnia" valueKey="conteo" />
            </>
          )
        }
        {
          activo === 'pestanhaCultural' &&
          culturalTodasComunidadesEnTerritoriosDatosConsultados.sexosPorLenguaEnComunidades &&
          culturalTodasComunidadesEnTerritoriosDatosConsultados.etniasEnComunidades &&
          (
            <>
              <CulturalGraficoBurbuja datos={culturalTodasComunidadesEnTerritoriosDatosConsultados.sexosPorLenguaEnComunidades.rows} labelKey="lengua" valueKey="conteo" />
              <CulturalGraficoBurbuja datos={culturalTodasComunidadesEnTerritoriosDatosConsultados.etniasEnComunidades.rows} labelKey="etnia" valueKey="conteo" />
            </>
          )
        }
        { activo === 'pestanhaCultural' &&
          culturalTodasComunidadesEnTodosTerritoriosDatosConsultados.sexosPorLenguaEnComunidades && 
          culturalTodasComunidadesEnTodosTerritoriosDatosConsultados.etniasEnComunidades &&
          (
            <>
              <CulturalGraficoBurbuja datos={culturalTodasComunidadesEnTodosTerritoriosDatosConsultados.sexosPorLenguaEnComunidades.rows} labelKey="lengua" valueKey="conteo" />
              <CulturalGraficoBurbuja datos={culturalTodasComunidadesEnTodosTerritoriosDatosConsultados.etniasEnComunidades.rows} labelKey="etnia" valueKey="conteo" />
            </>
          )
        }
        {activo === 'pestanhaEducacional' &&  <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;

const enUnTerritorio = (datos: DatosParaConsultar) => {
  return datos.territoriosId.length === 1 && datos.territoriosId[0] !== 'Todos';
};

const enTerritorios = (datos: DatosParaConsultar) => {
  return datos.territoriosId.length > 1;
};

const esTodosLosTerritoriosYComunidades = (datos: DatosParaConsultar) => {
  return datos.territoriosId.length === 1 && datos.territoriosId[0] === 'Todos' && datos.comunidadesId.length === 1 && datos.comunidadesId[0] === 'Todas';
};
