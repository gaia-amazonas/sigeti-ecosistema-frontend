// src/components/consultaConAlfanumericos/Pestanhas.tsx

import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import GeneralTerritorio from './general/comunidadesEnTerritorio/Contenido';
import GeneralTerritorios from './general/comunidadesEnTerritorios/Contenido';
import CulturalGraficoBurbuja from './cultural/BurbujaWrapper';
import Educacional from './educacional/Contenido';
import Salud from './salud/Contenido';

import GeneralComunidadesEnTerritorioDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import GeneralComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';
import CulturalComunidadesEnTerritorioDatosConsultados, { ComunidadesGeoJson, TerritoriosGeoJson } from 'tipos/cultural/datosConsultados';
import CulturalComunidadesEnTerritoriosDatosConsultados from 'tipos/cultural/datosConsultados';
import EducacionalComunidadesEnTerritorioDatosConsultados from 'tipos/educacional/datosConsultados';
import EducacionalComunidadesEnTerritoriosDatosConsultados from 'tipos/educacional/datosConsultados';
import SaludComunidadesEnTerritoriosDatosConsultados from 'tipos/salud/datosConsultados';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import {
  buscarPorComunidadesEnTerritorio as buscarGeneralPorComunidadesEnTerritorio,
  buscarPorTodasComunidadesEnTerritorio as buscarGeneralPorTodasComunidadesEnTerritorio,
  buscarPorComunidadesEnTerritorios as buscarGeneralPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorios as buscarGeneralPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarGeneralPorTodasComunidadesEnTodosTerritorios,
  buscarPorComunidadesEnTodosTerritorios as buscarGeneralPorComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/General';

import {
  buscarPorComunidadesEnTerritorio as buscarCulturalPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorios as buscarCulturalPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarCulturalPorTodasComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/Cultural';

import {
  buscarPorComunidadesEnTerritorio as buscarEducacionalPorComunidadesEnTerritorio,
  buscarPorComunidadesEnTerritorios as buscarEducacionalPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorio as buscarEducacionalPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarEducacionalPorTodasComunidadesEnTodosTerritorios,
  buscarPorComunidadesEnTodosTerritorios as buscarEducacionalPorComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/Educacional';

import {
  buscarPorComunidadesEnTerritorios as buscarSaludPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorios as buscarSaludPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios as buscarSaludPorTodasComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/Salud';
import EstiloGlobal from 'estilos_paginas/global';

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
  educacion: EducacionalComunidadesEnTerritorioDatosConsultados;
  salud: SaludComunidadesEnTerritoriosDatosConsultados;
}

interface DatosPorPestanhaEnTerritoriosImp {
  general: GeneralComunidadesEnTerritoriosDatosConsultados;
  cultural: CulturalComunidadesEnTerritoriosDatosConsultados;
  educacion: EducacionalComunidadesEnTerritoriosDatosConsultados;
  salud: SaludComunidadesEnTerritoriosDatosConsultados;
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

const culturalComunidadesEnTerritoriosDatosIniciales: CulturalComunidadesEnTerritoriosDatosConsultados = {
  pueblos: null,
  lenguas: null,
  etnias: null,
  clanes: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null
};

const educacionalComunidadesEnTerritorioDatosIniciales: EducacionalComunidadesEnTerritorioDatosConsultados = {
  escolaridadPrimariaYSecundaria: null,
  escolaridadJoven: null,
  escolaridad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null
};

const educacionalComunidadesEnTerritoriosDatosIniciales: EducacionalComunidadesEnTerritoriosDatosConsultados = {
  escolaridadPrimariaYSecundaria: null,
  escolaridadJoven: null,
  escolaridad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null
};

const educacionalTodasComunidadesEnTodosTerritoriosDatosIniciales: EducacionalComunidadesEnTerritoriosDatosConsultados = {
  escolaridadPrimariaYSecundaria: null,
  escolaridadJoven: null,
  escolaridad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null
};

const saludComunidadesEnTerritoriosDatosIniciales: SaludComunidadesEnTerritoriosDatosConsultados = {
  mujeresEnEdadFertil: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null
}

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  
  const territoriosPrivados = useUser().user?.territoriosPrivados;
  const [activo, establecerActivo] = useState('pestanhaGeneral');
  const [tipoConsulta, establecerTipoConsulta] = useState('');

  const [generalComunidadesEnTerritorioDatosConsultados, establecerGeneralComunidadesEnTerritorioDatosConsultados] = useState<GeneralComunidadesEnTerritorioDatosConsultados>(generalComunidadesEnTerritorioDatosIniciales);
  const [generalTodasComunidadesEnTerritorioDatosConsultados, establecerGeneralTodasComunidadesEnTerritorioDatosConsultados] = useState<GeneralComunidadesEnTerritorioDatosConsultados>(generalComunidadesEnTerritorioDatosIniciales);
  const [generalComunidadesEnTerritoriosDatosConsultados, establecerGeneralComunidadesEnTerritoriosDatosConsultados] = useState<GeneralComunidadesEnTerritoriosDatosConsultados>(generalComunidadesEnTerritoriosDatosIniciales);
  const [generalTodasComunidadesEnTerritoriosDatosConsultados, establecerGeneralTodasComunidadesEnTerritoriosDatosConsultados] = useState<GeneralComunidadesEnTerritoriosDatosConsultados>(generalComunidadesEnTerritoriosDatosIniciales);

  const [culturalComunidadesEnTerritorioDatosConsultados, establecerCulturalComunidadesEnTerritorioDatosConsultados] = useState<CulturalComunidadesEnTerritorioDatosConsultados>(culturalComunidadesEnTerritoriosDatosIniciales);
  const [culturalTodasComunidadesEnTerritorioDatosConsultados, establecerCulturalTodasComunidadesEnTerritorioDatosConsultados] =  useState<CulturalComunidadesEnTerritorioDatosConsultados>(culturalComunidadesEnTerritoriosDatosIniciales);
  const [culturalTodasComunidadesEnTerritoriosDatosConsultados, establecerCulturalTodasComunidadesEnTerritoriosDatosConsultados] = useState<CulturalComunidadesEnTerritorioDatosConsultados>(culturalComunidadesEnTerritoriosDatosIniciales);
  const [culturalComunidadesEnTerritoriosDatosConsultados, establecerCulturalComunidadesEnTerritoriosDatosConsultados] = useState<CulturalComunidadesEnTerritorioDatosConsultados>(culturalComunidadesEnTerritoriosDatosIniciales);

  const [educacionalComunidadesEnTerritorioDatosConsultados, establecerEducacionalComunidadesEnTerritorioDatosConsultados] = useState<EducacionalComunidadesEnTerritorioDatosConsultados>(educacionalComunidadesEnTerritorioDatosIniciales);
  const [educacionalTodasComunidadesEnTerritorioDatosConsultados, establecerEducacionalTodasComunidadesEnTerritorioDatosConsultados]  = useState<EducacionalComunidadesEnTerritorioDatosConsultados>(educacionalComunidadesEnTerritorioDatosIniciales);
  const [educacionalComunidadesEnTerritoriosDatosConsultados, establecerEducacionalComunidadesEnTerritoriosDatosConsultados] = useState<EducacionalComunidadesEnTerritoriosDatosConsultados>(educacionalComunidadesEnTerritoriosDatosIniciales);
  const [educacionalTodasComunidadesEnTerritoriosDatosConsultados, establecerEducacionalTodasComunidadesEnTerritoriosDatosConsultados] = useState<EducacionalComunidadesEnTerritoriosDatosConsultados>(educacionalTodasComunidadesEnTodosTerritoriosDatosIniciales);

  const [saludComunidadesEnTerritorioDatosConsultados, establecerSaludComunidadesEnTerritorioDatosConsultados] = useState<SaludComunidadesEnTerritoriosDatosConsultados>(saludComunidadesEnTerritoriosDatosIniciales);
  const [saludTodasComunidadesEnTerritorioDatosConsultados, establecerSaludTodasComunidadesEnTerritorioDatosConsultados] = useState<SaludComunidadesEnTerritoriosDatosConsultados>(saludComunidadesEnTerritoriosDatosIniciales);
  const [saludComunidadesEnTerritoriosDatosConsultados, establecerSaludComunidadesEnTerritoriosDatosConsultados] = useState<SaludComunidadesEnTerritoriosDatosConsultados>(saludComunidadesEnTerritoriosDatosIniciales);
  const [saludTodasComunidadesEnTerritoriosDatosConsultados, establecerSaludTodasComunidadesEnTerritoriosDatosConsultados] = useState<SaludComunidadesEnTerritoriosDatosConsultados>(saludComunidadesEnTerritoriosDatosIniciales);

  const [datosPorPestanhaEnTerritorio, establecerDatosPorPestanhaEnTerritorio] = useState<DatosPorPestanhaEnTerritorioImp>({
    general: generalComunidadesEnTerritorioDatosIniciales,
    cultural: culturalComunidadesEnTerritoriosDatosIniciales,
    educacion: educacionalComunidadesEnTerritorioDatosIniciales,
    salud: saludComunidadesEnTerritoriosDatosIniciales
  });

  const [datosPorPestanhaEnTerritorios, establecerDatosPorPestanhaEnTerritorios] = useState<DatosPorPestanhaEnTerritoriosImp>({
    general: generalComunidadesEnTerritoriosDatosIniciales,
    cultural: culturalComunidadesEnTerritoriosDatosIniciales,
    educacion: educacionalComunidadesEnTerritoriosDatosIniciales,
    salud: saludComunidadesEnTerritoriosDatosIniciales
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
    if (enTodosTerritorios(datosParaConsultar)) {
      await consultarTodosTerritorios(datosParaConsultar, modo);
      return;
    }
    if (esTodosLosTerritoriosYComunidades(datosParaConsultar)) {
      await consultarTodosTerritoriosConTodasComunidades(modo);
      return;
    }
    throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
  };


  const consultarTerritorio = async (datos: DatosParaConsultar, modo: string | string[]) => {
    const buscarGeneral = activo === 'pestanhaGeneral';
    const buscarCultural = activo === 'pestanhaCultural';
    const buscarEducacional = activo === 'pestanhaEducacional';
    const buscarSalud = activo === 'pestanhaSalud';
    if (datos.comunidadesId[0] !== 'Todas') {
      if (buscarGeneral) establecerGeneralComunidadesEnTerritorioDatosConsultados(await buscarGeneralPorComunidadesEnTerritorio(datos, modo));
      if (buscarCultural) establecerCulturalComunidadesEnTerritorioDatosConsultados(await buscarCulturalPorComunidadesEnTerritorios(datos, modo));
      if (buscarEducacional) establecerEducacionalComunidadesEnTerritorioDatosConsultados(await buscarEducacionalPorComunidadesEnTerritorio(datos, modo, territoriosPrivados ? territoriosPrivados : []));
      if (buscarSalud) establecerSaludComunidadesEnTerritorioDatosConsultados(await buscarSaludPorComunidadesEnTerritorios(datos, modo, territoriosPrivados));
    } else {
      if (buscarGeneral) establecerGeneralTodasComunidadesEnTerritorioDatosConsultados(await buscarGeneralPorTodasComunidadesEnTerritorio(datos, modo));
      if (buscarCultural) establecerCulturalTodasComunidadesEnTerritorioDatosConsultados(await buscarCulturalPorTodasComunidadesEnTerritorios(datos, modo));
      if (buscarEducacional) establecerEducacionalTodasComunidadesEnTerritorioDatosConsultados(await buscarEducacionalPorTodasComunidadesEnTerritorios(datos, modo, territoriosPrivados ? territoriosPrivados : []));
      if (buscarSalud) establecerSaludTodasComunidadesEnTerritorioDatosConsultados(await buscarSaludPorTodasComunidadesEnTerritorios(datos, modo, territoriosPrivados));
    }
  };

  const consultarTerritorios = async (datos: DatosParaConsultar, modo: string | string[]) => {
    const buscarGeneral = activo === 'pestanhaGeneral';
    const buscarCultural = activo === 'pestanhaCultural';
    const buscarEducacional = activo === 'pestanhaEducacional';
    const buscarSalud = activo === 'pestanhaSalud';
    if (datos.comunidadesId[0] !== 'Todas') {
      if (buscarGeneral) establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorComunidadesEnTerritorios(datos, modo));
      if (buscarCultural) establecerCulturalComunidadesEnTerritoriosDatosConsultados(await buscarCulturalPorComunidadesEnTerritorios(datos, modo));
      if (buscarEducacional) establecerEducacionalComunidadesEnTerritoriosDatosConsultados(await buscarEducacionalPorComunidadesEnTerritorios(datos, modo, territoriosPrivados ? territoriosPrivados : []));
      if (buscarSalud) establecerSaludComunidadesEnTerritoriosDatosConsultados(await buscarSaludPorComunidadesEnTerritorios(datos, modo, territoriosPrivados));
    } else {
      if (buscarGeneral) establecerGeneralTodasComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorTodasComunidadesEnTerritorios(datos, modo));
      if (buscarCultural) establecerCulturalTodasComunidadesEnTerritoriosDatosConsultados(await buscarCulturalPorTodasComunidadesEnTerritorios(datos, modo));
      if (buscarEducacional) establecerEducacionalTodasComunidadesEnTerritoriosDatosConsultados(await buscarEducacionalPorTodasComunidadesEnTerritorios(datos, modo, territoriosPrivados ? territoriosPrivados : []));
      if (buscarSalud) establecerSaludTodasComunidadesEnTerritoriosDatosConsultados(await buscarSaludPorTodasComunidadesEnTerritorios(datos, modo, territoriosPrivados));
    }
  };

  const consultarTodosTerritorios = async (datos: DatosParaConsultar, modo: string | string[]) => {
    const buscarGeneral = activo === 'pestanhaGeneral';
    const buscarCultural = activo === 'pestanhaCultural';
    const buscarEducacional = activo === 'pestanhaEducacional';
    const buscarSalud = activo === 'pestanhaSalud';
    if (buscarGeneral) establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorComunidadesEnTodosTerritorios(datos, modo));
    if (buscarCultural) establecerCulturalComunidadesEnTerritoriosDatosConsultados(await buscarCulturalPorComunidadesEnTerritorios(datos, modo));
    if (buscarEducacional) establecerEducacionalComunidadesEnTerritoriosDatosConsultados(await buscarEducacionalPorComunidadesEnTodosTerritorios(datos, modo, territoriosPrivados ? territoriosPrivados : []));
    if (buscarSalud) establecerSaludComunidadesEnTerritoriosDatosConsultados(await buscarSaludPorComunidadesEnTerritorios(datos, modo, territoriosPrivados));
  }

  const consultarTodosTerritoriosConTodasComunidades = async (modo: string | string[]) => {
    const buscarGeneral = activo === 'pestanhaGeneral';
    const buscarCultural = activo === 'pestanhaCultural';
    const buscarEducacional = activo === 'pestanhaEducacional';
    const buscarSalud = activo === 'pestanhaSalud';
    if (buscarGeneral) establecerGeneralComunidadesEnTerritoriosDatosConsultados(await buscarGeneralPorTodasComunidadesEnTodosTerritorios(modo));
    if (buscarCultural) establecerCulturalTodasComunidadesEnTerritoriosDatosConsultados(await buscarCulturalPorTodasComunidadesEnTodosTerritorios(modo));
    if (buscarEducacional) establecerEducacionalTodasComunidadesEnTerritoriosDatosConsultados(await buscarEducacionalPorTodasComunidadesEnTodosTerritorios(modo, territoriosPrivados ? territoriosPrivados : []));
    if (buscarSalud) establecerSaludTodasComunidadesEnTerritoriosDatosConsultados(await buscarSaludPorTodasComunidadesEnTodosTerritorios(modo, territoriosPrivados));
  };

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorio({
      general: generalComunidadesEnTerritorioDatosConsultados,
      cultural: culturalComunidadesEnTerritorioDatosConsultados,
      educacion: educacionalComunidadesEnTerritorioDatosConsultados,
      salud: saludComunidadesEnTerritorioDatosConsultados
    });
    establecerTipoConsulta('enTerritorio');
  }, [generalComunidadesEnTerritorioDatosConsultados,
    culturalComunidadesEnTerritorioDatosConsultados,
    educacionalComunidadesEnTerritorioDatosConsultados,
    saludComunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorio({
      general: generalTodasComunidadesEnTerritorioDatosConsultados,
      cultural: culturalTodasComunidadesEnTerritorioDatosConsultados,
      educacion: educacionalTodasComunidadesEnTerritorioDatosConsultados,
      salud: saludTodasComunidadesEnTerritorioDatosConsultados
    });
    establecerTipoConsulta('enTerritorio');
  }, [generalTodasComunidadesEnTerritorioDatosConsultados,
    culturalTodasComunidadesEnTerritorioDatosConsultados,
    educacionalTodasComunidadesEnTerritorioDatosConsultados,
    saludTodasComunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: generalComunidadesEnTerritoriosDatosConsultados,
      cultural: culturalComunidadesEnTerritoriosDatosConsultados,
      educacion: educacionalComunidadesEnTerritoriosDatosConsultados,
      salud: saludComunidadesEnTerritoriosDatosConsultados
    });
    establecerTipoConsulta('enTerritorios');
  }, [generalComunidadesEnTerritoriosDatosConsultados,
    culturalComunidadesEnTerritoriosDatosConsultados,
    educacionalComunidadesEnTerritoriosDatosConsultados,
    saludComunidadesEnTerritoriosDatosConsultados]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: generalTodasComunidadesEnTerritoriosDatosConsultados,
      cultural: culturalTodasComunidadesEnTerritoriosDatosConsultados,
      educacion: educacionalTodasComunidadesEnTerritoriosDatosConsultados,
      salud: saludTodasComunidadesEnTerritoriosDatosConsultados
    });
    establecerTipoConsulta('enTerritorios');
  }, [generalTodasComunidadesEnTerritoriosDatosConsultados,
    culturalTodasComunidadesEnTerritoriosDatosConsultados,
    educacionalTodasComunidadesEnTerritoriosDatosConsultados,
    saludTodasComunidadesEnTerritoriosDatosConsultados]);

  const renderizaContenidoGeneral = () => {
    return tipoConsulta === 'enTerritorio' ? (
      <GeneralTerritorio datosGenerales={datosPorPestanhaEnTerritorio.general} datosParaConsulta={datosParaConsultar} modo={modo} />
    ) : (
      <GeneralTerritorios datosGenerales={datosPorPestanhaEnTerritorios.general} datosParaConsulta={datosParaConsultar} modo={modo} />
    );
  };

  const renderizaContenidoCultural = () => {
    let queEstoyViendo: {
      comunidadesGeoJson: ComunidadesGeoJson | null;
      territoriosGeoJson: TerritoriosGeoJson | null;
    };
    if (tipoConsulta === 'enTerritorio') {
      queEstoyViendo = {
        comunidadesGeoJson: datosPorPestanhaEnTerritorio.cultural.comunidadesGeoJson,
        territoriosGeoJson: datosPorPestanhaEnTerritorio.cultural.territoriosGeoJson
      };
      return <CulturalGraficoBurbuja datos={datosPorPestanhaEnTerritorio.cultural} queEstoyViendo={queEstoyViendo} modo={modo} />;
    }
    queEstoyViendo = {
      comunidadesGeoJson: datosPorPestanhaEnTerritorios.cultural.comunidadesGeoJson,
      territoriosGeoJson: datosPorPestanhaEnTerritorios.cultural.territoriosGeoJson
    }
    return <CulturalGraficoBurbuja datos={datosPorPestanhaEnTerritorios.cultural} queEstoyViendo={queEstoyViendo} modo={modo} />;
  };

  const renderizaContenidoEducacional = () => {
    let queEstoyViendo: {
      comunidadesGeoJson: ComunidadesGeoJson | null;
      territoriosGeoJson: TerritoriosGeoJson | null;
    };
    if (tipoConsulta === 'enTerritorio') {
      queEstoyViendo = {
        comunidadesGeoJson: datosPorPestanhaEnTerritorio.educacion.comunidadesGeoJson,
        territoriosGeoJson: datosPorPestanhaEnTerritorio.educacion.territoriosGeoJson
      };
      return <Educacional datosEducacionales={datosPorPestanhaEnTerritorio.educacion} datosParaConsulta={datosParaConsultar} queEstoyViendo={queEstoyViendo} modo={modo}></Educacional>;
    }
    queEstoyViendo = {
      comunidadesGeoJson: datosPorPestanhaEnTerritorios.educacion.comunidadesGeoJson,
      territoriosGeoJson: datosPorPestanhaEnTerritorios.educacion.territoriosGeoJson
    }
    return <Educacional datosEducacionales={datosPorPestanhaEnTerritorios.educacion} datosParaConsulta={datosParaConsultar} queEstoyViendo={queEstoyViendo} modo={modo}></Educacional>;
  };

  const renderizaContenidoSalud = () => {
    const territorio = tipoConsulta === 'enTerritorio';
    if (territorio) return <Salud datos={datosPorPestanhaEnTerritorio.salud} />;
    return <Salud datos={datosPorPestanhaEnTerritorios.salud} />;
  };

  return (
    <>
      <EstiloGlobal />
      <Contenedor>
        <BotonReiniciar onClick={reiniciar} />
        <Titulo>Temáticas</Titulo>
        <ListaPestanhas>
          <EstiloPestanha $activo={activo === 'pestanhaGeneral'} onClick={() => establecerActivo('pestanhaGeneral')}>Cuántos somos?</EstiloPestanha>
          <EstiloPestanha $activo={activo === 'pestanhaCultural'} onClick={() => establecerActivo('pestanhaCultural')}>Cultural</EstiloPestanha>
          <EstiloPestanha $activo={activo === 'pestanhaEducacional'} onClick={() => establecerActivo('pestanhaEducacional')}>Educación</EstiloPestanha>
          <EstiloPestanha $activo={activo === 'pestanhaSalud'} onClick={() => establecerActivo('pestanhaSalud')}>Salud</EstiloPestanha>
        </ListaPestanhas>
        <PanelPestanhas>
          { activo === 'pestanhaGeneral' && renderizaContenidoGeneral() }
          { activo === 'pestanhaCultural' && renderizaContenidoCultural() }
          { activo === 'pestanhaEducacional' && renderizaContenidoEducacional() }
          { activo === 'pestanhaSalud' && renderizaContenidoSalud() }
        </PanelPestanhas>
      </Contenedor>
    </>
  );
};

export default Pestanhas;

const enUnTerritorio = (datos: DatosParaConsultar) => {
  return datos.territoriosId.length === 1 && datos.territoriosId[0] !== 'Todos';
};

const enTerritorios = (datos: DatosParaConsultar) => {
  return datos.territoriosId.length > 1;
};

const enTodosTerritorios = (datos: DatosParaConsultar) => {
  const enTodosTerritorios = datos.territoriosId.length === 1 && datos.territoriosId[0] === 'Todos';
  const noEnTodasComunidades = datos.comunidadesId[0] !== 'Todas';
  return enTodosTerritorios && noEnTodasComunidades;
}

const esTodosLosTerritoriosYComunidades = (datos: DatosParaConsultar) => {
  return datos.territoriosId.length === 1 && datos.territoriosId[0] === 'Todos' && datos.comunidadesId.length === 1 && datos.comunidadesId[0] === 'Todas';
};
