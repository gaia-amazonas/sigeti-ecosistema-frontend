import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useCallback, useEffect, useState } from 'react';
import logger from 'utilidades/logger';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import { estiloContenedorBotones, estiloBoton } from './estilos';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/mapa/paraTerritorios';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/mapa/paraComunidades';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/mapa/paraLineasColindantes';
import { traeInformacionDocumentalTerritorio } from 'buscadores/paraMapa';
import {
  adjuntarAPopUp,
  creaCirculoConAnhoDentro,
  creaContenedorInformacion,
  creaContenedorLineaTiempo,
  determinaColorLineaColindante,
  agregaEstiloALineaColindante,
  enCadaLineaClicada,
  agregaNombreTerritorioAPoligono,
  agregarSimboloDocumentacion,
  crearHtmlPopUpComunidad,
  htmlParaPopUpDeTerritorio
} from './graficosDinamicos';
import { GeometriasConVariables, FeatureComunidades, FilaComunidades } from 'tipos/paraMapas';
import {
  PathZIndex,
  LineaSeleccionada,
  DocumentosPorTerritorio,
  FeatureTerritorios,
  FeatureLineas,
  FilaTerritorios,
  FilaLineas,
  MapaImp
} from './tipos';
import dynamic from 'next/dynamic';
import { Feature, Geometry, GeoJsonProperties, FeatureCollection } from 'geojson';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const Mapa: React.FC<MapaImp> = ({ modo }) => {
  let lineaSeleccionada: LineaSeleccionada | null = null;

  const [lineasColindantesGeoJson, establecerLineasColindantesGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [comunidadesGeoJson, establecerComunidadesGeoJson] = useState<FeatureCollection | null>(null);
  const [mostrarOSM, establecerMostrarOSM] = useState(true);
  const [mostrarLineasColindantes, establecerMostrarLineas] = useState(true);
  const [mostrarTerritorios, establecerMostrarTerritorios] = useState(true);
  const [mostrarComunidades, establecerMostrarComunidades] = useState(true);
  const [estaCargando, establecerEstaCargando] = useState(true);

  const allDataLoaded = !estaCargando;

  useEffect(() => {
    traerDatosInicialesDeMapa(modo);
  }, [modo]);

  const traerDatosInicialesDeMapa = async (modo: string | string[]) => {
    establecerEstaCargando(true);
    try {
      await Promise.all([traerLineasColindantes(modo), traerTerritorios(modo), traerComunidades(modo)]);
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      establecerEstaCargando(false);
    }
  };

  const traerLineasColindantes = async (modo: string | string[]) => {
    try {
      const lineas = (fila: FilaLineas): FeatureLineas => ({
        type: 'Feature',
        properties: { id: fila.OBJECTID, col_entre: fila.COL_ENTRE },
        geometry: JSON.parse(fila.geometry),
      });
      const geoJsonLineas = await buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.geometriasYColindanciaEntre, modo, lineas);
      establecerLineasColindantesGeoJson(geoJsonLineas);
    } catch (error) {
      logger.error('Error buscando lineas:', error);
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
    } catch (error) {
      logger.error('Error buscando territorios:', error);
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
    } catch (error) {
      logger.error('Error buscando comunidades:', error);
    }
  };

  const enCadaLinea = (feature: Feature<Geometry, any>, layer: any) => {
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

  const enCadaTerritorio = (territorio: FeatureTerritorios, layer: any) => {
    if (territorio.properties.id) {
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
          agregarSimboloDocumentacion(territorio, layer);
        }
      });
    }
  };

  const enCadaComunidad = useCallback(async (id: string, circle: any) => {
    const animacionCargando = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100px;">
        <div class="${estilos.spinner}"></div>
      </div>
    `;
    circle.bindPopup(animacionCargando).openPopup();
    const html = await crearHtmlPopUpComunidad(id, modo, circle);
    circle.bindPopup(html).openPopup();
  }, [modo]);

  const tieneDatosTerritorio = async (territorio: FeatureTerritorios): Promise<boolean> => {
    try {
      const gestionDocumental = await buscarDatos(consultasBigQueryParaTerritorios.gestionDocumentalTerritorio(territorio.properties.id), modo);
      return gestionDocumental.rows.length !== 0;
    } catch (error) {
      logger.error('Error checando datos documentales por territorio:', error);
      return false;
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {estaCargando ? (
        <div className={estilos['superposicionCarga']}>
          <div className={estilos.spinner}></div>
        </div>
      ) : null}
      <div style={estiloContenedorBotones}>
        <button onClick={() => establecerMostrarOSM(!mostrarOSM)} style={estiloBoton(mostrarOSM, 'green')}>OSM</button>
        <button onClick={() => establecerMostrarLineas(!mostrarLineasColindantes)} style={estiloBoton(mostrarLineasColindantes, '#FF0000')}>Lineas</button>
        <button onClick={() => establecerMostrarTerritorios(!mostrarTerritorios)} style={estiloBoton(mostrarTerritorios, '#3388FF')}>Territorios</button>
        <button onClick={() => establecerMostrarComunidades(!mostrarComunidades)} style={estiloBoton(mostrarComunidades, '#3388FF')}>Comunidades</button>
      </div>
      <MapContainer center={[-0.227026, -70.067765]} zoom={7} style={{ height: '100%', width: '100%' }}>
        {mostrarOSM && (
          <TileLayer
            url={modo === "online" ? "https://api.maptiler.com/maps/d2c25c43-29c2-47a0-ac77-01ac61ddfd97/256/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          />
        )}
        {allDataLoaded && (
          <>
            {mostrarTerritorios && territoriosGeoJson && (
              <GeoJSON data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />
            )}
            {mostrarComunidades && comunidadesGeoJson && comunidadesGeoJson.features.map((comunidad: Feature<Geometry, GeoJsonProperties> | FeatureCollection<Geometry, GeoJsonProperties>, index: React.Key | null | undefined) => {
              const centroide = turf.centroid(comunidad).geometry.coordinates;
              const id = (comunidad as GeometriasConVariables).properties.id;
              return (
                <React.Fragment key={index}>
                  <Circle
                    center={[centroide[1], centroide[0]]}
                    radius={1000}
                    pathOptions={{ color: 'black', fillOpacity: 0.1 }}
                    eventHandlers={{
                      click: (e) => enCadaComunidad(id, e.target as any)
                    }}
                  />
                  <Circle
                    center={[centroide[1], centroide[0]]}
                    radius={10}
                    pathOptions={{ color: 'black', fillOpacity: 1 }}
                  />
                </React.Fragment>
              );
            })}
            {mostrarLineasColindantes && lineasColindantesGeoJson && (
              <GeoJSON data={lineasColindantesGeoJson} onEachFeature={enCadaLinea} />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Mapa;