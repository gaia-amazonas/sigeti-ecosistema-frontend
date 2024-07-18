// src/components/consultaConAlfanumericos/educacional/Contenido.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import SexoEdad from '../SexoEdad';
import { CajaTitulo } from '../estilos';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';

import MapaInfraestructura from 'components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades';
import EducacionalComunidadesEnTerritoriosDatosConsultados, { Escolaridad, EscolaridadFila } from 'tipos/educacional/datosConsultados';
import { ComunidadesGeoJson, TerritoriosGeoJson } from 'tipos/cultural/datosConsultados';
import QueEstoyViendo from '../general/QueEstoyViendo';

interface ComponenteCulturalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    queEstoyViendo: { comunidadesGeoJson: ComunidadesGeoJson | null, territoriosGeoJson: TerritoriosGeoJson | null };
    modo: string | string[];
}

const ComponenteCulturalComunidadesEnTerritorios: React.FC<ComponenteCulturalComunidadesEnTerritoriosImp> = ({ datosEducacionales, queEstoyViendo, modo }) => {
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);

    if (datosCulturalesInvalidos(datosEducacionales)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
        </div>;
    }

    const calculatePercentage = (data: any) => {
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

    const percentages = calculatePercentage(datosEducacionales.escolaridadPrimariaYSecundaria);

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
                    <GeoJSON data={queEstoyViendo.territoriosGeoJson as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>} style={estiloTerritorio} />
                )}
                {datosEducacionales.escolaridadPrimariaYSecundaria?.rows.map((row, idx) => {
                    const community = queEstoyViendo.comunidadesGeoJson?.features.find(feature => feature.properties?.id === row.comunidadId);
                    if (!community) return null;
                    const coordinates = getCoordinates(community.geometry);
                    if (coordinates.length === 0) return null;
                    const percentage = percentages[row.comunidadId];
                    return (
                        <CustomCircleMarker
                            key={idx}
                            center={[coordinates[0][1], coordinates[0][0]]}
                            baseRadius={2}
                            color={getColor(percentage)}
                            proporcion={Math.round(percentage)}
                            total={row.conteo}
                            zoomNivel={zoomNivel}
                        />
                    );
                })}
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

const devuelveTexto = (expandido: boolean, proporcion: number, total: number): string => {
    if (expandido) return `<div class="${estilos['text-icon-container']}">Proporción: ${proporcion}% </br> Escolarización: ${total}</div>`;
    return `<div class="${estilos['text-icon-container']}">${proporcion}%</div>`;
}

interface CustomCircleMarkerProps {
  center: [number, number];
  baseRadius: number;
  color: string;
  proporcion: number;
  total: number;
  zoomNivel: number;
}

const CustomCircleMarker: React.FC<CustomCircleMarkerProps> = ({ center, baseRadius, color, proporcion, total, zoomNivel }) => {
    const deberiaMostrarTextExpandido = (): boolean => {
        return zoomNivel >= 12;
    }
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
                html: devuelveTexto(deberiaMostrarTextExpandido(), proporcion, total),
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
