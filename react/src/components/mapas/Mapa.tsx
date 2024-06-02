// .src/components/mapas/Mapa.tsx

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import {
  estiloLinea,
  estiloTerritorio,
  contenedorBotones,
  estiloBoton,
  estiloCircle,
  estiloTimelineContainer,
  estiloInfoContainer
} from './estilos';
import consultaEspacial from 'components/consultas/espaciales/paraLinderos';
import consultasGeneralesPorTerritorio from 'consultas/generales/porTerritorio';
import { buscarDatos, buscarDatosGeoJson } from 'buscadores/buscarDatosBigQuery';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface MapaImp {
  modo: string;
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

      const geoJson = await buscarDatosGeoJson(consultaEspacial.lineas, modo, featuresMapa);
      establecerLineasGeoJson(geoJson);
    };

    buscarLineas();
  }, [modo]);

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

      const geoJson = await buscarDatosGeoJson(consultaEspacial.territorios, modo, featuresMapa);
      establecerTerritoriosGeoJson(geoJson);
    };

    buscarTerritorios();
  }, [modo]);

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

        const timelineContainer = document.createElement('div');
        Object.assign(timelineContainer.style, estiloTimelineContainer);

        let infoContainer = document.createElement('div');
        Object.assign(infoContainer.style, estiloInfoContainer);

        gestion_documental.rows.forEach((doc: any, index: number) => {
          const circle = document.createElement('div');
          Object.assign(circle.style, estiloCircle);
          circle.title = doc.Fecha_ini_actividad.value;

          circle.addEventListener('click', () => {
            infoContainer.innerHTML = `
              <strong>Documento:</strong> ${doc.Nombre_documento}<br/>
              <strong>Lugar:</strong> ${doc.Lugar}<br/>
              <strong>Fechas</strong><br/>
              <strong> - de Inicio:</strong> ${doc.Fecha_ini_actividad.value}<br/>
            `;
            if (doc.Fecha_fin_actividad) {
              infoContainer.innerHTML = infoContainer.innerHTML + `<strong> - de Finalización:</strong> ${doc.Fecha_fin_actividad.value}<br/>`;
            }
            infoContainer.innerHTML = infoContainer.innerHTML + `<strong>Tipo Escenario:</strong> ${doc.Tipo_escenario}<br/>
              <strong><a href="${doc.Link_documento}" target="_blank">Link Documento</a></strong><br/>
              <strong><a href="${doc.Link_acta_asistencia}" target="_blank">Link Acta Asistencia</a></strong><br/>`;
          });

          timelineContainer.appendChild(circle);
        });

        capa.bindPopup(`
          <div style="width: auto; max-width: 20rem;">
            <strong>${territorio.properties.territorio}</strong>
            (${territorio.properties.id_ti})<br/>
            <div id="timeline-${territorio.properties.id_ti}" style="display: flex; flex-wrap: wrap;"></div>
            <div id="info-${territorio.properties.id_ti}"></div>
          </div>
        `).openPopup();

        const popupContent = document.getElementById(`timeline-${territorio.properties.id_ti}`);
        if (popupContent) {
          popupContent.appendChild(timelineContainer);
        }

        const infoContent = document.getElementById(`info-${territorio.properties.id_ti}`);
        if (infoContent) {
          infoContent.appendChild(infoContainer);
        }
      }
    });
  };

  if (!lineasGeoJson || !territoriosGeoJson) {
    return <div>Cargando el mapa...</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={contenedorBotones}>
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
          <CapaOSM
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
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
