// components/mapas/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';
import styles from './Mapa.module.css'; // Import the CSS module

import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import { estiloLinea, estiloTerritorio, estiloContenedorBotones, estiloBoton, estiloComunidad, estiloDot, getRandomColor } from './estilos';
import { adjuntarAPopUp, creaCirculo, creaContenedorInformacion, creaContenedorLineaTiempo } from './graficosDinamicos';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/paraTerritorios';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/paraComunidades';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/paraLineasColindantes';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasColindantesGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const ComunidadesGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapaImp {
  modo: string | string[];
}

const Mapa: React.FC<MapaImp> = ({ modo }) => {
  const [lineasColindantesGeoJson, establecerLineasColindantesGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [comunidadesGeoJson, establecerComunidadesGeoJson] = useState<FeatureCollection | null>(null);
  const [mostrarOSM, establecerMostrarOSM] = useState(true);
  const [mostrarLineasColindantes, establecerMostrarLineas] = useState(true);
  const [mostrarTerritorios, establecerMostrarTerritorios] = useState(true);
  const [mostrarComunidades, establecerMostrarComunidades] = useState(true);

  useEffect(() => {
    const buscarLineas = async () => {
      const features = (row: any) => ({
        type: 'Feature',
        properties: { id: row.OBJECTID, col_entre: row.COL_ENTRE },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.lineas_geometria, modo, features) 
        : buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.lineas_geometria, modo, features));
      establecerLineasColindantesGeoJson(geoJson);
    };
    buscarLineas();
  }, [modo]);

  useEffect(() => {
    const buscarTerritorios = async () => {
      const features = (row: any) => ({
        type: 'Feature',
        properties: { nombre: row.NOMBRE_TI, id: row.ID_TI, abreviacion: row.ABREV_TI },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasBigQueryParaTerritorios.territorios, modo, features) 
        : buscarDatosGeoJson(consultasBigQueryParaTerritorios.territorios, modo, features));
      establecerTerritoriosGeoJson(geoJson);
    };
    buscarTerritorios();
  }, [modo]);

  useEffect(() => {
    const buscarComunidades = async () => {
      const features = (row: any) => ({
        type: 'Feature',
        properties: { nombre: row.nomb_cnida, id: row.id_cnida },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasBigQueryParaComunidades.comunidades, modo, features) 
        : buscarDatosGeoJson(consultasBigQueryParaComunidades.comunidades, modo, features));
      establecerComunidadesGeoJson(geoJson);
    };
    buscarComunidades();
  }, [modo]);

  let selectedLine: { setStyle: (arg0: { color: any; weight: number; opacity: number; zIndex: number; }) => void; feature: { properties: { originalColor: any; }; }; } | null = null;

  const enCadaLinea = (linea: any, capa: any) => {
    if (linea.properties && linea.properties.id) {
      // Store the original color in the line's properties
      if (!linea.properties.originalColor) {
        linea.properties.originalColor = getRandomColor();
      }

      capa.on('click', async () => {
        if (selectedLine && selectedLine !== capa) {
          // Reset the style of the previously selected line to its original color
          selectedLine.setStyle({
            color: selectedLine.feature.properties.originalColor,
            weight: 13,
            opacity: 0.6,
            zIndex: 10,
          });
        }

        const gestion_documental = await buscarDatos(consultasBigQueryParaLineasColindantes.gestion_documental_linea_colindante(linea.properties.id), modo);
        const info = gestion_documental.rows[0];
        capa.setStyle({
          color: 'yellow',
          weight: 13,
          opacity: 0.8,
          zIndex: 10,
        });

        if (info) {
          const texto = `<strong>Colindante Entre:</strong> ${info.COL_ENTRE}<br/>
          <strong>¿Hubo acuerdo?:</strong> ${info.ACUERDO}<br/>
          <strong>Acuerdo entre:</strong> ${info.COL_ENTRE}<br/>
          <strong><a href="${info.LINK_DOC}" target="_blank">Link al Documento</a></strong><br/>
          <strong>Fecha:</strong> ${info.FECHA_INICIO.value}<br/>
          <strong>Lugar:</strong> ${info.LUGAR}<br/>
          <strong>Tipo de documento:</strong> ${info.TIPO_DOC}<br/>
          <strong>Escenario:</strong> ${info.ESCENARIO}<br/>
          <strong>Nombre del escenario:</strong> ${info.FECHA_INICIO.value}<br/>
          <strong>Resumen:</strong> ${info.DES_DOC}<br/>`;
          capa.bindPopup(texto).openPopup();
        }

        // Update the selected line
        selectedLine = capa;
      });

      capa.setStyle({
        color: linea.properties.originalColor,
        weight: 13,
        opacity: 0.6,
        zIndex: 10,
      });
    }
  };

  const enCadaTerritorio = (territorio: any, capa: any) => {
    if (territorio.properties && territorio.properties.id) {

      capa.on('click', async () => {

        const gestion_documental = await buscarDatos(consultasBigQueryParaTerritorios.gestion_documental_territorio(territorio.properties.id), modo);
        
        // Sort documents by FECHA_INICIO.value in ascending order
        gestion_documental.rows.sort((a: any, b: any) => a.FECHA_INICIO.value.localeCompare(b.FECHA_INICIO.value));
        
        const contenedorLineaTiempo = creaContenedorLineaTiempo();
        const contenedorInformacion = creaContenedorInformacion();

        gestion_documental.rows.forEach((doc: any) => {
          const circulo = creaCirculo(doc, contenedorInformacion);
          contenedorLineaTiempo.appendChild(circulo);
        });

        capa.bindPopup(`
          <div style="width: auto; max-width: 20rem;">
            <strong>${territorio.properties.nombre}</strong> (${territorio.properties.id})<br/>
            <div id="timeline-${territorio.properties.id}" style="display: flex; flex-wrap: wrap;">Hechos históricos</div>
            <div id="info-${territorio.properties.id}"></div>
          </div>
        `).openPopup();

        adjuntarAPopUp(territorio, contenedorLineaTiempo, contenedorInformacion);

      });
      agregaNombreTerritorioAPoligono(territorio, capa)
      tieneDatos(territorio).then((hasData) => {
        if (hasData) {
          agregarSimboloDocumentacion(capa);
        }
      });

    }
  };

  const tieneDatos = async (territorio: any): Promise<boolean> => {
    const gestion_documental = await buscarDatos(consultasBigQueryParaTerritorios.gestion_documental_territorio(territorio.properties.id), modo);
    return gestion_documental.rows.length !== 0;
  };

  const agregarSimboloDocumentacion = async (capa: any) => {
    const leaflet = (await import('leaflet')).default;
    const simbolo = leaflet.divIcon({
      className: 'custom-data-icon',
      html: '<div style="font-size: 24px;">📄</div>', // Increase the font size here
      iconSize: [1, 1], // Set the container size to match the larger font size
    });

    const centroid = turf.centroid(capa.feature).geometry.coordinates;
    const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
    marker.addTo(capa._map);
  };

  const agregaNombreTerritorioAPoligono = async (territorio: any, capa: any) => {
    const leaflet = (await import('leaflet')).default;
    const abreviacionNombre = territorio.properties.abreviacion;
    const simbolo = leaflet.divIcon({
      className: styles['polygon-label'],
      html: `<div>${abreviacionNombre}</div>`,
      iconSize: [abreviacionNombre.length * 6, 20], // Dynamically adjust width based on text length
      iconAnchor: [abreviacionNombre.length * 3, 10] // Center the label
    });

    const centroid = turf.centroid(territorio).geometry.coordinates;
    const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
    marker.addTo(capa._map);
  };

  if (!lineasColindantesGeoJson || !territoriosGeoJson || !comunidadesGeoJson) return <div>Cargando el mapa...</div>;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={estiloContenedorBotones}>
        <button onClick={() => establecerMostrarOSM(!mostrarOSM)} style={estiloBoton(mostrarOSM, 'green')}>OSM</button>
        <button onClick={() => establecerMostrarLineas(!mostrarLineasColindantes)} style={estiloBoton(mostrarLineasColindantes, '#FF0000')}>Lineas</button>
        <button onClick={() => establecerMostrarTerritorios(!mostrarTerritorios)} style={estiloBoton(mostrarTerritorios, '#3388FF')}>Territorios</button>
        <button onClick={() => establecerMostrarComunidades(!mostrarComunidades)} style={estiloBoton(mostrarComunidades, '#3388FF')}>Comunidades</button>
      </div>
      <Contenedor center={[-0.227026, -70.067765]} zoom={7} style={{ height: '100%', width: '100%' }}>
        {mostrarOSM &&
          <CapaOSM
            url={modo === "online" ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          // <CapaOSM
          //   url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
          //   attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          // />
          }
        { mostrarTerritorios && territoriosGeoJson && <TerritoriosGeoJson data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />}
        { mostrarLineasColindantes && lineasColindantesGeoJson && <LineasColindantesGeoJson data={lineasColindantesGeoJson} onEachFeature={enCadaLinea} />}
        { mostrarComunidades && comunidadesGeoJson && comunidadesGeoJson.features.map((feature, index) => {
          const centroide = turf.centroid(feature).geometry.coordinates;
          return (
            <React.Fragment key={index}>
              <Circle
                center={[centroide[1], centroide[0]]}
                radius={2500}
                pathOptions={{ color: 'black', fillOpacity: 0.1 }}
              />
              <Circle
                center={[centroide[1], centroide[0]]}
                radius={10}
                pathOptions={{ color: 'black', fillOpacity: 1 }}
              />
            </React.Fragment>
          );
        })}

      </Contenedor>
    </div>
  );
};

export default Mapa;
