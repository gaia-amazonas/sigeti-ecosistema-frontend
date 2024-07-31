// src/components/consultaConAlfanumericos/general/comunidadesEnTerritorios/Contenido.tsx

import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { buscarPorTodasComunidadesEnTodosTerritorios, buscarPorTodasComunidadesEnTerritorios, buscarPorComunidadesEnTerritorios } from 'buscadores/paraAlfanumerica/dinamicas/General';
import { Sexo, SexoEdad, SexoEdadFila } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import ComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';
import ComunidadesEnTerritoriosDatosConsultadosDinamicos from 'tipos/general/deDatosConsultados/dinamicos/comunidadesEnTerritorios';
import Mujer from '../sexo/Mujer';
import Hombre from '../sexo/Hombre';
import ComponenteSexoEdad from '../../SexoEdad';
import TotalYFamilias from '../TotalYFamilias';
import QueEstoyViendo from '../QueEstoyViendo';
import MapaComunidadesPorTerritorio from '../MapaComunidades';
import FamiliasYPoblacionYElectricidad from '../FamiliasYPoblacionYElectricidad';
import FiltrosAvanzadosIcono from '../FiltrosAvanzadosIcono';
import FiltrosAvanzadosPopup from '../FiltrosAvanzadosPopup';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import { ContenedorGrafico, CajaTitulo } from '../../estilos';
import WrapperAnimadoParaHistorias from '../../WrapperAnimadoParaHistorias';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface ComponenteGeneralComunidadesEnTerritorioImp {
  datosGenerales: ComunidadesEnTerritoriosDatosConsultados;
  datosParaConsulta: DatosParaConsultar;
  modo: string | string[];
}

