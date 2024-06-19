// src/components/graficos/general/MapaComunidadesPorTerritorio.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import { estiloTerritorio }from 'estilosParaMapas/paraMapas';


const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaMapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const CirculoComunidad = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface MapaImp {
    territoriosGeoJson: FeatureCollection | null;
    comunidadesGeoJson: FeatureCollection | null;
    modo: string | string[];
}

const Mapa: React.FC<MapaImp> = ({ territoriosGeoJson, comunidadesGeoJson, modo }) => {
  
  const centroMapa = [0.969793, -70.830454];
  
  return (
      <Contenedor center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex:1 }}>
          <CapaMapaOSM
            url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          />
          <TerritoriosGeoJson data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
          { comunidadesGeoJson && comunidadesGeoJson.features.map((comunidad, index) => {
            const centroide = turf.centroid(comunidad).geometry.coordinates;
            return (
              <React.Fragment key={index}>
                <CirculoComunidad
                  center={[centroide[1], centroide[0]]}
                  radius={1000}
                  pathOptions={{ color: 'black', fillOpacity: 0.1 }}
                />
                <CirculoComunidad
                  center={[centroide[1], centroide[0]]}
                  radius={10}
                  pathOptions={{ color: 'black', fillOpacity: 1 }}
                />
              </React.Fragment>
            );
          })}

      </Contenedor>
  );
};

export default Mapa;
