// src/components/graficos/general/MapaComunidadesPorTerritorio.tsx

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import estilos from 'components/consultaConMapa/Mapa.module.css';

import { traeInformacionComunidad } from 'buscadores/paraMapa';

import Comunidades from '../../Comunidades';
import { SexoComunidad } from 'components/consultaConMapa/tipos';
import MarcadorConSexosPorComunidadGraficoTorta from './sexosPorComunidadGraficoTorta/MarcadorConSexosPorComunidadGraficoTorta';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaMapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface MapaImp {
    territoriosGeoJson: FeatureCollection;
    comunidadesGeoJson: FeatureCollection;
    modo: string | string[];
}

const Mapa: React.FC<MapaImp> = ({ territoriosGeoJson, comunidadesGeoJson, modo }) => {
    const centroMapa = [0.969793, -70.830454];
    const [sexosPorComunidad, establecerSexosPorComunidad] = useState<{ [id: string]: { hombres: number, mujeres: number } }>({});
    const [cargando, establecerCargando] = useState<{ [id: string]: boolean }>({});

    useEffect(() => {
        const buscarSexosPorComunidad = async () => {
            comunidadesGeoJson.features.forEach(async comunidad => {
                const id = comunidad.properties?.id;
                if (id) {
                    establecerCargando(prev => ({ ...prev, [id]: true }));
                    const info = await traeInformacionComunidad(id, 'online');
                    const hombres = info.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Hombre')?.f0_ || 0;
                    const mujeres = info.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Mujer')?.f0_ || 0;
                    establecerSexosPorComunidad(prev => ({ ...prev, [id]: { hombres, mujeres } }));
                    establecerCargando(prev => ({ ...prev, [id]: false }));
                }
            });
        };
        buscarSexosPorComunidad();
    }, [comunidadesGeoJson]);

    return (
        <Contenedor center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
            <CapaMapaOSM
                url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            {territoriosGeoJson && (
                <TerritoriosGeoJson data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {comunidadesGeoJson && (
                <>
                    <Comunidades comunidadesGeoJson={comunidadesGeoJson} />
                    {comunidadesGeoJson.features.map((comunidad, index) => {
                        const centroide = turf.centroid(comunidad).geometry.coordinates;
                        const id = comunidad.properties?.id;
                        const datos = sexosPorComunidad[id] || { hombres: 0, mujeres: 0 };
                        const isCargando = cargando[id];

                        return (
                            <MarcadorConSexosPorComunidadGraficoTorta
                                key={index}
                                posicion={[centroide[1], centroide[0]]}
                                datos={datos}
                                isCargando={isCargando}
                            />
                        );
                    })}
                </>
            )}
        </Contenedor>
    );
};

export default Mapa;