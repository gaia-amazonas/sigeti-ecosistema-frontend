// src/components/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import consultaEspacial from 'components/consultas/espaciales/paraLinderos';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

const Mapa: React.FC = () => {
  const [geoJsonDatos, establecerGeoJsonDatos] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    const buscarDatosEspaciales = async () => {
      const respuesta = await fetch('/api/bigQueryEspacial?query=' + encodeURIComponent(consultaEspacial.lineas));
      const json = await respuesta.json();
      const features = json.rows.map((row: any) => ({
        type: 'Feature',
        properties: {
          OBJECTID: row.OBJECTID
        },
        geometry: JSON.parse(row.geometry)
      }));

      establecerGeoJsonDatos({
        type: 'FeatureCollection',
        features: features,
      });
    };

    buscarDatosEspaciales();
  }, []);

  const enCadaFeature = (feature: any, capa: any) => {
    if (feature.properties && feature.properties.OBJECTID) {
      capa.bindPopup(`OBJECTID: ${feature.properties.OBJECTID}`);
    }
  };

  if (!geoJsonDatos) {
    return <div>Cargando el mapa...</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Contenedor center={[-1.014411, -70.603798]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <CapaOSM
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJson data={geoJsonDatos} onEachFeature={enCadaFeature} />
      </Contenedor>
    </div>
  );
};

export default Mapa;
