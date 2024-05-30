// src/components/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import consultaEspacial from 'components/consultas/espaciales/paraLinderos';
import { estiloLinea, estiloTerritorio } from './estilos';


const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

const Mapa: React.FC = () => {
  const [lineasGeoJson, establecerLineasGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);

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
            territorio: row.territorio
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
    if (territorio.properties && territorio.properties.territorio) {
      capa.bindPopup(`${territorio.properties.territorio}`);
    }
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
