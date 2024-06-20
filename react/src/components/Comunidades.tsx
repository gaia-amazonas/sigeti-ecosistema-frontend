// src/components/consultaConMapa/Comunidades.tsx

import * as turf from '@turf/turf';
import { FeatureCollection } from 'geojson';
import React from 'react';
import { Circle } from 'leaflet';
import dynamic from 'next/dynamic';
import { GeometriasConVariables } from 'tipos/paraMapas';

const CirculoComunidad = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface ComunidadesImp {
  comunidadesGeoJson: FeatureCollection;
  enCadaComunidad: (id: string, circle: Circle) => void;
}

const Comunidades: React.FC<ComunidadesImp> = ({ comunidadesGeoJson, enCadaComunidad }) => {
  return (
    <>
      {comunidadesGeoJson.features.map((comunidad, index) => {
        const centroide = turf.centroid(comunidad).geometry.coordinates;
        const id = (comunidad as GeometriasConVariables).properties.id;
        return (
          <React.Fragment key={index}>
            <CirculoComunidad
              center={[centroide[1], centroide[0]]}
              radius={1000}
              pathOptions={{ color: 'black', fillOpacity: 0.1, pane: 'overlayPane' }}
              eventHandlers={{
                click: (e) => enCadaComunidad(id, e.target as Circle)
              }}
            />
            <CirculoComunidad
              center={[centroide[1], centroide[0]]}
              radius={10}
              pathOptions={{ color: 'black', fillOpacity: 1, pane: 'markerPane' }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Comunidades;
