// src/components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades.tsx

import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import bbox from '@turf/bbox';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import logger from 'utilidades/logger';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import DatosConsultados from 'tipos/educacional/datosConsultados';
import { traeInfraestructuraEducacionalPorComunidad } from 'buscadores/paraMapa';
import CustomCircleMarker from '../general/CustomCircleMarker';
import MalocasIcon from 'logos/Maloca_Redonda_001.png';
import EducativaIcon from 'logos/Educacion_001.png';
import SaludIcon from 'logos/Salud_001.png';

import Image from 'next/image';
import L from 'leaflet';

interface InfraestructuraPorComunidad {
    Malocas: number;
    Educativa: number;
    Salud: number;
}

interface MapaImp {
    datos: DatosConsultados;
    modo: string | string[];
}

interface TipoInfraestructuraEnComunidad {
    comunidadId: string;
    tipo: string;
    conteo: number;
}

interface TipoInfraestructuraEnComunidades {
    rows: TipoInfraestructuraEnComunidad[];
}

const TIPOS = ['Malocas', 'Educativa', 'Salud'];

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

const LegendIcons = () => {
    return (
        <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <Image src={MalocasIcon.src} alt="Malocas Icon" width={24} height={24} style={{ marginRight: '5px' }} />
                <span>Malocas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <Image src={EducativaIcon.src} alt="Educativa Icon" width={24} height={24} style={{ marginRight: '5px' }} />
                <span>Educativa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={SaludIcon.src} alt="Salud Icon" width={24} height={24} style={{ marginRight: '5px' }} />
                <span>Salud</span>
            </div>
        </div>
    );
};

