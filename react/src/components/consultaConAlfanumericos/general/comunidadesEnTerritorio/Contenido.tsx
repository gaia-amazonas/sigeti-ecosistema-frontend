import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { buscarPorTodasComunidadesEnTerritorio, buscarPorComunidadesEnTerritorio } from 'buscadores/paraAlfanumerica/dinamicas/General';
import { Sexo, SexoEdad, SexoEdadFila } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import ComunidadesEnTerritorioDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import ComunidadesEnTerritoriosDatosConsultadosDinamicos from 'tipos/general/deDatosConsultados/dinamicos/comunidadesEnTerritorios';
import Mujer from '../sexo/Mujer';
import Hombre from '../sexo/Hombre';
import ComponenteSexoEdad from '../../SexoEdad';
import TotalYFamilias from '../TotalYFamilias';
import ContenedorContexto from 'components/consultaConAlfanumericos/ContenedorContexto';
import QueEstoyViendo from '../QueEstoyViendo';
import MapaComunidadesPorTerritorio from '../MapaPoblacionEnComunidades';
import FamiliasYPoblacionYElectricidad from '../FamiliasYPoblacion';
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
  datosGenerales: ComunidadesEnTerritorioDatosConsultados;
  datosParaConsulta: DatosParaConsultar;
  modo: string | string[];
}

const ComponenteGeneralComunidadesEnTerritorio: React.FC<ComponenteGeneralComunidadesEnTerritorioImp> = ({ datosGenerales, datosParaConsulta, modo }) => {
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

  useEffect(() => {
    if (!datosExtraidos.sexo) return;
    const sexoPorEdades = calcularSexosPorEdades(datosExtraidos.sexo);
    establecerMujerContador(sexoPorEdades.mujerContador);
    establecerHombreContador(sexoPorEdades.hombreContador);
    establecerTotalContador(sexoPorEdades.totalContador);
  }, [datosPiramidalesSexoEdad]);

  const fetchFilteredData = async () => {
    let datosDinamicos: ComunidadesEnTerritoriosDatosConsultadosDinamicos;
    if (datosParaConsulta.comunidadesId[0] === 'Todas') {
      const datos = await buscarPorTodasComunidadesEnTerritorio({datosParaConsulta, edadMinima, edadMaxima, modo});
      datosDinamicos = extraerDatosEntrantesDinamicos(datos);
      establecerDatosPiramidalesSexoEdad(segmentarPorEdadYSexoParaGraficasPiramidales(datosDinamicos.sexoEdad));
    } else {
      const datos = await buscarPorComunidadesEnTerritorio({datosParaConsulta, edadMinima, edadMaxima, modo});
      datosDinamicos = extraerDatosEntrantesDinamicos(datos);
      establecerDatosPiramidalesSexoEdad(segmentarPorEdadYSexoParaGraficasPiramidales(datosDinamicos.sexoEdad));
    }
    establecerDatosExtraidos(prev => ({
      ...prev,
      sexo: datosDinamicos.sexo,
      poblacionPorComunidad: datosDinamicos.poblacionPorComunidad,
      sexoEdad: datosDinamicos.sexoEdad,
    }));
    establecerDatosPiramidalesSexoEdad(segmentarPorEdadYSexoParaGraficasPiramidales(datosDinamicos.sexoEdad));
  };

  if (datosGeneralesInvalidos(datosGenerales)) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <WrapperAnimadoParaHistorias>
        <ContenedorGrafico>
          <Hombre contador={hombreContador} />
          <TotalYFamilias
            contadorTotal={totalContador}
            contadorFamilias={datosExtraidos.familias}
          />
          <Mujer contador={mujerContador} />
        </ContenedorGrafico>
        <ContenedorContexto texto='Los siguientes datos son el resultado de un ejercicio de recolección de información sobre 
        dimensión poblacional en el año 2021, por parte de los equipos territoriales indígenas en el marco de la puesta en funcionamiento 
        del decreto ley 632 de 2018.'/>
      </WrapperAnimadoParaHistorias>
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Sexo y Edad</CajaTitulo>
        <ComponenteSexoEdad datosPiramidalesSexoEdad={datosPiramidalesSexoEdad} labelIzquierdo='Hombre' labelDerecho='Mujer' />
      </WrapperAnimadoParaHistorias>
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Poblacion Total y por Sexo</CajaTitulo>
        <ContenedorContexto texto= 'Acérquese dentro del mapa a la comunidad para conocer la población total y su estructura según el sexo.' />        <MapaComunidadesPorTerritorio
          territoriosGeoJson={datosExtraidos.territorioGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
          comunidadesGeoJson={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
          modo={modo}
        />
      </WrapperAnimadoParaHistorias>
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Familias y Población</CajaTitulo>
        <FamiliasYPoblacionYElectricidad
          familiasPorComunidad={datosExtraidos.familiasPorComunidad}
          poblacionPorComunidad={datosExtraidos.poblacionPorComunidad}
          familiasConElectricidadPorComunidad={datosExtraidos.familiasConElectricidadPorComunidad}
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
      <QueEstoyViendo
        comunidades={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        territorios={datosExtraidos.territorioGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
      />
    </>
  );
};

export default ComponenteGeneralComunidadesEnTerritorio;

const datosGeneralesInvalidos = (datosGenerales: ComunidadesEnTerritorioDatosConsultados) => {
  return (
    !datosGenerales.comunidadesGeoJson ||
    !datosGenerales.familias ||
    !datosGenerales.familiasPorComunidad ||
    !datosGenerales.sexo ||
    !datosGenerales.sexoEdad ||
    !datosGenerales.poblacionPorComunidad ||
    !datosGenerales.familiasConElectricidadPorComunidad ||
    !datosGenerales.territorioGeoJson
  );
};

const extraerDatosEntrantes = (datosGenerales: ComunidadesEnTerritorioDatosConsultados) => {
  const familias = datosGenerales.familias === null ? null : datosGenerales.familias.rows.at(0)?.familias;
  return {
    sexo: datosGenerales.sexo,
    familias: familias === undefined ? null : familias,
    sexoEdad: datosGenerales.sexoEdad,
    familiasPorComunidad: datosGenerales.familiasPorComunidad,
    poblacionPorComunidad: datosGenerales.poblacionPorComunidad,
    familiasConElectricidadPorComunidad: datosGenerales.familiasConElectricidadPorComunidad,
    comunidadesGeoJson: datosGenerales.comunidadesGeoJson,
    territorioGeoJson: datosGenerales.territorioGeoJson
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