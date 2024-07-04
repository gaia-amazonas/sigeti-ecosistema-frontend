import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import Comunidades from '../../Comunidades';
import IconosPorComunidad from './IconosPorComunidad';
import logger from 'utilidades/logger';
import isClient from 'utilidades/isClient';
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet';
import DatosConsultados from 'tipos/educacional/datosConsultados';
import { traeInfraestructuraEducacionalPorComunidad } from 'buscadores/paraMapa';

interface MapaImp {
    datos: DatosConsultados;
    modo: string | string[];
}

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    useMapEvents({
        zoomend: (e: { target: { getZoom: () => number; }; }) => {
        setZoomLevel(e.target.getZoom());
        }
    });
    return null;
};

const Mapa: React.FC<MapaImp> = ({ datos, modo }) => {

    const [infraestructuraEducacionalPorComunidad, establecerInfraestructuraEducacionalPorComunidad] = useState<{ [id: string]: { tipo: string, conteo: number } }>({});
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

                // Create a map to track existing tipos for each comunidadId
                const comunidadTiposMap = new Map<string, Set<string>>();

                // Populate the map with existing tipos
                comunidades.forEach((comunidad: { conteo: number, tipo: string, comunidadId: string }) => {
                    if (!comunidadTiposMap.has(comunidad.comunidadId)) {
                        comunidadTiposMap.set(comunidad.comunidadId, new Set());
                    }
                    comunidadTiposMap.get(comunidad.comunidadId)?.add(comunidad.tipo);
                });

                // Create a new array to avoid mutating the original array during iteration
                const comunidadesConTipos = [...comunidades];

                // Add missing tipos with conteo as 0
                comunidadesId.forEach(comunidadId => {
                    TIPOS.forEach(tipo => {
                        if (!comunidadTiposMap.get(comunidadId)?.has(tipo)) {
                            comunidadesConTipos.push({ conteo: 0, tipo, comunidadId });
                        }
                    });
                });

                // Update state with the new data
                const newInfraestructura = comunidadesConTipos.reduce((acc, comunidad) => {
                    const { comunidadId, tipo, conteo } = comunidad;
                    if (!acc[comunidadId]) {
                        acc[comunidadId] = {};
                    }
                    acc[comunidadId][tipo] = { tipo, conteo };
                    return acc;
                }, {});

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

    useEffect(() => {
        console.log(infraestructuraEducacionalPorComunidad, "····················");
    }, [infraestructuraEducacionalPorComunidad])

    const crearMarcadorNombre = (nombre: string) => {
        if (!isClient) return null;
        const leaflet = require('leaflet');
        return leaflet.divIcon({
        html: `<div style="z-index: 10; font-size: 1rem; font-weight: bold; color: black; background: white; margin-left: 0rem; margin-right: 0; border-radius: 1rem; padding-left: 1rem; padding-right: 5rem">${nombre}</div>`,
        iconSize: [nombre.length * 6, 20],
        iconAnchor: [nombre.length * 3, 10],
        className: ''
        });
    };

    const centroMapa = [0.969793, -70.830454];
    return (
        <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
            <TileLayer
                url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            {datos.territoriosGeoJson && (
                <GeoJSON data={datos.territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {datos.comunidadesGeoJson && datos.comunidadesGeoJson.features.map((comunidad, index) => {
                const centroide = turf.centroid(comunidad).geometry.coordinates;
                const id = comunidad.properties?.id;
                const datos = infraestructuraEducacionalPorComunidad[id];
                console.log("DATOS y COMUNIDAD", comunidad, datos);
                const estaCargando = cargando[id];
                const nombre = comunidad.properties?.nombre || '';

                return (
                <React.Fragment key={index}>
                    <Marker
                        position={[centroide[1], centroide[0] - centroide[0] * 0.00015]}
                        icon={crearMarcadorNombre(nombre)}
                    />
                </React.Fragment>
                );
            })}
        </MapContainer>
    );
};

export default Mapa;