const LegendColorGradient = ({ min, max }: { min: number; max: number }) => {
    const map = useMap();

    useEffect(() => {
        const legend = new L.Control({ position: 'bottomright' });
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = `
                <h4>Total de Construcciones</br>para la educación</h4>
                <div style="background: linear-gradient(to right, rgb(255, 255, 0), rgb(255, 0, 0)); width: 100px; height: 20px; border-radius: 5px;"></div>
                <div style="display: flex; justify-content: space-between;">
                    <span>${min}</span><span>${max}</span>
                </div>
                <div>
                    <i style="background: rgb(255, 255, 0); width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>Baja
                    <br>
                    <i style="background: rgb(255, 0, 0); width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>Alta
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

const Mapa: React.FC<MapaImp> = ({ datos, modo }) => {
    const [infraestructuraEducacionalPorComunidad, establecerInfraestructuraEducacionalPorComunidad] = useState<{ [id: string]: InfraestructuraPorComunidad }>({});
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const centroMapa = [0.969793, -70.830454];
    const [infraestructuraCruda, establecerInfraestructuraCruda] = useState<TipoInfraestructuraEnComunidades>();
    const [comunidadesId, establecerComunidadesId] = useState<string[]>();
    const [cargando, establecerCargando] = useState<{ [id: string]: boolean }>({});
    const [popupInfo, setPopupInfo] = useState<{ position: [number, number], comunidadDatos: InfraestructuraPorComunidad } | null>(null);

    useEffect(() => {
        establecerComunidadesId(datos.comunidadesGeoJson?.features
        .map((comunidad) => comunidad.properties?.id)
        .filter((id): id is string => typeof id === 'string') || []);
    }, [datos]);

    useEffect(() => {
        if (!comunidadesId) return;
        const buscarInfraestructuraEducacionalPorComunidad = async () => {
            try {
                establecerInfraestructuraCruda(await traeInfraestructuraEducacionalPorComunidad(comunidadesId, modo));
            } catch (error) {
                logger.error('Error buscando infraestructura educacional por comunidad:', error);
            }
        };
        buscarInfraestructuraEducacionalPorComunidad();
    }, [comunidadesId, modo]);

    useEffect(() => {
        if (!infraestructuraCruda || !comunidadesId) return;
        const infraestructuraEnComunidades = infraestructuraCruda.rows;
        const tiposInfraestructuraPorComunidades = defineTiposDeInfraestructuraPorComunidades(infraestructuraEnComunidades);
        defineInfraestructuraMinimaSinUnTipoPorComunidad(comunidadesId, tiposInfraestructuraPorComunidades, infraestructuraEnComunidades);
        const infraestructuraMinima = defineInfraestructuraMinimaSiNingunTipoPorComunidad(infraestructuraEnComunidades);
        establecerInfraestructuraEducacionalPorComunidad(infraestructuraMinima);
        establecerCargando(previo => {
            const nuevoCargando = { ...previo };
            comunidadesId.forEach(id => {
                nuevoCargando[id] = false;
            });
            return nuevoCargando;
        });
    }, [infraestructuraCruda]);

    const totalPopulations = datos.comunidadesGeoJson?.features.map(comunidad => {
        const id = comunidad.properties?.id;
        const datos = infraestructuraEducacionalPorComunidad[id] || { Malocas: 0, Educativa: 0, Salud: 0 };
        return datos.Malocas + datos.Educativa + datos.Salud;
    });
    const minPopulation = totalPopulations ? Math.min(...totalPopulations) : 0;
    const maxPopulation = totalPopulations ? Math.max(...totalPopulations) : 0;

    const getColor = (value: number, min: number, max: number): string => {
        const normalizedValue = (Math.log(value + 1) - Math.log(min + 1)) / (Math.log(max + 1) - Math.log(min + 1));
        const red = 255;
        const green = 255 * (1 - normalizedValue);
        const blue = 0;
        return `rgb(${red}, ${green}, ${blue})`;
    };

    const handleMarkerClick = (position: [number, number], comunidadDatos: InfraestructuraPorComunidad) => {
        setPopupInfo({ position, comunidadDatos });
    };

    return (
        <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={zoomNivel} style={{ height: '30rem', width: '100%', zIndex: 1, borderRadius: '3rem' }}>
            <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
                { datos.territoriosGeoJson && <AdjustMapBounds territoriosGeoJson={datos.territoriosGeoJson} /> }
            <TileLayer
                url={modo === "online" ? "https://api.maptiler.com/maps/210f299d-7ee0-44b4-8a97-9c581923af6d/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            {datos.territoriosGeoJson && (
                <GeoJSON data={datos.territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {datos.comunidadesGeoJson && (
                <>
                    {datos.comunidadesGeoJson.features.map((comunidad, index) => {
                        const centroide = turf.centroid(comunidad).geometry.coordinates;
                        const id = comunidad.properties?.id;
                        const comunidadDatos = infraestructuraEducacionalPorComunidad[id] || { Malocas: 0, Educativa: 0, Salud: 0 };
                        const total = comunidadDatos.Malocas + comunidadDatos.Educativa + comunidadDatos.Salud;
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
                                    onClick={() => handleMarkerClick([coordinates[0][1], coordinates[0][0]], comunidadDatos)}
                                />
                                {zoomNivel >= 15 ? (
                                    <>
                                        <MarcadorConIcono position={calculaPosicionDeDesplazada([centroide[1], centroide[0]], -2, 1, zoomNivel)} icono={MalocasIcon.src} conteo={comunidadDatos.Malocas} />
                                        <MarcadorConIcono position={calculaPosicionDeDesplazada([centroide[1], centroide[0]], -4, 1, zoomNivel)} icono={EducativaIcon.src} conteo={comunidadDatos.Educativa} />
                                        <MarcadorConIcono position={calculaPosicionDeDesplazada([centroide[1], centroide[0]], -6, 1, zoomNivel)} icono={SaludIcon.src} conteo={comunidadDatos.Salud} />
                                    </>
                                ) : (<></>
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
                    <div>
                        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Image src={MalocasIcon.src} alt="Malocas Icon" width={48} height={48} style={{ marginRight: '0.5rem' }} />
                            <span>{popupInfo.comunidadDatos.Malocas}</span>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Image src={EducativaIcon.src} alt="Educativa Icon" width={48} height={48} style={{ marginRight: '0.5rem' }} />
                            <span>{popupInfo.comunidadDatos.Educativa}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Image src={SaludIcon.src} alt="Salud Icon" width={48} height={48} style={{ marginRight: '0.5rem' }} />
                            <span>{popupInfo.comunidadDatos.Salud}</span>
                        </div>
                    </div>
                </Popup>
            )}
            <LegendIcons />
            <LegendColorGradient min={minPopulation} max={maxPopulation} />
        </MapContainer>
    );
};

export default Mapa;

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

const defineTiposDeInfraestructuraPorComunidades = (infraestructuraEnComunidades: { conteo: number; tipo: string; comunidadId: string; }[]) => {
    const tiposInfraestructuraPorComunidades = new Map<string, Set<"Educativa" | "Salud" | "Malocas">>();
    infraestructuraEnComunidades.forEach((comunidad: { conteo: number, tipo: string, comunidadId: string }) => {
        if (!tiposInfraestructuraPorComunidades.has(comunidad.comunidadId)) {
            tiposInfraestructuraPorComunidades.set(comunidad.comunidadId, new Set());
        }
        tiposInfraestructuraPorComunidades.get(comunidad.comunidadId)?.add(comunidad.tipo as "Educativa" | "Salud" | "Malocas");
    });
    return tiposInfraestructuraPorComunidades;
};

const defineInfraestructuraMinimaSinUnTipoPorComunidad = (comunidadesId: string[], tiposInfraestructuraPorComunidades: Map<string, Set<"Educativa" | "Salud" | "Malocas">> , infraestructuraEnComunidades: TipoInfraestructuraEnComunidad[]) => {
    comunidadesId.forEach((comunidadId: string) => {
        TIPOS.forEach((tipo) => {
            if (!tiposInfraestructuraPorComunidades.get(comunidadId)?.has(tipo as "Educativa" | "Salud" | "Malocas")) {
                infraestructuraEnComunidades.push({ conteo: 0, tipo: tipo as "Educativa" | "Salud" | "Malocas", comunidadId });
            }
        });
    });
};

const defineInfraestructuraMinimaSiNingunTipoPorComunidad = (infraestructuraEnComunidades: TipoInfraestructuraEnComunidad[]): { [id: string]: InfraestructuraPorComunidad } => {
    const infraestructuraMinimaCompleta = infraestructuraEnComunidades.reduce((acc: { [id: string]: InfraestructuraPorComunidad }, infraestructuraEnComunidad: TipoInfraestructuraEnComunidad) => {
        const { comunidadId, tipo, conteo } = infraestructuraEnComunidad;
        if (!acc[comunidadId]) {
            acc[comunidadId] = {
                Malocas: 0,
                Educativa: 0,
                Salud: 0,
            };
        }
        acc[comunidadId][tipo as keyof InfraestructuraPorComunidad] = conteo;
        return acc;
    }, {} as { [id: string]: InfraestructuraPorComunidad });
    return infraestructuraMinimaCompleta;
};

const calculaPosicionDeDesplazada = (coordenadas: [number, number], offsetX: number, offsetY: number, zoomNivel: number): [number, number] => {
    const factorDeEscala = Math.pow(2, zoomNivel - 6);
    return [coordenadas[0] + offsetY / factorDeEscala, coordenadas[1] + offsetX / factorDeEscala];
};

const MarcadorConIcono = ({ position, icono, conteo }: { position: [number, number], icono: string, conteo: number }) => {
    const leaflet = require('leaflet');
    const customIcon = leaflet.divIcon({
        html: `<div style="position: relative;">
                <img src="${icono}" alt="Custom Icon" style="width: 5rem; height: 5rem;" />
                <span style="position: absolute;
                top: 0px;
                right: -5px;
                background-color: white;
                border-radius: 50%;
                padding: 2px;
                font-size: 10px;
                font-weight: bold;
                color: black;">
                    ${conteo}
                </span>
            </div>`,
        iconSize: [20, 20],
        className: ''
    });
    return <Marker position={position} icon={customIcon} />;
};
