// src/components/consultaConAlfanumericos/salud/Chagras.tsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import bbox from '@turf/bbox';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import CustomCircleMarker from '../general/CustomCircleMarker';
import L from 'leaflet';

interface ChagrasMapProps {
  chagrasPorPersonaYFamilia: any;
  comunidadesGeoJson: FeatureCollection<Geometry, GeoJsonProperties>;
  territoriosGeoJson: FeatureCollection<Geometry, GeoJsonProperties>;
  variableSeleccionada: 'chagrasPorPersona' | 'chagrasPorFamilia';
  zoomNivel: number;
  establecerZoomNivel: (zoom: number) => void;
  setVariableSeleccionada: (variable: 'chagrasPorPersona' | 'chagrasPorFamilia') => void;
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

const AdjustMapBounds = ({ territoriosGeoJson }: { territoriosGeoJson: FeatureCollection }) => {
  const map = useMap();

  useEffect(() => {
    if (territoriosGeoJson) {
      const bounds = bbox(territoriosGeoJson);
      map.fitBounds([
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]]
      ]);
    }
  }, [territoriosGeoJson, map]);

  return null;
};

const Legend = ({ min, max }: { min: number; max: number }) => {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <h4>Chagras</h4>
        <div style="background: linear-gradient(to right, rgb(200, 200, 0), rgb(200, 0, 0)); width: 100px; height: 20px; border-radius: 5px;"></div>
        <div style="display: flex; justify-content: space-between;">
          <span>${Math.round(min)}</span><span>${Math.round(max)}</span>
        </div>
        <div>
          <i style="background: rgb(200, 200, 0); width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>Baja
          <br>
          <i style="background: rgb(200, 0, 0); width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>Alta
        </div>
      `;
      return div;
    };
    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [map, min, max]);

  return null;
};

const ChagrasMap: React.FC<ChagrasMapProps> = ({
  chagrasPorPersonaYFamilia, comunidadesGeoJson, territoriosGeoJson, variableSeleccionada, zoomNivel, establecerZoomNivel, setVariableSeleccionada
}) => {
  const totalValues = comunidadesGeoJson?.features.map(feature => {
    const id = feature.properties?.id;
    const datosFeature = chagrasPorPersonaYFamilia?.rows.filter((d: { comunidadId: string; }) => d.comunidadId === id);
    return datosFeature?.reduce((sum: number, item: { [x: string]: number; }) => sum + item[variableSeleccionada], 0) || 0;
  });
  const minTotal = totalValues ? Math.min(...totalValues) : 0;
  const maxTotal = totalValues ? Math.max(...totalValues) : 0;

  return (
    <>
      <div>
        <label>
          Selecciona variable:
          <select value={variableSeleccionada} onChange={(e) => setVariableSeleccionada(e.target.value as 'chagrasPorPersona' | 'chagrasPorFamilia')}>
            <option value="chagrasPorPersona">Chagras por Persona</option>
            <option value="chagrasPorFamilia">Chagras por Familia</option>
          </select>
        </label>
      </div>
      <MapContainer center={[0.969793, -70.830454]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
        <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
        <AdjustMapBounds territoriosGeoJson={territoriosGeoJson} />
        <Legend min={minTotal} max={maxTotal} />
        <TileLayer
          url={"https://api.maptiler.com/maps/210f299d-7ee0-44b4-8a97-9c581923af6d/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw"}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        />
        {territoriosGeoJson && (
          <GeoJSON data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
        )}
        {comunidadesGeoJson && (
          <>
            {comunidadesGeoJson.features.map((feature, index) => {
              const id = feature.properties?.id;
              const datosFeature = chagrasPorPersonaYFamilia?.rows.filter((d: { comunidadId: string; }) => d.comunidadId === id);
              const total = datosFeature?.reduce((sum: number, item: { [x: string]: number; }) => sum + item[variableSeleccionada], 0) || 1;
              const color = getColor(total, minTotal, maxTotal);
              const coordinates = getCoordinates(feature.geometry);
              const markerPosition = [coordinates[0][1], coordinates[0][0]];
              if (coordinates.length === 0) return null;
              return (
                <CustomCircleMarker
                  key={index}
                  center={[markerPosition[0], markerPosition[1]]}
                  baseRadius={2}
                  color={color}
                  proporcion={Math.round(total)}
                  total={Math.round(total)}
                  zoomNivel={zoomNivel}
                />
              );
            })}
          </>
        )}
      </MapContainer>
    </>
  );
};

export default ChagrasMap;
