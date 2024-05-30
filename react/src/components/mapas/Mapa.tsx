// src/components/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import { estiloLinea, estiloTerritorio } from './estilos';
import consultaEspacial from 'components/consultas/espaciales/paraLinderos';
import consultasGeneralesPorTerritorio from 'consultas/generales/porTerritorio';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

const Mapa: React.FC = () => {
  const [lineasGeoJson, establecerLineasGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [gestionDocumentalTerritorio, establecerGestionDocumentalTerritorio] = useState<any>({});

  useEffect(() => {
    const buscarLineas = async () => {
      const respuesta = await fetch('/api/bigQueryEspacial?query=' + encodeURIComponent(consultaEspacial.lineas));
      const json = await respuesta.json();
      const features = json.rows.map((row: any) => ({
        type: 'Feature',
        properties: {
          OBJECTID: row.OBJECTID
        },
        geometry: JSON.parse(row.geometry)
      }));

      establecerLineasGeoJson({
        type: 'FeatureCollection',
        features: features,
      });
    };

    const buscarTerritorios = async () => {
      const respuesta = await fetch('/api/bigQueryEspacial?query=' + encodeURIComponent(consultaEspacial.territorios));
      const json = await respuesta.json();

      const features = json.rows.map((row: any) => {
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
      }).filter((feature: any) => feature !== null);

      establecerTerritoriosGeoJson({
        type: 'FeatureCollection',
        features: features,
      });
    };

    buscarLineas();
    buscarTerritorios();

  }, []);

  const enCadaLinea = (linea: any, capa: any) => {
    if (linea.properties && linea.properties.OBJECTID) {
      capa.bindPopup(`ID: ${linea.properties.OBJECTID}`);
    }
  };

  const enCadaTerritorio = (territorio: any, capa: any) => {
    capa.on('click', async () => {
      if (territorio.properties && territorio.properties.id_ti) {
        const gestion_documental = await buscarDatos(consultasGeneralesPorTerritorio.gestion_documental(territorio.properties.id_ti));
        establecerGestionDocumentalTerritorio({ gestion_documental });

        const timelineContainer = document.createElement('div');
        timelineContainer.style.display = 'flex';
        timelineContainer.style.flexWrap = 'wrap';
        timelineContainer.style.width = '100%';
        timelineContainer.style.height = 'auto';

        const infoContainer = document.createElement('div');
        infoContainer.style.marginTop = '10px';
        infoContainer.style.width = '100%';

        gestion_documental.rows.forEach((doc: any, index: number) => {
          const circle = document.createElement('div');
          circle.style.width = '20px';
          circle.style.height = '20px';
          circle.style.backgroundColor = 'orange';
          circle.style.borderRadius = '50%';
          circle.style.cursor = 'pointer';
          circle.style.margin = '5px';
          circle.title = doc.Fecha_ini_actividad.value;

          circle.addEventListener('click', () => {
            infoContainer.innerHTML = `
              <strong>Documento:</strong> ${doc.Nombre_documento}<br/>
              <strong>Lugar:</strong> ${doc.Lugar}<br/>
              <strong>Fechas</strong>
              <strong>  de Inicio:</strong> ${doc.Fecha_ini_actividad.value}<br/>
              <strong>  de Finalización</strong> ${doc.Fecha_fin_actividad.value}<br/>
              <strong>Tipo Escenario:</strong> ${doc.Tipo_escenario}<br/>
              <strong><a href="${doc.Link_documento}" target="_blank">Link Documento</a></strong><br/>
              <strong><a href="${doc.Link_acta_asistencia}" target="_blank">Link Acta Asistencia</a></strong><br/>
            `;
          });

          timelineContainer.appendChild(circle);
        });

        capa.bindPopup(`
          <div style="width: 600px;">
            <strong>Territorio: ${territorio.properties.territorio}</strong>
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

  const buscarDatos = async (consulta: string) => {
    const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
    return await respuesta.json();
  };

  if (!lineasGeoJson || !territoriosGeoJson) {
    return <div>Cargando el mapa...</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Contenedor center={[-1.014411, -70.603798]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <CapaOSM
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LineasGeoJson data={lineasGeoJson} onEachFeature={enCadaLinea} style={estiloLinea} />
        <TerritoriosGeoJson data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />
      </Contenedor>
    </div>
  );
};

export default Mapa;
