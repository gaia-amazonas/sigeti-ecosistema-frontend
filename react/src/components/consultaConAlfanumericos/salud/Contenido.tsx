// src/components/consultaConAlfanumericos/salud/Contenido.tsx

import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, GeoJSON, useMapEvents } from 'react-leaflet';
import L, { Layer } from 'leaflet';

import { useUser } from '../../../context/UserContext';

import estilos from 'estilosParaMapas/ParaMapas.module.css';
import styles from '../MapComponent.module.css';
import { CajaTitulo } from '../estilos';

import DatosConsultados from 'tipos/salud/datosConsultados';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface MapComponentProps {
  datos: DatosConsultados;
}

const MapComponent: React.FC<MapComponentProps> = ({ datos }) => {

    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const { user } = useUser();

    if (!user) {
        return <div><p>Ingrese al sistema para ver el mapa.</p></div>;
    }

    if (datosSaludInvalidos(datos)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
                <div className={estilos.spinner}></div>
            </div>;
    }
    const { mujeresEnEdadFertil, comunidadesGeoJson } = datos;

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
            <CajaTitulo>Mujeres En Edad Fértil</CajaTitulo>
            <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%' }}>
                <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
    if (zoomNivel === 10) return zoomNivel ** 1.5;
    if (zoomNivel === 11) return zoomNivel ** 1.85;
    if (zoomNivel > 11) return zoomNivel ** 2.05;
    return zoomNivel ** 2.25;
};

const shouldDisplayText = (zoomNivel: number): boolean => {
    return zoomNivel >= 10;
};

const devuelveTexto = (expandido: boolean, proporcion: number, total: number): string => {
    if (expandido) return `<div class="${styles['text-icon-container']}">Proporción: ${proporcion}% </br> Fértiles: ${total}</div>`;
    return `<div class="${styles['text-icon-container']}">${proporcion}%</div>`;
}

const CustomCircleMarker: React.FC<CustomCircleMarkerProps> = ({ center, baseRadius, color, proporcion, total, zoomNivel }) => {
    const deberiaMostrarTextExpandido = (): boolean => {
        return zoomNivel >= 12;
    }
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
                html: devuelveTexto(deberiaMostrarTextExpandido(), proporcion, total),
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

const datosSaludInvalidos = (datosSalud: DatosConsultados) => {
    return !datosSalud.comunidadesGeoJson ||
    !datosSalud.mujeresEnEdadFertil ||
    !datosSalud.territoriosGeoJson;
};
