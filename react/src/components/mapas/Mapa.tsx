// .src/components/mapas/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';

import { consultasEspacialesBigQuery, consultasEspacialesPostgreSQL } from 'consultas/espaciales/paraLineasColindantes';
import consultasGeneralesPorTerritorio from 'consultas/generales/porTerritorio';
import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import { estiloLinea, estiloTerritorio, estiloContenedorBotones, estiloBoton } from './estilos';
import { adjuntarAPopUp, creaCirculo, creaContenedorInformacion, creaContenedorLineaTiempo } from './graficosDinamicos';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface MapaImp {
  modo: string | string[];
}

const Mapa: React.FC<MapaImp> = ({ modo }) => {
  const [lineasGeoJson, setLineasGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, setTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [showOSM, setShowOSM] = useState(true);
  const [showLineas, setShowLineas] = useState(true);
  const [showTerritorios, setShowTerritorios] = useState(true);

  useEffect(() => {
    const fetchLineas = async () => {
      const featuresMapa = (row: any) => ({
        type: 'Feature',
        properties: { id: row.OBJECTID, col_entre: row.COL_ENTRE },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasEspacialesBigQuery.lineas, modo, featuresMapa) 
        : buscarDatosGeoJson(consultasEspacialesPostgreSQL.lineas, modo, featuresMapa));
      setLineasGeoJson(geoJson);
    };
    fetchLineas();
  }, [modo]);

  useEffect(() => {
    const fetchTerritorios = async () => {
      const featuresMapa = (row: any) => ({
        type: 'Feature',
        properties: { territorio: row.territorio, id_ti: row.id_ti },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasEspacialesBigQuery.territorios, modo, featuresMapa) 
        : buscarDatosGeoJson(consultasEspacialesPostgreSQL.territorios, modo, featuresMapa));
      setTerritoriosGeoJson(geoJson);
    };
    fetchTerritorios();
  }, [modo]);

  const enCadaLinea = (linea: any, capa: any) => {
    if (linea.properties && linea.properties.id) {
      capa.on('click', async () => {
        const gestion_documental = await buscarDatos(consultasGeneralesPorTerritorio.gestion_documental_linea_colindante(linea.properties.id), modo);
        const info = gestion_documental.rows[0];
        if (info) {
          const texto = `<strong>Colindante Entre:</strong> ${info.COL_ENTRE}<br/>
          <strong>¿Hubo acuerdp?:</strong> ${info.ACUERDO}<br/>
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
      });
    }
  };

  const enCadaTerritorio = (territorio: any, capa: any) => {
    if (territorio.properties && territorio.properties.id_ti) {
      capa.on('click', async () => {
        const gestion_documental = await buscarDatos(consultasGeneralesPorTerritorio.gestion_documental_territorio(territorio.properties.id_ti), modo);
        
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
            <strong>${territorio.properties.territorio}</strong> (${territorio.properties.id_ti})<br/>
            <div id="timeline-${territorio.properties.id_ti}" style="display: flex; flex-wrap: wrap;">Hechos históricos</div>
            <div id="info-${territorio.properties.id_ti}"></div>
          </div>
        `).openPopup();
        adjuntarAPopUp(territorio, contenedorLineaTiempo, contenedorInformacion);
      });
      tieneDatos(territorio, capa).then((hasData) => {
        if (hasData) {
          agregarSimboloDatos(territorio, capa);
        }
      });
    }
  };

  const tieneDatos = async (territorio: any, capa: any): Promise<boolean> => {
    const gestion_documental = await buscarDatos(consultasGeneralesPorTerritorio.gestion_documental_territorio(territorio.properties.id_ti), modo);
    return gestion_documental.rows.length !== 0;
  };

  const agregarSimboloDatos = async (territorio: any, capa: any) => {
    // Import leaflet inside useEffect
    const leaflet = (await import('leaflet')).default;
    const simbolo = leaflet.divIcon({
      className: 'custom-data-icon',
      html: '<div style="font-size: 24px;">📄</div>', // Increase the font size here
      iconSize: [1, 1], // Set the container size to match the larger font size
    });

    // Calculate the centroid of the polygon
    const centroid = turf.centroid(territorio).geometry.coordinates;
    const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
    marker.addTo(capa._map);
  };

  if (!lineasGeoJson || !territoriosGeoJson) return <div>Cargando el mapa...</div>;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={estiloContenedorBotones}>
        <button onClick={() => setShowOSM(!showOSM)} style={estiloBoton(showOSM, 'green')}>OSM</button>
        <button onClick={() => setShowLineas(!showLineas)} style={estiloBoton(showLineas, '#FF0000')}>Lineas</button>
        <button onClick={() => setShowTerritorios(!showTerritorios)} style={estiloBoton(showTerritorios, '#3388FF')}>Territorios</button>
      </div>
      <Contenedor center={[-0.227026, -70.067765]} zoom={7} style={{ height: '100%', width: '100%' }}>
        {showOSM &&
          <CapaOSM
            url={modo === "online" ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />}
        {showTerritorios && territoriosGeoJson && <TerritoriosGeoJson data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />}
        {showLineas && lineasGeoJson && <LineasGeoJson data={lineasGeoJson} onEachFeature={enCadaLinea} style={estiloLinea} />}
      </Contenedor>
    </div>
  );
};

export default Mapa;
