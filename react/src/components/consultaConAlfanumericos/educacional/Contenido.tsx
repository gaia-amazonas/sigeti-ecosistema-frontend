// src/components/consultaConAlfanumericos/educacional/Contenido.tsx

import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, Marker } from 'react-leaflet';
import React, { useState, useEffect } from 'react';
import { GeoJsonProperties } from 'geojson';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import SexoEdad from '../SexoEdad';
import { CajaTitulo } from '../estilos';
import isClient from 'utilidades/isClient';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';

import MapaInfraestructura from 'components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades';
import EducacionalComunidadesEnTerritoriosDatosConsultados, { Escolaridad, EscolaridadFila, EscolaridadPrimariaYSecundaria } from 'tipos/educacional/datosConsultados';
import { ComunidadesGeoJson, TerritoriosGeoJson } from 'tipos/cultural/datosConsultados';
import QueEstoyViendo from '../general/QueEstoyViendo';
import MarcadorConEscolaridadPorComunidadGraficoTorta from './MarcadorConEscolaridadPorComunidadGraficoTorta';

interface ComponenteCulturalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    queEstoyViendo: { comunidadesGeoJson: ComunidadesGeoJson | null, territoriosGeoJson: TerritoriosGeoJson | null };
    modo: string | string[];
}

const ComponenteCulturalComunidadesEnTerritorios: React.FC<ComponenteCulturalComunidadesEnTerritoriosImp> = ({ datosEducacionales, queEstoyViendo, modo }) => {

    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const [cargando, setCargando] = useState<{ [id: string]: boolean }>({});

    if (datosCulturalesInvalidos(datosEducacionales)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
        </div>;
    }

    const calculatePercentage = (data: EscolaridadPrimariaYSecundaria) => {
        const totalByCommunity: { [key: string]: number } = {};
        const yesByCommunity: { [key: string]: number } = {};

        data.rows.forEach((row: any) => {
            const { comunidadId, escolarizacion, conteo } = row;
            if (!totalByCommunity[comunidadId]) {
                totalByCommunity[comunidadId] = 0;
                yesByCommunity[comunidadId] = 0;
            }
            totalByCommunity[comunidadId] += conteo;
            if (escolarizacion === "Sí") {
                yesByCommunity[comunidadId] += conteo;
            }
        });

        const percentages: { [key: string]: number } = {};
        for (const comunidadId in totalByCommunity) {
            percentages[comunidadId] = (yesByCommunity[comunidadId] / totalByCommunity[comunidadId]) * 100;
        }
        return percentages;
    };

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

    const percentages = calculatePercentage(datosEducacionales.escolaridadPrimariaYSecundaria?);

    return (
        <>
            <CajaTitulo>Escolaridad Joven</CajaTitulo>
            <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridadJoven)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
            <CajaTitulo>Escolaridad General</CajaTitulo>
            <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridad)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
            <CajaTitulo>Infraestructura</CajaTitulo>
            <MapaInfraestructura datos={datosEducacionales} modo={modo} />
            <CajaTitulo>Mapa de Escolarización Primaria y Secundaria</CajaTitulo>
            <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%' }}>
                <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {queEstoyViendo.territoriosGeoJson && (
                    <GeoJSON data={queEstoyViendo.territoriosGeoJson as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJsonProperties>} style={estiloTerritorio} />
                )}
                { queEstoyViendo.comunidadesGeoJson && (
                    <>
                        {queEstoyViendo.comunidadesGeoJson.features.map((comunidad, index) => {
                            const centroide = turf.centroid(comunidad).geometry.coordinates;
                            const id = comunidad.properties?.id;
                            const datos = datosEducacionales.escolaridadPrimariaYSecundaria?.rows.filter(row => row.comunidadId === id).reduce((acc, row) => {
                                acc[row.escolarizacion.toLowerCase() as 'sí' | 'no'] += row.conteo;
                                return acc;
                            }, { sí: 0, no: 0 });
                            const coordinates = getCoordinates(comunidad.geometry);
                            if (coordinates.length === 0 || !datos) return null;
                            return (
                                <React.Fragment key={index}>
                                    {(zoomNivel > 10) && (
                                        <MarcadorConEscolaridadPorComunidadGraficoTorta
                                            posicion={[centroide[1], centroide[0]]}
                                            datos={datos}
                                            estaCargando={cargando[id]}
                                        />
                                    )}
                                    {(zoomNivel <= 10) && (
                                        <CustomCircleMarker
                                            center={[coordinates[0][1], coordinates[0][0]]}
                                            baseRadius={2}
                                            color={getColor(percentages[id])}
                                            proporcion={percentages[id]}
                                            total={datos.sí + datos.no}
                                            zoomNivel={zoomNivel}
                                        />
                                    )}
                                    {zoomNivel >= 12 && crearMarcadorNombre(comunidad.properties?.nombre) && (
                                        <Marker
                                            position={[centroide[1], centroide[0] + 0.25 / zoomNivel]}
                                            icon={crearMarcadorNombre(comunidad.properties?.nombre)}
                                            zIndexOffset={1000}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </MapContainer>
            <QueEstoyViendo
                comunidades={queEstoyViendo.comunidadesGeoJson}
                territorios={queEstoyViendo.territoriosGeoJson}
            />
        </>
    );
}

export default ComponenteCulturalComunidadesEnTerritorios;

const datosCulturalesInvalidos = (datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados) => {
    return !datosEducacionales.escolaridadPrimariaYSecundaria || 
    !datosEducacionales.comunidadesGeoJson ||
    !datosEducacionales.escolaridad ||
    !datosEducacionales.escolaridadJoven ||
    !datosEducacionales.territoriosGeoJson;
}

const segmentarPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: Escolaridad | null) => {
    if (!sexoEdadDatos) {
        return null;
    }
    return sexoEdadDatos.rows.map((item: EscolaridadFila) => ({
        grupo: item.nivelEducativo,
        [item.sexo]: item.conteo * (item.sexo === 'Hombres' ? -1 : 1)
    }));
};

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

const devuelveTexto = (proporcion: number): string => {
    return `<div class="${estilos['text-icon-container']}">${Math.round(proporcion)}%</div>`;
}

interface CustomCircleMarkerProps {
    center: [number, number];
    baseRadius: number;
    color: string;
    proporcion: number;
    total: number;
    zoomNivel: number;
}

const crearMarcadorNombre = (nombre: string) => {
    if (!isClient) return null;
    const leaflet = require('leaflet');
    return leaflet.divIcon({
        html: `<div style="z-index: 10;
            font-size: 1rem;
            font-weight: bold;
            color: black;
            background: white;
            margin-left: 0rem;
            margin-right: 0;
            border-radius: 1rem;
            padding-left: 1rem;
            padding-right: 5rem">${nombre}</div>`,
        iconSize: [nombre.length * 6, 20],
        iconAnchor: [nombre.length * 3, 10],
        className: ''
    });
};

const CustomCircleMarker: React.FC<CustomCircleMarkerProps> = ({ center, baseRadius, color, proporcion, total, zoomNivel }) => {
    const map = useMap();
    useEffect(() => {
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
            map.removeLayer(circleMarker as unknown as L.Layer);
            if (textMarker) {
                map.removeLayer(textMarker);
            }
        };
    }, [map, center, baseRadius, color, proporcion, total, zoomNivel]);
    return null;
};

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target.getZoom());
        }
    });
    return null;
};