const ComponenteGeneralComponentesEnTerritorios: React.FC<ComponenteGeneralComunidadesEnTerritorioImp> = ({ datosGenerales, datosParaConsulta, modo }) => {
  const [popupVisible, establecerPopupVisible] = useState(false);
  const [edadMinima, establecerEdadMinima] = useState(0);
  const [edadMaxima, establecerEdadMaxima] = useState(120);
  const [datosExtraidos, establecerDatosExtraidos] = useState(extraerDatosEntrantes(datosGenerales));
  const [datosPiramidalesSexoEdad, establecerDatosPiramidalesSexoEdad] = useState<DatosPiramidalesItem[] | null>(segmentarPorEdadYSexoParaGraficasPiramidales(datosExtraidos.sexoEdad));
  const [mujerContador, establecerMujerContador] = useState<number | null>(null);
  const [hombreContador, establecerHombreContador] = useState<number | null>(null);
  const [totalContador, establecerTotalContador] = useState<number | null>(null);

  const cambiaVisibilidadFiltroAvanzadoPopup = () => {
    establecerPopupVisible(!popupVisible);
  };

  useEffect(() => {
    establecerDatosExtraidos(extraerDatosEntrantes(datosGenerales));
    establecerDatosPiramidalesSexoEdad(segmentarPorEdadYSexoParaGraficasPiramidales(datosGenerales.sexoEdad));
  }, [datosGenerales]);

  const fetchFilteredData = async () => {
    let datosDinamicos: ComunidadesEnTerritoriosDatosConsultadosDinamicos = {sexo: null,
    familias: null,
    sexoEdad: null,
    familiasPorComunidad: null,
    poblacionPorComunidad: null,
    familiasConElectricidadPorComunidad: null};
    if (datosParaConsulta.territoriosId[0] === 'Todos' && datosParaConsulta.comunidadesId[0] === 'Todas') {
      const datos = await buscarPorTodasComunidadesEnTodosTerritorios({ edadMinima, edadMaxima, modo });
      datosDinamicos = extraerDatosEntrantesDinamicos(datos);
      console.log(datosDinamicos, "1");
    } else if (datosParaConsulta.comunidadesId[0] === 'Todas' && datosParaConsulta.territoriosId[0] !== 'Todos') {
      const datos = await buscarPorTodasComunidadesEnTerritorios({ datosParaConsulta, edadMinima, edadMaxima, modo });
      datosDinamicos = extraerDatosEntrantesDinamicos(datos);
      console.log(datosDinamicos, "2");
    } else if (datosParaConsulta.comunidadesId[0] !== 'Todas') {
      const datos = await buscarPorComunidadesEnTerritorios({ datosParaConsulta, edadMinima, edadMaxima, modo });
      datosDinamicos = extraerDatosEntrantesDinamicos(datos);
    }
    establecerDatosExtraidos(prev => ({
      ...prev,
      sexo: datosDinamicos.sexo,
      poblacionPorComunidad: datosDinamicos.poblacionPorComunidad,
      sexoEdad: datosDinamicos.sexoEdad,
    }));
    establecerDatosPiramidalesSexoEdad(segmentarPorEdadYSexoParaGraficasPiramidales(datosDinamicos.sexoEdad));
  };

  useEffect(() => {
    if (!datosExtraidos.sexo) return;
    const sexoPorEdades = calcularSexosPorEdades(datosExtraidos.sexo);
    establecerMujerContador(sexoPorEdades.mujerContador);
    establecerHombreContador(sexoPorEdades.hombreContador);
    establecerTotalContador(sexoPorEdades.totalContador);
  }, [datosPiramidalesSexoEdad]);

  if (datosGeneralesInvalidos(datosGenerales)) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <QueEstoyViendo
        comunidades={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        territorios={datosExtraidos.territoriosGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
      />
      <WrapperAnimadoParaHistorias>
        <ContenedorGrafico>
          <Hombre contador={hombreContador} />
          <TotalYFamilias
            contadorTotal={totalContador}
            contadorFamilias={datosExtraidos.familias}
          />
          <Mujer contador={mujerContador} />
        </ContenedorGrafico>
      </WrapperAnimadoParaHistorias>
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Sexo y Edad</CajaTitulo>
        <ComponenteSexoEdad datosPiramidalesSexoEdad={datosPiramidalesSexoEdad} labelIzquierdo="Hombre" labelDerecho="Mujer" />
      </WrapperAnimadoParaHistorias>
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Familias y Población</CajaTitulo>
        <FamiliasYPoblacionYElectricidad
          familiasPorComunidad={datosExtraidos.familiasPorComunidad}
          poblacionPorComunidad={datosExtraidos.poblacionPorComunidad}
          familiasConElectricidadPorComunidad={datosExtraidos.familiasConElectricidadPorComunidad}
          comunidadesPorTerritorio={datosExtraidos.comunidadesEnTerritorios}
        />
      </WrapperAnimadoParaHistorias>
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Poblacion Total y por Sexo</CajaTitulo>
        <MapaComunidadesPorTerritorio
          territoriosGeoJson={datosExtraidos.territoriosGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
          comunidadesGeoJson={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
          modo={modo}
        />
      </WrapperAnimadoParaHistorias>
      <FiltrosAvanzadosPopup
        esVisible={popupVisible}
        edadMinima={edadMinima}
        edadMaxima={edadMaxima}
        establecerEdadMinima={establecerEdadMinima}
        establecerEdadMaxima={establecerEdadMaxima}
        onClose={cambiaVisibilidadFiltroAvanzadoPopup}
        onSend={fetchFilteredData}
      />
      <FiltrosAvanzadosIcono onClick={cambiaVisibilidadFiltroAvanzadoPopup} />
    </>
  );
};

export default ComponenteGeneralComponentesEnTerritorios;

const datosGeneralesInvalidos = (datosGenerales: ComunidadesEnTerritoriosDatosConsultados) => {
  return (
    !datosGenerales.comunidadesGeoJson ||
    !datosGenerales.familias ||
    !datosGenerales.familiasPorComunidad ||
    !datosGenerales.sexo ||
    !datosGenerales.sexoEdad ||
    !datosGenerales.poblacionPorComunidad ||
    !datosGenerales.familiasConElectricidadPorComunidad ||
    !datosGenerales.territoriosGeoJson ||
    !datosGenerales.comunidadesEnTerritorios
  );
};

const extraerDatosEntrantes = (datosGenerales: ComunidadesEnTerritoriosDatosConsultados) => {
  const familias = datosGenerales.familias === null ? null : datosGenerales.familias.rows.at(0)?.familias;
  return {
    sexo: datosGenerales.sexo,
    familias: familias === undefined ? null : familias,
    sexoEdad: datosGenerales.sexoEdad,
    familiasPorComunidad: datosGenerales.familiasPorComunidad,
    poblacionPorComunidad: datosGenerales.poblacionPorComunidad,
    familiasConElectricidadPorComunidad: datosGenerales.familiasConElectricidadPorComunidad,
    comunidadesGeoJson: datosGenerales.comunidadesGeoJson,
    territoriosGeoJson: datosGenerales.territoriosGeoJson,
    comunidadesEnTerritorios: datosGenerales.comunidadesEnTerritorios
  };
};

const extraerDatosEntrantesDinamicos = (datosGenerales: ComunidadesEnTerritoriosDatosConsultadosDinamicos) => {
  return {
    sexo: datosGenerales.sexo,
    familias: datosGenerales.familias,
    sexoEdad: datosGenerales.sexoEdad,
    familiasPorComunidad: datosGenerales.familiasPorComunidad,
    poblacionPorComunidad: datosGenerales.poblacionPorComunidad,
    familiasConElectricidadPorComunidad: datosGenerales.familiasConElectricidadPorComunidad
  };
};

const calcularSexosPorEdades = (sexoDatos: Sexo | null) => {
  const mujerContador = sexoDatos === null ? null : sexoDatos.rows.filter(row => row.sexo === 'Mujer').map(row => row.cantidad)[0];
  const hombreContador = sexoDatos === null ? null : sexoDatos.rows.filter(row => row.sexo === 'Hombre').map(row => row.cantidad)[0];
  let totalContador: number | null = null;
  if (mujerContador && hombreContador) {
    totalContador = hombreContador + mujerContador;
  }
  return {
    mujerContador,
    hombreContador,
    totalContador
  };
};

type DatosPiramidalesItem = {
  grupo: string;
  Hombre?: number;
  Mujer?: number;
};

const segmentarPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: SexoEdad | null): DatosPiramidalesItem[] | null => {
  if (!sexoEdadDatos) {
    return null;
  }
  return sexoEdadDatos.rows.map((item: SexoEdadFila): DatosPiramidalesItem => ({
    grupo: item.grupoPorEdad,
    [item.sexo]: item.contador * (item.sexo === 'Hombre' ? -1 : 1)
  }));
};