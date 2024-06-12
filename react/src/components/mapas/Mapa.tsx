import { Circle, Layer, Path, PathOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import dynamic from 'next/dynamic';
import { FeatureCollection, Geometry, Feature } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';

import logger from 'utilidades/logger';

import estilos from './Mapa.module.css';
import { estiloTerritorio, estiloContenedorBotones, estiloBoton, obtieneColorRandom } from './estilos';

import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/paraTerritorios';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/paraComunidades';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/paraLineasColindantes';
import { adjuntarAPopUp, creaCirculoConAnhoDentro, creaContenedorInformacion, creaContenedorLineaTiempo } from './graficosDinamicos';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasColindantesGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const CirculoComunidad = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface GeometriasConVariables extends Feature<Geometry> {
  properties: {
    nombre: string;
    id: string;
    [key: string]: string | number;
  };
}

interface MapaImp {
  modo: string | string[];
}

interface FilaLineas {
  OBJECTID: string;
  COL_ENTRE: string;
  geometry: string;
}

interface FilaTerritorios {
  NOMBRE_TI: string;
  ID_TI: string;
  ABREV_TI: string;
  geometry: string;
}

interface FilaComunidades {
  nomb_cnida: string;
  id_cnida: string;
  geometry: string;
}

interface FeatureLineas {
  type: 'Feature';
  properties: {
    id: string;
    col_entre: string;
    colorOriginal?: string;
  };
  geometry: string;
}

interface FeatureTerritorios {
  type: 'Feature';
  properties: {
    nombre: string;
    id: string;
    abreviacion: string;
  };
  geometry: string;
}

interface FeatureComunidades {
  type: 'Feature';
  properties: {
    nombre: string;
    id: string;
  };
  geometry: string;
}

interface Fecha {
  value: string;
}

interface DocumentosPorTerritorio {
  DES_DOC: string;
  FECHA_FIN: Fecha;
  FECHA_INICIO: Fecha;
  LINK_DOC: string;
  LUGAR: string;
  TIPO_DOC: string;
}

interface LineaSeleccionada {
  setStyle: (arg0: { color: string; weight: number; opacity: number; zIndex: number; }) => void;
  feature: {properties: { colorOriginal: string; }};
}

type PathZIndexOptions = PathOptions & { zIndex?: number };

interface PathZIndex extends Path {
  setStyle(style: PathZIndexOptions): this;
}

const Mapa: React.FC<MapaImp> = ({ modo }) => {

  let lineaSeleccionada: LineaSeleccionada | null = null;

  const [lineasColindantesGeoJson, establecerLineasColindantesGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [comunidadesGeoJson, establecerComunidadesGeoJson] = useState<FeatureCollection | null>(null);
  const [mostrarOSM, establecerMostrarOSM] = useState(true);
  const [mostrarLineasColindantes, establecerMostrarLineas] = useState(true);
  const [mostrarTerritorios, establecerMostrarTerritorios] = useState(true);
  const [mostrarComunidades, establecerMostrarComunidades] = useState(true);
  const [estaCargandoLineas, establecerEstaCargandoLineas] = useState(true);
  const [estaCargandoTerritorios, establecerEstaCargandoTerritorios] = useState(true);
  const [estaCargandoComunidades, establecerEstaCargandoComunidades] = useState(true);

  const allDataLoaded = !estaCargandoLineas && !estaCargandoTerritorios && !estaCargandoComunidades;

  useEffect(() => {
    traerDatosInicialesDeMapa(modo);
  }, [modo]);

  const traerDatosInicialesDeMapa = async (modo: string | string[]) => {
    establecerEstaCargandoLineas(true);
    traerLineasColindantes(modo);
    establecerEstaCargandoTerritorios(true);
    traerTerritorios(modo);
    establecerEstaCargandoComunidades(true);
    traerComunidades(modo);
  };

  const enCadaLinea = (feature: Feature<Geometry, any>, layer: Layer) => {
    const linea = feature as unknown as FeatureLineas;
    if (linea.properties && linea.properties.id) {
      determinaColorLineaColindante(linea);
      if ((layer as unknown as PathZIndex).setStyle) {
        agregaEstiloALineaColindante(layer as unknown as PathZIndex, linea);
      }
      layer.on('click', async () => {
        lineaSeleccionada = await enCadaLineaClicada(lineaSeleccionada, linea, layer, modo);
      });
    }
  };

  const enCadaTerritorio = (feature: Feature<Geometry, any>, layer: Layer) => {
    const territorio = feature as unknown as FeatureTerritorios;
    if (territorio.properties && territorio.properties.id) {
      layer.on('click', async () => {
        const contenedorLineaTiempo = creaContenedorLineaTiempo();
        const contenedorInformacion = creaContenedorInformacion();
        const gestionDocumental = await traeInformacionDocumentalTerritorio(territorio, modo);
        gestionDocumental.forEach((documento: DocumentosPorTerritorio) => {
          const circulo = creaCirculoConAnhoDentro(documento, contenedorInformacion);
          contenedorLineaTiempo.appendChild(circulo);
        });
        layer.bindPopup(htmlParaPopUpDeTerritorio(territorio)).openPopup();
        adjuntarAPopUp(territorio, contenedorLineaTiempo, contenedorInformacion);
      });
      agregaNombreTerritorioAPoligono(territorio, layer);
      tieneDatosTerritorio(territorio).then((tieneDatos) => {
        if (tieneDatos) {
          agregarSimboloDocumentacion(layer);
        }
      });
    }
  };

  const enCadaComunidad = useCallback(async (id: string, circle: Circle) => {
    console.log(circle);
    const loadingContent = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100px;">
        <div class="${estilos.spinner}"></div>
      </div>
    `;
    circle.bindPopup(loadingContent).openPopup();
    const html = await crearHtmlPopUpComunidad(id, modo, circle);
    circle.bindPopup(html).openPopup();
  }, [modo]);

  const tieneDatosTerritorio = async (territorio: FeatureTerritorios): Promise<boolean> => {
    try {
      const gestionDocumental = await buscarDatos(consultasBigQueryParaTerritorios.gestionDocumentalTerritorio(territorio.properties.id), modo);
      return gestionDocumental.rows.length !== 0;
    } catch (error) {
      logger.error('Error checking territory data:', error);
      return false;
    }
  };

  const traerLineasColindantes = async (modo: string | string[]) => {
    try {
      const lineas = (fila: FilaLineas): FeatureLineas => ({
        type: 'Feature',
        properties: { id: fila.OBJECTID, col_entre: fila.COL_ENTRE },
        geometry: JSON.parse(fila.geometry)
      });
      const geoJsonLineas = await buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.geometrias, modo, lineas);
      establecerLineasColindantesGeoJson(geoJsonLineas);
      establecerEstaCargandoLineas(false);
    } catch (error) {
      logger.error('Error buscando lineas:', error);
      establecerEstaCargandoLineas(false);
    }
  };

  const traerTerritorios = async (modo: string | string[]) => {
    try {
      const territorios = (fila: FilaTerritorios): FeatureTerritorios => ({
        type: 'Feature',
        properties: { nombre: fila.NOMBRE_TI, id: fila.ID_TI, abreviacion: fila.ABREV_TI },
        geometry: JSON.parse(fila.geometry)
      });
      const geoJsonTerritorios = await buscarDatosGeoJson(consultasBigQueryParaTerritorios.geometrias, modo, territorios);
      establecerTerritoriosGeoJson(geoJsonTerritorios);
      establecerEstaCargandoTerritorios(false);
    } catch (error) {
      logger.error('Error buscando territorios:', error);
      establecerEstaCargandoTerritorios(false);
    }
  };

  const traerComunidades = async (modo: string | string[]) => {
    try {
      const comunidades = (fila: FilaComunidades): FeatureComunidades => ({
        type: 'Feature',
        properties: { nombre: fila.nomb_cnida, id: fila.id_cnida },
        geometry: JSON.parse(fila.geometry)
      });
      const geoJsonComunidades = await buscarDatosGeoJson(consultasBigQueryParaComunidades.comunidades, modo, comunidades);
      establecerComunidadesGeoJson(geoJsonComunidades);
      establecerEstaCargandoComunidades(false);
    } catch (error) {
      logger.error('Error buscando comunidades:', error);
      establecerEstaCargandoComunidades(false);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {estaCargandoLineas || estaCargandoTerritorios || estaCargandoComunidades ? (
        <div className={estilos['loading-overlay']}>
          <div className={estilos.spinner}></div>
        </div>
      ) : null}
      <div style={estiloContenedorBotones}>
        <button onClick={() => establecerMostrarOSM(!mostrarOSM)} style={estiloBoton(mostrarOSM, 'green')}>OSM</button>
        <button onClick={() => establecerMostrarLineas(!mostrarLineasColindantes)} style={estiloBoton(mostrarLineasColindantes, '#FF0000')}>Lineas</button>
        <button onClick={() => establecerMostrarTerritorios(!mostrarTerritorios)} style={estiloBoton(mostrarTerritorios, '#3388FF')}>Territorios</button>
        <button onClick={() => establecerMostrarComunidades(!mostrarComunidades)} style={estiloBoton(mostrarComunidades, '#3388FF')}>Comunidades</button>
      </div>
      <Contenedor center={[-0.227026, -70.067765]} zoom={7} style={{ height: '100%', width: '100%' }}>
        {mostrarOSM && (
          <CapaOSM
            url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          />
        )}
        {allDataLoaded && (
          <>
            {mostrarTerritorios && territoriosGeoJson && (
              <TerritoriosGeoJson data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />
            )}
            {mostrarComunidades && comunidadesGeoJson && comunidadesGeoJson.features.map((comunidad, index) => {
              const centroide = turf.centroid(comunidad).geometry.coordinates;
              const id = (comunidad as GeometriasConVariables).properties.id;
              return (
                <React.Fragment key={index}>
                  <CirculoComunidad
                    center={[centroide[1], centroide[0]]}
                    radius={1000}
                    pathOptions={{ color: 'black', fillOpacity: 0.1 }}
                    eventHandlers={{
                      click: (e) => enCadaComunidad(id, e.target as Circle)
                    }}
                  />
                  <CirculoComunidad
                    center={[centroide[1], centroide[0]]}
                    radius={10}
                    pathOptions={{ color: 'black', fillOpacity: 1 }}
                  />
                </React.Fragment>
              );
            })}
            {mostrarLineasColindantes && lineasColindantesGeoJson && (
              <LineasColindantesGeoJson data={lineasColindantesGeoJson} onEachFeature={enCadaLinea} />
            )}
          </>
        )}
      </Contenedor>
    </div>
  );
};

export default Mapa;

const traeInformacionDocumentalLineaColindante = async (linea: FeatureLineas, modo: string | string[]) => {
  try {
    const gestionDocumental = await buscarDatos(consultasBigQueryParaLineasColindantes.gestionDocumentalLineaColindante(linea.properties.id), modo);
    organizaDocumentacionPorFecha(gestionDocumental);
    return gestionDocumental.rows[0];
  } catch (error) {
    logger.error('Error fetching document info for linea colindante:', error);
    return null;
  }
};

const determinaColorLineaColindante = (linea: FeatureLineas) => {
  if (!linea.properties.colorOriginal) {
    linea.properties.colorOriginal = obtieneColorRandom();
  }
};

const agregaEstiloALineaColindante = (layer: PathZIndex, linea: FeatureLineas) => {
  if (layer.setStyle) {
    layer.setStyle({
      color: linea.properties.colorOriginal,
      weight: 13,
      opacity: 0.6,
      zIndex: 10,
    });
  }
};

const enCadaLineaClicada = async (lineaSeleccionada: LineaSeleccionada | null, linea: FeatureLineas, layer: Layer, modo: string | string[]) => {
  if (lineaSeleccionada) {
    devuelveEstiloALineaColindanteSeleccionadaAntes(lineaSeleccionada);
  }
  if ((layer as unknown as Path).setStyle) {
    agregaEstiloALineaColindanteSeleccionada(layer);
  }
  const informacionDocumental = await traeInformacionDocumentalLineaColindante(linea, modo);
  htmlParaPopUpDeLineaColindante(layer, informacionDocumental);
  return layer as unknown as LineaSeleccionada;
}

const devuelveEstiloALineaColindanteSeleccionadaAntes = ( lineaSeleccionada: LineaSeleccionada ) => {
  if (lineaSeleccionada && lineaSeleccionada.setStyle) {
    lineaSeleccionada.setStyle({
      color: lineaSeleccionada.feature.properties.colorOriginal,
      weight: 13,
      opacity: 0.6,
      zIndex: 10,
    });
  }
};

const agregaEstiloALineaColindanteSeleccionada = (layer: any) => {
  if (layer.setStyle) {
    layer.setStyle({
      color: 'yellow',
      weight: 13,
      opacity: 0.8,
      zIndex: 10,
    });
  }
};

const htmlParaPopUpDeLineaColindante = (linea: any, info: any) => {
  if (info) {
    const texto = `<strong>Acuerdo entre:</strong> ${info.COL_ENTRE}<br/>
      <strong><a href="${info.LINK_DOC}" target="_blank">Link al Documento</a></strong><br/>
      <strong>Definición:</strong> ${info.DEFINICION}<br/>
      <strong>Descripción del documento:</strong> ${info.DES_DOC}<br/>
      <strong>Acta de Colindancia:</strong> <a href="${info.ACTA_COL}" target="_blank">Link al Documento</a><br/>
      <strong>PV 1:</strong> <a href="${info.PV_1}" target="_blank">Link al Documento</a><br/>
      <strong>PV 2:</strong> <a href="${info.PV_2}" target="_blank">Link al Documento</a><br/>`;
    linea.bindPopup(texto).openPopup();
  }
};

const crearHtmlPopUpComunidad = async (id: string, modo: string | string[], circle: any) => {
  try {
    return intentaCrearHtmlPopUpComunidad(id, modo);
  } catch (error) {
    logger.error('Error buscando información de la comunidad:', error);
    circle.bindPopup('<div>No hay datos para esta comunidad aún</div>').openPopup();
  }
};

const intentaCrearHtmlPopUpComunidad = async (id: string, modo: string | string[]) => {
  const info = await traeInformacionComunidad(id, modo);
  const hombres = info.sexos.rows.find((s: any) => s.SEXO === 'Hombre')?.f0_ || 0;
  const mujeres = info.sexos.rows.find((s: any) => s.SEXO === 'Mujer')?.f0_ || 0;
  const poblacionTotal = hombres + mujeres;
  return `
    <div>
      <strong>Nombre:</strong> ${info.nombre.rows[0].NOMB_CNIDA}<br/>
      <strong>Territorio:</strong> ${info.territorio.rows[0].nombreTerritorio}<br/>
      <strong>Población:</strong> ${poblacionTotal} habitantes<br/>
      <strong>Familias:</strong> ${info.familias.rows[0].familias}<br/>
      <strong>Pueblos:</strong> ${info.pueblos.rows.map((p: any) => p.PUEBLO).join(', ')}<br/>
      <strong>Sexos:</strong><br/>
      &nbsp;&nbsp;&nbsp;${mujeres} mujeres<br/>
      &nbsp;&nbsp;&nbsp;${hombres} hombres
    </div>
  `;
}

const organizaDocumentacionPorFecha = (gestionDocumental: any) => {
  gestionDocumental.rows.sort((a: any, b: any) => a.FECHA_INICIO.value.localeCompare(b.FECHA_INICIO.value));
};

const agregarSimboloDocumentacion = async (layer: any) => {
  const leaflet = (await import('leaflet')).default;
  const simbolo = leaflet.divIcon({
    className: 'custom-data-icon',
    html: '<div style="font-size: 24px;">📄</div>',
    iconSize: [1, 1],
  });
  const centroid = turf.centroid(layer.feature).geometry.coordinates;
  const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
  marker.addTo(layer._map);
};

const agregaNombreTerritorioAPoligono = async (territorio: any, layer: any) => {
  const leaflet = (await import('leaflet')).default;
  const abreviacionNombre = territorio.properties.abreviacion;
  const simbolo = leaflet.divIcon({
    className: estilos['territorio-nombre'],
    html: `<div>${abreviacionNombre}</div>`,
    iconSize: [abreviacionNombre.length * 6, 20],
    iconAnchor: [abreviacionNombre.length * 3, 10],
  });
  const centroid = turf.centroid(territorio).geometry.coordinates;
  const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
  marker.addTo(layer._map);
};

const traeInformacionDocumentalTerritorio = async (territorio: any, modo: string | string[]) => {
  try {
    const gestionDocumental = await buscarDatos(consultasBigQueryParaTerritorios.gestionDocumentalTerritorio(territorio.properties.id), modo);
    organizaDocumentacionPorFecha(gestionDocumental);
    return gestionDocumental.rows;
  } catch (error) {
    logger.error('Error fetching document info for territorio:', error);
    return [];
  }
};

const htmlParaPopUpDeTerritorio = (territorio: any) => {
  return `<div style="width: auto; max-width: 20rem;">
    <strong>${territorio.properties.nombre}</strong> (${territorio.properties.id})<br/>
    <div id="timeline-${territorio.properties.id}" style="display: flex; flex-wrap: wrap;">Hechos históricos</div>
    <div id="info-${territorio.properties.id}"></div>
  </div>`;
};

const traeInformacionComunidad = async (idComunidad: any, modo: string | string[]) => {
  try {
    const sexos = await buscarDatos(consultasBigQueryParaComunidades.sexo(idComunidad), modo);
    const nombre = await buscarDatos(consultasBigQueryParaComunidades.nombreComunidad(idComunidad), modo);
    const territorio = await buscarDatos(consultasBigQueryParaComunidades.nombreTerritorio(idComunidad), modo);
    const familias = await buscarDatos(consultasBigQueryParaComunidades.familias(idComunidad), modo);
    const pueblos = await buscarDatos(consultasBigQueryParaComunidades.pueblos(idComunidad), modo);
    return { sexos, nombre, territorio, familias, pueblos };
  } catch (error) {
    logger.error('Error fetching comunidad info:', error);
    return { sexos: { rows: [] }, nombre: { rows: [] }, territorio: { rows: [] }, familias: { rows: [] }, pueblos: { rows: [] } };
  }
};
