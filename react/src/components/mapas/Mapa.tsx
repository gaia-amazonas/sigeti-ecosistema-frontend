// .src/components/mapas/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import { FeatureCollection } from 'geojson';
import { consultasEspacialesBigQuery, consultasEspacialesPostgreSQL } from 'consultas/espaciales/paraLineasColindantes';
import consultasGeneralesPorTerritorio from 'consultas/generales/porTerritorio';
import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import { creaContenedorLineaTiempo, creaContenedorInformacion, creaCirculo, adjuntarAPopUp } from './graficosDinamicos';

import {
  estiloLinea,
  estiloTerritorio,
  estiloContenedorBotones,
  estiloBoton
} from './estilos';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface MapaImp {
  modo: string | string[];
}

const Mapa: React.FC<MapaImp> = ({ modo }) => {

  const [lineasGeoJson, establecerLineasGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [showOSM, setShowOSM] = useState(true);
  const [showLineas, setShowLineas] = useState(true);
  const [showTerritorios, setShowTerritorios] = useState(true);

  useEffect(() => {
    const buscarLineas = async () => {
      const featuresMapa = (row: any) => ({
        type: 'Feature',
        properties: {
          id: row.OBJECTID,
          col_entre: row.COL_ENTRE,
        },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await divisionConsultaLineasPorModo(modo, featuresMapa);
      establecerLineasGeoJson(geoJson);
    };

    buscarLineas();
  }, [modo]);

  const divisionConsultaLineasPorModo = async (modo: string | string[], featuresMapa: { (row: any): any; (row: any): any; }) => {
    if (modo === "online") {
      return await buscarDatosGeoJson(consultasEspacialesBigQuery.lineas, modo, featuresMapa);
    } else {
      return await buscarDatosGeoJson(consultasEspacialesPostgreSQL.lineas, modo, featuresMapa);
    }
  }

  useEffect(() => {
    const buscarTerritorios = async () => {
      const featuresMapa = (row: any) => {
        let geometry;
        try {
          geometry = JSON.parse(row.geometry);
        } catch (error) {
          throw new Error(`Error (${error}) parsing the geometry of the row ${row}`);
        }
        return {
          type: 'Feature',
          properties: {
            territorio: row.territorio,
            id_ti: row.id_ti
          },
          geometry: geometry
        };
      };
      
      const geoJson = await divisionConsultaTerritoriosPorModo(modo, featuresMapa);
      establecerTerritoriosGeoJson(geoJson);
      
    };

    buscarTerritorios();
  }, [modo]);

  const divisionConsultaTerritoriosPorModo = async (modo: string | string[], featuresMapa: { (row: any): any; (row: any): any; }) => {
    if (modo === "online") {
      return await buscarDatosGeoJson(consultasEspacialesBigQuery.territorios, modo, featuresMapa);
    } else {
      return await buscarDatosGeoJson(consultasEspacialesPostgreSQL.territorios, modo, featuresMapa);
    }
  }

  const enCadaLinea = (linea: any, capa: any) => {

    if (linea.properties && linea.properties.id) {
      capa.on('click', async () => {
        const gestion_documental = await buscarDatos(consultasGeneralesPorTerritorio.gestion_documental_linea_colindante(linea.properties.id), modo);
        const info = gestion_documental.rows[0];
        if (info) {
          const texto = `<strong>Colindante Entre:</strong> ${info.COL_ENTRE}<br/>
          <strong>Acuerdo:</strong> ${info.ACUERDO}`;
          capa.bindPopup(texto).openPopup();
        }
      });
    }

  };

  const enCadaTerritorio = (territorio: any, capa: any) => {
    
    capa.on('click', async () => {

      if (territorio.properties && territorio.properties.id_ti) {
        const gestion_documental = await buscarDatos(consultasGeneralesPorTerritorio.gestion_documental_territorio(territorio.properties.id_ti), modo);
        const contenedorLineaTiempo = creaContenedorLineaTiempo();
        const contenedorInformacion = creaContenedorInformacion();

        gestion_documental.rows.forEach((doc: any) => {
          const circle = creaCirculo(doc, contenedorInformacion);
          contenedorLineaTiempo.appendChild(circle);
        });

        capa.bindPopup(`
          <div style="width: auto; max-width: 20rem;">
            <strong>${territorio.properties.territorio}</strong>
            (${territorio.properties.id_ti})<br/>
            <div id="timeline-${territorio.properties.id_ti}" style="display: flex; flex-wrap: wrap;"></div>
            <div id="info-${territorio.properties.id_ti}"></div>
          </div>
        `).openPopup();

        adjuntarAPopUp(territorio, contenedorLineaTiempo, contenedorInformacion);
      }
    });
  };

  if (!lineasGeoJson || !territoriosGeoJson) {
    return <div>Cargando el mapa...</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={estiloContenedorBotones}>
        <button
          onClick={() => setShowOSM(!showOSM)}
          style={estiloBoton(showOSM, 'green')}
        >
          OSM
        </button>
        <button
          onClick={() => setShowLineas(!showLineas)}
          style={estiloBoton(showLineas, '#FF0000')}
        >
          Lineas
        </button>
        <button
          onClick={() => setShowTerritorios(!showTerritorios)}
          style={estiloBoton(showTerritorios, '#3388FF')}
        >
          Territorios
        </button>
      </div>
      <Contenedor center={[-1.014411, -70.603798]} zoom={8} style={{ height: '100%', width: '100%' }}>
        {showOSM && (
          modo === "online" ? (
            <CapaOSM
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          ) : (
            <CapaOSM
              url="http://localhost:8080/{z}/{x}/{y}.png.tile"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          )

        )}
        {showLineas && lineasGeoJson && (
          <LineasGeoJson data={lineasGeoJson} onEachFeature={enCadaLinea} style={estiloLinea} />
        )}
        {showTerritorios && territoriosGeoJson && (
          <TerritoriosGeoJson data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />
        )}
      </Contenedor>
    </div>
  );
};

export default Mapa;
