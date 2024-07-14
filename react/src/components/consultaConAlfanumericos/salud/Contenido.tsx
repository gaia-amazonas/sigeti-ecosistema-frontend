// src/components/MapComponent.tsx
import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L, { Layer } from 'leaflet';

import estilos from 'estilosParaMapas/ParaMapas.module.css';

import DatosConsultados from 'tipos/salud/datosConsultados';

interface MapComponentProps {
  datos: DatosConsultados;
}

const MapComponent: React.FC<MapComponentProps> = ({ datos }) => {
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    if (datosSaludInvalidos(datos)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
                <div className={estilos.spinner}></div>
            </div>;
    }

    const { mujeresEnEdadFertil, comunidadesGeoJson } = datos;

    const getColor = (value: number): string => {
        let red: number, green: number = 200, blue: number = 0;
        if (value < 66) {
            red = 200;
        } else {
            const transitionValue = (value - 66) / (100 - 66);
            red = Math.round(60 * (1 - transitionValue));
        }
        return `rgb(${red}, ${green}, ${blue})`;
    }

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
        <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%' }}>
            <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {mujeresEnEdadFertil?.rows.map((row, idx) => {
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
                    text={`${Math.round(row.proporcionMujeresEnEdadFertil)}%`}
                    zoomNivel={zoomNivel}
                />
                );
            })}
        </MapContainer>
    );
};

interface CustomCircleMarkerProps {
  center: [number, number];
  baseRadius: number;
  color: string;
  text: string;
  zoomNivel: number;
}

const calculateAdjustedRadius = (zoomNivel: number): number => {
    console.log(zoomNivel);
    if (zoomNivel <= 9) return zoomNivel;
    if (zoomNivel === 10) return zoomNivel ** 1.5;
    if (zoomNivel === 11) return zoomNivel ** 1.85;
    if (zoomNivel > 11) return zoomNivel ** 2.05;
    return zoomNivel ** 2.25;
};

const shouldDisplayText = (zoomNivel: number): boolean => {
    return zoomNivel >= 10;
};

const CustomCircleMarker: React.FC<CustomCircleMarkerProps> = ({ center, baseRadius, color, text, zoomNivel }) => {
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
                html: `<div style="text-align: center; color: black; font-size: 12px; font-weight: bold;">${text}</div>`,
            });
            textMarker = L.marker(center, { icon: textIcon }).addTo(map) as L.Marker;
        }

        return () => {
            map.removeLayer(circleMarker as unknown as Layer);
            if (textMarker) {
                map.removeLayer(textMarker);
            }
        };
    }, [map, center, baseRadius, color, text, zoomNivel]);
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

const datosSaludInvalidos = (datosSalud: DatosConsultados) => {
    return !datosSalud.comunidadesGeoJson ||
    !datosSalud.mujeresEnEdadFertil ||
    !datosSalud.territoriosGeoJson;
};
