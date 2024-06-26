// src/components/graficos/general/MapaComunidadesPorTerritorio.tsx

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import { estiloTerritorio } from 'estilosParaMapas/paraMapas';

import { traeInformacionComunidad } from 'buscadores/paraMapa';

import Comunidades from '../../Comunidades';
import { SexoComunidad } from 'components/consultaConMapa/tipos';
import MarcadorConSexosPorComunidadGraficoTorta from './sexosPorComunidadGraficoTorta/MarcadorConSexosPorComunidadGraficoTorta';
import { Marker, useMapEvents, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

interface MapaImp {
    territoriosGeoJson: FeatureCollection;
    comunidadesGeoJson: FeatureCollection;
    modo: string | string[];
}

const MapEventsHandler = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target.getZoom());
        }
    });
    return null;
};

const Mapa: React.FC<MapaImp> = ({ territoriosGeoJson, comunidadesGeoJson, modo }) => {
    const centroMapa = [0.969793, -70.830454];
    const [sexosPorComunidad, establecerSexosPorComunidad] = useState<{ [id: string]: { hombres: number, mujeres: number } }>({});
    const [cargando, establecerCargando] = useState<{ [id: string]: boolean }>({});
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);

    useEffect(() => {
        const buscarSexosPorComunidad = async () => {
            comunidadesGeoJson.features.forEach(async comunidad => {
                const id = comunidad.properties?.id;
                if (id) {
                    establecerCargando(previo => ({ ...previo, [id]: true }));
                    const informacion = await traeInformacionComunidad(id, 'online');
                    const hombres = informacion.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Hombre')?.f0_ || 0;
                    const mujeres = informacion.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Mujer')?.f0_ || 0;
                    establecerSexosPorComunidad(prev => ({ ...prev, [id]: { hombres, mujeres } }));
                    establecerCargando(previo => ({ ...previo, [id]: false }));
                }
            });
        };
        buscarSexosPorComunidad();
    }, [comunidadesGeoJson]);

    const crearMarcadorNombre = (nombre: string) => {
        const leaflet = require('leaflet');
        return leaflet.divIcon({
            html: `<div style="z-index: 10; font-size: 1rem; font-weight: bold; color: black; background: white; margin-left: 0rem; margin-right: 0; border-radius: 1rem; padding-left: 1rem; padding-right: 5rem">${nombre}</div>`,
            iconSize: [nombre.length * 6, 20],
            iconAnchor: [nombre.length * 3, 10],
            className: ''
        });
    };

    return (
        <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
            <MapEventsHandler setZoomLevel={establecerZoomNivel} />
            <TileLayer
                url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            {territoriosGeoJson && (
                <GeoJSON data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {comunidadesGeoJson && (
                <>
                    <Comunidades comunidadesGeoJson={comunidadesGeoJson} />
                    {comunidadesGeoJson.features.map((comunidad, index) => {
                        const centroide = turf.centroid(comunidad).geometry.coordinates;
                        const id = comunidad.properties?.id;
                        const datos = sexosPorComunidad[id] || { hombres: 0, mujeres: 0 };
                        const estaCargando = cargando[id];
                        const nombre = comunidad.properties?.nombre || '';

                        return (
                            <React.Fragment key={index}>
                                <MarcadorConSexosPorComunidadGraficoTorta
                                    posicion={[centroide[1], centroide[0]]}
                                    datos={datos}
                                    estaCargando={estaCargando}
                                />
                                {zoomNivel >= 13 && ( 
                                    <Marker
                                        position={[centroide[1], centroide[0] - centroide[0] * 0.00015]}
                                        icon={crearMarcadorNombre(nombre)}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </>
            )}
        </MapContainer>
    );
};

export default Mapa;
