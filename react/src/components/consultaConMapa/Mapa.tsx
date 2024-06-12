import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import dynamic from 'next/dynamic';
import { Circle, Layer } from 'leaflet';
import { FeatureCollection, Geometry, Feature } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';

import logger from 'utilidades/logger';

import estilos from './Mapa.module.css';
import { estiloTerritorio, estiloContenedorBotones, estiloBoton } from './estilos';

import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/paraTerritorios';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/paraComunidades';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/paraLineasColindantes';

import { traeInformacionDocumentalTerritorio } from 'buscadores/paraMapa'
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

import { 
  PathZIndex, 
  LineaSeleccionada, 
  DocumentosPorTerritorio, 
  FeatureComunidades, 
  FeatureTerritorios, 
  FeatureLineas, 
  FilaComunidades, 
  FilaTerritorios, 
  FilaLineas, 
  MapaImp, 
  GeometriasConVariables
} from './tipos';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasColindantesGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const CirculoComunidad = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });


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

    const traerLineasColindantes = async (modo: string | string[]) => {
    try {
      const lineas = (fila: FilaLineas): FeatureLineas => ({
        type: 'Feature',
        properties: { id: fila.OBJECTID, col_entre: fila.COL_ENTRE },
        geometry: JSON.parse(fila.geometry),
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

  const enCadaTerritorio = (territorio: FeatureTerritorios, layer: Layer) => {
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

  const enCadaComunidad = useCallback(async (id: string, circle: Circle) => {
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