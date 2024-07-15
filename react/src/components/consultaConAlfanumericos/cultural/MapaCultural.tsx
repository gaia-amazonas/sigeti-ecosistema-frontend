// src/components/consultaConAlfanumericos/cultural/MapaCultural.tsx

import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Popup } from 'react-leaflet';
import CustomCircleMarker from '../general/CustomCircleMarker';
import CulturalGraficoBurbuja from './Contenido';
import L from 'leaflet';

interface MapaCulturalImp {
  territoriosGeoJson: FeatureCollection;
  comunidadesGeoJson: FeatureCollection;
  modo: string | string[];
  datos: any[];
}

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: (e: { target: { getZoom: () => number; }; }) => {
      setZoomLevel(e.target.getZoom());
    }
  });
  return null;
};

const getColor = (value: number, min: number, max: number): string => {
  const normalizedValue = (Math.log(value + 1) - Math.log(min + 1)) / (Math.log(max + 1) - Math.log(min + 1));
  const red = 255;
  const green = 255 * (1 - normalizedValue);
  const blue = 0;
  return `rgb(${red}, ${green}, ${blue})`;
};

const getCoordinates = (geometry: any): number[][] => {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates[0][0];
  } else if (geometry.type === 'Point') {
    return [geometry.coordinates];
  } else if (geometry.type === 'MultiPoint') {
    return [geometry.coordinates[0]];
  } else {
    return [];
  }
};

const MapaCultural: React.FC<MapaCulturalImp> = ({ territoriosGeoJson, comunidadesGeoJson, modo, datos }) => {
  const centroMapa = [0.969793, -70.830454];
  const [zoomNivel, establecerZoomNivel] = useState<number>(6);
  const [popupInfo, setPopupInfo] = useState<{ position: [number, number], datosComunidad: any[], total: number } | null>(null);

  const handleMarkerClick = (position: [number, number], datosComunidad: any[], total: number) => {
    setPopupInfo({ position, datosComunidad, total });
  };

  const crearMarcadorNombre = (nombre: string) => {
    return L.divIcon({
      html: `<div style="z-index: 10;
        font-size: 1rem;
        font-weight: bold;
        color: black;
        background: white;
        margin-left: 0rem;
        margin-right: 0;
        border-radius: 1rem;
        padding-left: 1rem;
        padding-right: 5rem">${nombre}
      </div>`,
      iconSize: [nombre.length * 6, 20],
      iconAnchor: [nombre.length * 3, 10],
      className: ''
    });
  };

  const totalPopulations = comunidadesGeoJson?.features.map(comunidad => {
    const id = comunidad.properties?.id;
    const total = datos.filter(d => d.ID_CNIDA === id).reduce((sum, item) => sum + 1, 0);
    return total;
  });

  const minPopulation = totalPopulations ? Math.min(...totalPopulations) : 0;
  const maxPopulation = totalPopulations ? Math.max(...totalPopulations) : 0;

  return (
    <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
      <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
      <TileLayer
        url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
      />
      {territoriosGeoJson && (
        <GeoJSON data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
      )}
      {comunidadesGeoJson && (
        <>
          {comunidadesGeoJson.features.map((comunidad, index) => {
            const centroide = turf.centroid(comunidad).geometry.coordinates;
            const id = comunidad.properties?.id;
            const datosComunidad = datos.filter(d => d.ID_CNIDA === id);
            const total = datosComunidad.length;
            const color = getColor(total, minPopulation, maxPopulation);
            const coordinates = getCoordinates(comunidad.geometry);
            if (coordinates.length === 0) return null;
            return (
              <React.Fragment key={index}>
                <CustomCircleMarker
                  center={[coordinates[0][1], coordinates[0][0]]}
                  baseRadius={2}
                  color={color}
                  proporcion={total}
                  total={total}
                  zoomNivel={zoomNivel}
                  onClick={() => handleMarkerClick([centroide[1], centroide[0]], datosComunidad, total)}
                />
                {zoomNivel > 9 && (
                  <Marker
                    position={[centroide[1] - 0.07, centroide[0]]}
                    icon={crearMarcadorNombre(comunidad.properties?.nombre)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
      {popupInfo && (
        <Popup 
          position={popupInfo.position} 
          eventHandlers={{ remove: () => setPopupInfo(null) }}
        >
          <div style={{ width: `${Math.min(popupInfo.total * 100, 300)}px`, height: `${Math.min(popupInfo.total * 100, 300)}px` }}>
            <CulturalGraficoBurbuja
              datos={popupInfo.datosComunidad}
              labelKey="lengua"
              valueKey="conteo"
              groupKey="ID_CNIDA"
            />
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default MapaCultural;