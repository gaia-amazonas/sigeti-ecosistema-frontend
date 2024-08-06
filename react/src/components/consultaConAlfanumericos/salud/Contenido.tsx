// src/components/consultaConAlfanumericos/salud/Contenido.tsx

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, GeoJSON, useMapEvents } from 'react-leaflet';
import L, { Layer } from 'leaflet';
import WrapperAnimadoParaHistorias from '../WrapperAnimadoParaHistorias';
import { useUser } from '../../../context/UserContext';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import styles from '../MapComponent.module.css';
import { CajaTitulo } from '../estilos';
import DatosConsultados from 'tipos/salud/datosConsultados';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import bbox from '@turf/bbox';

interface MapComponentProps {
  datos: DatosConsultados;
}

const MapComponent: React.FC<MapComponentProps> = ({ datos }) => {
  const [variableSeleccionada, setVariableSeleccionada] = useState<'chagrasPorPersona' | 'chagrasPorFamilia'>('chagrasPorPersona');
  const [zoomNivel, establecerZoomNivel] = useState<number>(6);
  const { user } = useUser();

  if (datosSaludInvalidos(datos)) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }

  const { mujeresEnEdadFertil, comunidadesGeoJson, territoriosGeoJson, chagrasPorPersonaYFamilia } = datos;

  if (!mujeresEnEdadFertil?.rows || mujeresEnEdadFertil?.rows.length === 0) {
    return <div><p>No cuentas con permisos necesarios para ver el mapa.</p></div>;
  }

  const getColor = (value: number): string => {
    const red = 200;
    const green = value < 66 ? 200 : Math.round(255 * (1 - (Math.log(value - 66 + 1) / Math.log(34 + 1))));
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

  return (
    <>
      { user?.role === 'admin' && (
        <WrapperAnimadoParaHistorias>
          <CajaTitulo>Mujeres En Edad Fértil</CajaTitulo>
          <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%', borderRadius: '3rem' }}>
            <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
            {
              datos.territoriosGeoJson && (
                <AdjustMapBounds territoriosGeoJson={datos.territoriosGeoJson} />
              )
            }
            <TileLayer
              url="https://api.maptiler.com/maps/210f299d-7ee0-44b4-8a97-9c581923af6d/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {datos.territoriosGeoJson && (
              <GeoJSON data={datos.territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {mujeresEnEdadFertil.rows.map((row, idx) => {
              const community = comunidadesGeoJson?.features.find(feature => feature.properties?.id === row.comunidadId);
              if (!community) return null;
              const coordinates = getCoordinates(community.geometry);
              if (coordinates.length === 0) return null;
              return (
                <CustomCircleMarker
                  key={idx}
                  center={[coordinates[0][1], coordinates[0][0]]}
                  baseRadius={2}
                  color={getColor(row.proporcionMujeresEnEdadFertil)}
                  proporcion={Math.round(row.proporcionMujeresEnEdadFertil)}
                  total={row.mujeresEnEdadFertil}
                  zoomNivel={zoomNivel}
                />
              );
            })}
          </MapContainer>
        </WrapperAnimadoParaHistorias>
      )}
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Población y Número de chagras</CajaTitulo>
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
                const datosFeature = chagrasPorPersonaYFamilia?.rows.filter(d => d.comunidadId === id);
                const total = datosFeature?.reduce((sum, item) => sum + item[variableSeleccionada], 0);
                const color = getColor(total ? total : 0);
                const coordinates = getCoordinates(feature.geometry);
                const markerPosition = [coordinates[0][1], coordinates[0][0]];
                if (coordinates.length === 0) return null;
                return (
                  <CustomCircleMarker
                    key={index}
                    center={[markerPosition[0], markerPosition[1]]}
                    baseRadius={2}
                    color={color}
                    proporcion={total ? total : 0}
                    total={total ? total : 0}
                    zoomNivel={zoomNivel}
                  />
                );
              })}
            </>
          )}
        </MapContainer>
      </WrapperAnimadoParaHistorias>
    </>
  );
};

interface CustomCircleMarkerProps {
  center: [number, number];
  baseRadius: number;
  color: string;
  proporcion: number;
  total: number;
  zoomNivel: number;
}

const calculateAdjustedRadius = (zoomNivel: number): number => {
  if (zoomNivel <= 9) return zoomNivel;
  if (zoomNivel === 10) return zoomNivel ** 1.12;
  if (zoomNivel === 11) return zoomNivel ** 1.25;
  if (zoomNivel > 11) return zoomNivel ** 1.5;
  return zoomNivel ** 2.25;
};

const shouldDisplayText = (zoomNivel: number): boolean => {
  return zoomNivel >= 10;
};

const devuelveTexto = (proporcion: number): string => {
  return `<div class="${styles['text-icon-container']}">${Math.round(proporcion * 100) / 100}</div>`;
}

const CustomCircleMarker: React.FC<CustomCircleMarkerProps> = ({ center, baseRadius, color, proporcion, total, zoomNivel }) => {
  const map = useMap();
  React.useEffect(() => {
    const adjustedRadius = calculateAdjustedRadius(zoomNivel);
    const circleMarker = L.circleMarker(center, {
      radius: adjustedRadius,
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
    }).addTo(map) as L.CircleMarker;
    let textMarker: L.Marker | null = null;
    if (shouldDisplayText(zoomNivel)) {
      const textIcon = L.divIcon({
        className: 'text-icon',
        html: devuelveTexto(proporcion),
      });
      textMarker = L.marker(center, { icon: textIcon }).addTo(map) as L.Marker;
    }
    return () => {
      map.removeLayer(circleMarker as unknown as Layer);
      if (textMarker) {
        map.removeLayer(textMarker);
      }
    };
  }, [map, center, baseRadius, color, proporcion, total, zoomNivel]);
  return null;
};

export default MapComponent;

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    }
  });
  return null;
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

const datosSaludInvalidos = (datosSalud: DatosConsultados) => {
  return !datosSalud.comunidadesGeoJson ||
    !datosSalud.mujeresEnEdadFertil ||
    !datosSalud.territoriosGeoJson;
};
