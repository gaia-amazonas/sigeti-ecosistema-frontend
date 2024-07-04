import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import Comunidades from '../../Comunidades';
import logger from 'utilidades/logger';
import isClient from 'utilidades/isClient';
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet';
import DatosConsultados from 'tipos/educacional/datosConsultados';
import { traeInfraestructuraEducacionalPorComunidad } from 'buscadores/paraMapa';
import MalocasIcon from 'logos/Maloca_Redonda_001.png';
import EducativaIcon from 'logos/Educacion_001.png';
import SaludIcon from 'logos/Salud_001.png';

interface Infraestructura {
    tipo: string;
    conteo: number;
}

interface InfraestructuraPorComunidad {
    Malocas: Infraestructura;
    Educativa: Infraestructura;
    Salud: Infraestructura;
}

interface MapaImp {
    datos: DatosConsultados;
    modo: string | string[];
}

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target.getZoom());
        }
    });
    return null;
};

const CustomMarker = ({ position, icon, count }: { position: [number, number], icon: string, count: number }) => {
    const leaflet = require('leaflet');
    const customIcon = leaflet.divIcon({
        html: `<div style="position: relative;">
                <img src="${icon}" style="width: 5rem; height: 5rem;" />
                <span style="position: absolute; top: 0px; right: -5px; background-color: white; border-radius: 50%; padding: 2px; font-size: 10px; font-weight: bold; color: black;">
                    ${count}
                </span>
            </div>`,
        iconSize: [20, 20],
        className: ''
    });
    return <Marker position={position} icon={customIcon} />;
};

const Mapa: React.FC<MapaImp> = ({ datos, modo }) => {
    const [infraestructuraEducacionalPorComunidad, establecerInfraestructuraEducacionalPorComunidad] = useState<{ [id: string]: InfraestructuraPorComunidad }>({});
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const centroMapa = [0.969793, -70.830454];
    const [cargando, establecerCargando] = useState<{ [id: string]: boolean }>({});

    useEffect(() => {
        const comunidadesId: string[] = datos.comunidadesGeoJson?.features
            .map((comunidad) => comunidad.properties?.id)
            .filter((id): id is string => typeof id === 'string') || [];

        const fetchInfraestructuraEducacionalPorComunidad = async () => {
            try {
                const infraestructura = await traeInfraestructuraEducacionalPorComunidad(comunidadesId, modo);
                const comunidades = infraestructura.rows;
                const TIPOS = ['Malocas', 'Educativa', 'Salud'];

                const comunidadTiposMap = new Map<string, Set<string>>();

                comunidades.forEach((comunidad: { conteo: number, tipo: string, comunidadId: string }) => {
                    if (!comunidadTiposMap.has(comunidad.comunidadId)) {
                        comunidadTiposMap.set(comunidad.comunidadId, new Set());
                    }
                    comunidadTiposMap.get(comunidad.comunidadId)?.add(comunidad.tipo);
                });

                const comunidadesConTipos = [...comunidades];

                comunidadesId.forEach(comunidadId => {
                    TIPOS.forEach(tipo => {
                        if (!comunidadTiposMap.get(comunidadId)?.has(tipo)) {
                            comunidadesConTipos.push({ conteo: 0, tipo, comunidadId });
                        }
                    });
                });

                const newInfraestructura = comunidadesConTipos.reduce((acc, comunidad) => {
                    const { comunidadId, tipo, conteo } = comunidad;
                    if (!acc[comunidadId]) {
                        acc[comunidadId] = {
                            Malocas: { tipo: 'Malocas', conteo: 0 },
                            Educativa: { tipo: 'Educativa', conteo: 0 },
                            Salud: { tipo: 'Salud', conteo: 0 },
                        };
                    }
                    acc[comunidadId][tipo] = { tipo, conteo };
                    return acc;
                }, {} as { [id: string]: InfraestructuraPorComunidad });

                establecerInfraestructuraEducacionalPorComunidad(newInfraestructura);
                establecerCargando(previo => {
                    const newCargando = { ...previo };
                    comunidadesId.forEach(id => {
                        newCargando[id] = false;
                    });
                    return newCargando;
                });
            } catch (error) {
                logger.error('Error buscando infraestructura educacional por comunidad:', error);
            }
        };

        fetchInfraestructuraEducacionalPorComunidad();
    }, [datos.comunidadesGeoJson, modo]);

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

    const getOffsetPosition = (coordinates: [number, number], offsetX: number, offsetY: number): [number, number] => {
        const scaleFactor = Math.pow(2, zoomNivel - 6);
        return [coordinates[0] + offsetY / scaleFactor, coordinates[1] + offsetX / scaleFactor];
    };

    const calculateOffset = (zoom: number, factor: number) => {
        return factor * (15 / zoom);
    };

    return (
        <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={zoomNivel} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
            <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
            <TileLayer
                url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            {datos.territoriosGeoJson && (
                <GeoJSON data={datos.territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {datos.comunidadesGeoJson && (
                <>
                    <Comunidades comunidadesGeoJson={datos.comunidadesGeoJson} />
                    {
                        datos.comunidadesGeoJson.features.map((comunidad, index) => {
                            const centroide = turf.centroid(comunidad).geometry.coordinates;
                            const id = comunidad.properties?.id;
                            const nombre = comunidad.properties?.nombre || '';
                            const comunidadDatos = infraestructuraEducacionalPorComunidad[id] || { Malocas: { tipo: 'Malocas', conteo: 0 }, Educativa: { tipo: 'Educativa', conteo: 0 }, Salud: { tipo: 'Salud', conteo: 0 } };
                            const { Malocas, Educativa, Salud } = comunidadDatos;
                            return (
                                <React.Fragment key={index}>
                                    {
                                        zoomNivel >= 13 && crearMarcadorNombre(nombre) && (
                                            <Marker
                                                position={[centroide[1], centroide[0] - calculateOffset(zoomNivel, -0.01)]}
                                                icon={crearMarcadorNombre(nombre)}
                                            />
                                        )
                                    }
                                    {zoomNivel >= 10 && (
                                        <>
                                            <CustomMarker position={getOffsetPosition([centroide[1], centroide[0]], -2, 1)} icon={MalocasIcon.src} count={Malocas.conteo} />
                                            <CustomMarker position={getOffsetPosition([centroide[1], centroide[0]], -4, 1)} icon={EducativaIcon.src} count={Educativa.conteo} />
                                            <CustomMarker position={getOffsetPosition([centroide[1], centroide[0]], -6, 1)} icon={SaludIcon.src} count={Salud.conteo} />
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })
                    }
                </>
            )}
        </MapContainer>
    );
};

export default Mapa;