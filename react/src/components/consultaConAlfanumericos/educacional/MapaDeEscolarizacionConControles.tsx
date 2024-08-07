// src/components/consultaConAlfanumericos/educacional/MapaConControles.tsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, useMap } from 'react-leaflet';
import { Slider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import * as turf from '@turf/turf';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import { useUser } from '../../../context/UserContext';
import DatosConsultados, { EscolaridadPrimariaYSecundaria } from 'tipos/educacional/datosConsultados';
import { buscarPorComunidadesEnTerritorios, buscarPorTodasComunidadesEnTerritorios, buscarPorTodasComunidadesEnTodosTerritorios } from 'buscadores/paraAlfanumerica/dinamicas/Educacional';
import MarcadorConEscolaridadPorComunidadGraficoTorta from './MarcadorConEscolaridadPorComunidadGraficoTorta';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import bbox from '@turf/bbox';


interface MapaConControlesProps {
    datosEducacionales: DatosConsultados;
    datosParaConsulta: { territoriosId: string[], comunidadesId: string[] };
    queEstoyViendo: { comunidadesGeoJson: FeatureCollection<Geometry, GeoJsonProperties> | null, territoriosGeoJson: FeatureCollection<Geometry, GeoJsonProperties> | null };
    modo: string | string[];
}

const MapaConControles: React.FC<MapaConControlesProps> = ({ datosEducacionales, datosParaConsulta, queEstoyViendo, modo }) => {
    const user = useUser();
    if (!user.user?.territoriosPrivados) return <div>Aún no se le han asignado territorios</div>;
    const territoriosPrivados = user.user?.territoriosPrivados;
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const [cargando, setCargando] = useState<{ [id: string]: boolean }>({});
    const [opcionEscolaridad, setOpcionEscolaridad] = useState<string>('Primaria');
    const [sliderValue, setSliderValue] = useState<number[]>([0, 120]);
    const [escolaridadFiltrada, setEscolaridadFiltrada] = useState<any | null>(null);

    useEffect(() => {
        setSliderValue([0, 120]);
    }, [opcionEscolaridad]);

    const fetchFilteredData = async (edadMinima: number, edadMaxima: number) => {
        let escolaridadPrimariaYSecundariaFiltrada: EscolaridadPrimariaYSecundaria | null = null;
        if (datosParaConsulta.comunidadesId[0] === 'Todas' && datosParaConsulta.territoriosId[0] === 'Todos') {
            escolaridadPrimariaYSecundariaFiltrada = await buscarPorTodasComunidadesEnTodosTerritorios(
                datosParaConsulta,
                modo,
                { edadMinima: edadMinima, edadMaxima: edadMaxima },
                opcionEscolaridad,
                territoriosPrivados
            );
        } else if (datosParaConsulta.comunidadesId[0] === 'Todas') {
            escolaridadPrimariaYSecundariaFiltrada = await buscarPorTodasComunidadesEnTerritorios(
                datosParaConsulta,
                modo,
                { edadMinima: edadMinima, edadMaxima: edadMaxima },
                opcionEscolaridad,
                territoriosPrivados
            );
        } else if (datosParaConsulta.comunidadesId[0] !== 'Todas' && datosParaConsulta.comunidadesId.length > 0) {
            escolaridadPrimariaYSecundariaFiltrada = await buscarPorComunidadesEnTerritorios(
                datosParaConsulta,
                modo,
                { edadMinima: edadMinima, edadMaxima: edadMaxima },
                opcionEscolaridad,
                territoriosPrivados
            );
        }
        setEscolaridadFiltrada(escolaridadPrimariaYSecundariaFiltrada);
    };

    useEffect(() => {
        if (!sliderValue) return;
        const edadMinima = sliderValue[0];
        const edadMaxima = sliderValue[1];
        if (edadMaxima !== undefined && edadMinima !== undefined) {
            fetchFilteredData(edadMinima, edadMaxima);
        }
    }, [sliderValue]);

    const handleSliderChange = (_event: any, newValue: number | number[]) => {
        setSliderValue(newValue as number[]);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpcionEscolaridad((event.target as HTMLInputElement).value);
    };

    const calculatePercentage = (data: any) => {
        if (!data.rows) return;
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

    const percentages = calculatePercentage(escolaridadFiltrada ? escolaridadFiltrada : datosEducacionales.escolaridadPrimariaYSecundaria);

    return (
        <>
            <FormControl component="fieldset">
                <FormLabel component="legend">Seleccione Escolaridad</FormLabel>
                <RadioGroup row aria-label="escolaridad" name="escolaridad" value={opcionEscolaridad} onChange={handleRadioChange}>
                    <FormControlLabel value="Primaria" control={<Radio />} label="Primaria" />
                    <FormControlLabel value="Secundaria" control={<Radio />} label="Secundaria" />
                </RadioGroup>
            </FormControl>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a style={{ textAlign: 'left' }}>{sliderValue[0]}</a>
                <a>Seleccione rango de edades</a>
                <a style={{ textAlign: 'right' }}>{sliderValue[1]}</a>
            </div>
            <div style={{ width: '100%' }}>
                <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={120}
                />
            </div>
            <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%', borderRadius: '3rem' }}>
                <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
                {
                    queEstoyViendo.territoriosGeoJson && (
                        <AdjustMapBounds territoriosGeoJson={queEstoyViendo.territoriosGeoJson} />
                    )
                }
                <TileLayer
                    url={modo === "online" ? "https://api.maptiler.com/maps/210f299d-7ee0-44b4-8a97-9c581923af6d/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                    attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
                />
                {queEstoyViendo.territoriosGeoJson && (
                    <GeoJSON data={queEstoyViendo.territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
                )}
                {queEstoyViendo.comunidadesGeoJson && (
                    <>
                        {queEstoyViendo.comunidadesGeoJson.features.map((comunidad: Feature<Geometry, GeoJsonProperties>, index: React.Key | null | undefined) => {
                            const centroide = turf.centroid(comunidad).geometry.coordinates;
                            const id = comunidad.properties?.id;
                            const datos = escolaridadFiltrada?.rows.filter((row: { comunidadId: string; }) => row.comunidadId === id).reduce((acc: { [x: string]: any; }, row: { escolarizacion: string; conteo: number; }) => {
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
                                            color={getColor(percentages ? percentages[id] : 0)}
                                            proporcion={percentages ? percentages[id] : 0}
                                            total={datos.sí + datos.no}
                                            zoomNivel={zoomNivel}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </MapContainer>
        </>
    );
};

export default MapaConControles;

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
};

interface CustomCircleMarkerProps {
    center: [number, number];
    baseRadius: number;
    color: string;
    proporcion: number;
    total: number;
    zoomNivel: number;
}

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
