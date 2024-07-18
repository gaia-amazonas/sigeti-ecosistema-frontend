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
import {
    buscarPorComunidadesEnTerritorios,
    buscarPorTodasComunidadesEnTerritorios,
    buscarPorTodasComunidadesEnTodosTerritorios
} from 'buscadores/paraAlfanumerica/dinamicas/Educacional';

import MapaInfraestructura from 'components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades';
import EducacionalComunidadesEnTerritoriosDatosConsultados, {
    Escolaridad,
    EscolaridadFila,
    EscolaridadPrimariaYSecundaria
} from 'tipos/educacional/datosConsultados';
import { ComunidadesGeoJson, TerritoriosGeoJson } from 'tipos/cultural/datosConsultados';
import QueEstoyViendo from '../general/QueEstoyViendo';
import MarcadorConEscolaridadPorComunidadGraficoTorta from './MarcadorConEscolaridadPorComunidadGraficoTorta';
import { Slider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

interface ComponenteCulturalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    datosParaConsulta: { territoriosId: string[], comunidadesId: string[] };
    queEstoyViendo: { comunidadesGeoJson: ComunidadesGeoJson | null, territoriosGeoJson: TerritoriosGeoJson | null };
    modo: string | string[];
}

const ComponenteCulturalComunidadesEnTerritorios: React.FC<ComponenteCulturalComunidadesEnTerritoriosImp> = ({ datosEducacionales, datosParaConsulta, queEstoyViendo, modo }) => {

    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const [cargando, setCargando] = useState<{ [id: string]: boolean }>({});
    const [opcionEscolaridad, setOpcionEscolaridad] = useState<string>('Primaria');
    const [sliderValue, setSliderValue] = useState<number[]>([5, 13]);
    const [escolaridadFiltrada, setEscolaridadFiltrada] = useState<EscolaridadPrimariaYSecundaria | null>(null);

    useEffect(() => {
        if (opcionEscolaridad === 'Primaria') {
            setSliderValue([5, 13]);
        } else if (opcionEscolaridad === 'Secundaria') {
            setSliderValue([14, 20]);
        }
    }, [opcionEscolaridad]);

    useEffect(() => {
        if (!sliderValue) return;
        const edadMinima = sliderValue.at(0);
        const edadMaxima = sliderValue.at(1);
        if (!edadMaxima || !edadMinima) return;
        const fetchFilteredData = async () => {
            let escolaridadPrimariaYSecundariaFiltrada: EscolaridadPrimariaYSecundaria | null = null;
            if (datosParaConsulta.comunidadesId[0] === 'Todas' && datosParaConsulta.territoriosId[0] === 'Todos') {
                escolaridadPrimariaYSecundariaFiltrada = await buscarPorTodasComunidadesEnTodosTerritorios(
                    datosParaConsulta,
                    modo,
                    { edadMinima: edadMinima, edadMaxima: edadMaxima },
                    opcionEscolaridad);
            } else if (datosParaConsulta.comunidadesId[0] === 'Todas') {
                escolaridadPrimariaYSecundariaFiltrada = await buscarPorTodasComunidadesEnTerritorios(
                    datosParaConsulta,
                    modo,
                    { edadMinima: edadMinima, edadMaxima: edadMaxima },
                    opcionEscolaridad);
            } else if (datosParaConsulta.comunidadesId[0] !== 'Todas' && datosParaConsulta.comunidadesId.length > 0) {
                escolaridadPrimariaYSecundariaFiltrada = await buscarPorComunidadesEnTerritorios(
                    datosParaConsulta,
                    modo,
                    { edadMinima: edadMinima, edadMaxima: edadMaxima },
                    opcionEscolaridad);
            }
            setEscolaridadFiltrada(escolaridadPrimariaYSecundariaFiltrada);
        };
        fetchFilteredData();
    }, [sliderValue]);

    if (datosCulturalesInvalidos(datosEducacionales)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
        </div>;
    }

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setSliderValue(newValue as number[]);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpcionEscolaridad((event.target as HTMLInputElement).value);
    };

    const calculatePercentage = (data: EscolaridadPrimariaYSecundaria | null) => {
        if (!data) return;
        console.log("~~~~~~~~~~~~~~~~~", data);
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

    const percentages = calculatePercentage(escolaridadFiltrada || datosEducacionales.escolaridadPrimariaYSecundaria);

    return (
        <>
            <CajaTitulo>Mapa de Escolarización Primaria y Secundaria</CajaTitulo>
            <FormControl component="fieldset">
                <FormLabel component="legend">Seleccione Escolaridad</FormLabel>
                <RadioGroup row aria-label="escolaridad" name="escolaridad" value={opcionEscolaridad} onChange={handleRadioChange}>
                    <FormControlLabel value="Primaria" control={<Radio />} label="Primaria" />
                    <FormControlLabel value="Secundaria" control={<Radio />} label="Secundaria" />
                </RadioGroup>
            </FormControl>
            <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a style={{ textAlign: 'left' }}>{sliderValue.at(0)}</a>
                <a style={{ textAlign: 'right' }}>{sliderValue.at(1)}</a>
            </div>
            <div style={{ width: '80%' }}>
                <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={opcionEscolaridad === 'Primaria' ? 5 : 14}
                    max={opcionEscolaridad === 'Primaria' ? 13 : 20}
                />
            </div>
            <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%' }}>
                <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
                <TileLayer
                    url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                    attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
                />
                {queEstoyViendo.territoriosGeoJson && (
                    <GeoJSON data={queEstoyViendo.territoriosGeoJson as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJsonProperties>} style={estiloTerritorio} />
                )}
                {queEstoyViendo.comunidadesGeoJson && (
                    <>
                        {queEstoyViendo.comunidadesGeoJson.features.map((comunidad, index) => {
                            const centroide = turf.centroid(comunidad).geometry.coordinates;
                            const id = comunidad.properties?.id;
                            const datos = escolaridadFiltrada?.rows.filter(row => row.comunidadId === id).reduce((acc, row) => {
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
                                    {zoomNivel >= 12 && crearMarcadorNombre(comunidad.properties?.nombre) && (
                                        <Marker
                                            position={[centroide[1], centroide[0] - centroide[0] * 0.001 / zoomNivel]}
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
            <CajaTitulo>Escolaridad Joven</CajaTitulo>
            <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridadJoven)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
            <CajaTitulo>Escolaridad General</CajaTitulo>
            <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridad)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
            <CajaTitulo>Infraestructura</CajaTitulo>
            <MapaInfraestructura datos={datosEducacionales} modo={modo} />
            <QueEstoyViendo
                comunidades={queEstoyViendo.comunidadesGeoJson}
                territorios={queEstoyViendo.territoriosGeoJson}
            />
        </>
    );
};

export default ComponenteCulturalComunidadesEnTerritorios;

const datosCulturalesInvalidos = (datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados) => {
    return !datosEducacionales.escolaridadPrimariaYSecundaria ||
        !datosEducacionales.comunidadesGeoJson ||
        !datosEducacionales.escolaridad ||
        !datosEducacionales.escolaridadJoven ||
        !datosEducacionales.territoriosGeoJson;
};

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
};

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
