// src/components/graficos/general/MapaComunidadesPorTerritorio.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import logger from 'utilidades/logger';
import * as turf from '@turf/turf';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useMap, useMapEvents } from 'react-leaflet';

import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { traeInformacionComunidad } from 'buscadores/paraMapa';
import Comunidades from '../../Comunidades';
import PieChart from './PieChart';
import { SexoComunidad } from 'components/consultaConMapa/tipos';

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
    const [comunidadesData, setComunidadesData] = useState<{ [id: string]: { hombres: number, mujeres: number } }>({});

    useEffect(() => {
        const fetchData = async () => {
            const data: { [id: string]: { hombres: number, mujeres: number } } = {};
            for (const comunidad of comunidadesGeoJson.features) {
                const id = comunidad.properties?.id;
                if (id) {
                    const info = await traeInformacionComunidad(id, 'online');
                    const hombres = info.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Hombre')?.f0_ || 0;
                    const mujeres = info.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Mujer')?.f0_ || 0;
                    data[id] = { hombres, mujeres };
                }
            }
            setComunidadesData(data);
        };
        fetchData();
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
                    <Comunidades comunidadesGeoJson={comunidadesGeoJson} enCadaComunidad={enCadaComunidad} />
                    {comunidadesGeoJson.features.map((comunidad, index) => {
                        const centroide = turf.centroid(comunidad).geometry.coordinates;
                        const id = comunidad.properties?.id;
                        const data = comunidadesData[id] || { hombres: 0, mujeres: 0 };

                        return (
                            <MarkerWithPieChart
                                key={index}
                                position={[centroide[1], centroide[0]]}
                                data={data}
                            />
                        );
                    })}
                </>
            )}
        </Contenedor>
    );
};

const MarkerWithPieChart: React.FC<{ position: [number, number], data: { hombres: number, mujeres: number } }> = ({ position, data }) => {
    const map = useMap();
    const [positionPixel, setPositionPixel] = useState<[number, number] | null>(null);
    const [zoomLevel, setZoomLevel] = useState(map.getZoom());

    const updatePositionPixel = () => {
        if (map) {
            const point = map.latLngToContainerPoint(position);
            setPositionPixel([point.x, point.y]);
        }
    };

    useMapEvents({
        move: () => {
            updatePositionPixel();
        },
        zoom: () => {
            setZoomLevel(map.getZoom());
            updatePositionPixel();
        }
    });

    useEffect(() => {
        updatePositionPixel();
    }, [map, position]);

    if (!positionPixel || zoomLevel <= 9) return null;

    return (
        <div
            style={{
                position: 'absolute',
                width: `${zoomLevel / 2}rem`,
                left: `${positionPixel[0] - 4 * zoomLevel}px`,
                top: `${positionPixel[1] - 6 * zoomLevel}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2000,
            }}
        >
            <PieChart hombres={data.hombres} mujeres={data.mujeres} />
        </div>
    );
};

export default Mapa;

const enCadaComunidad = async (id: string) => {
    const graficoTortaParaSexosPorComunidad = await graficarTortaParaSexosPorComunidad(id);
    return graficoTortaParaSexosPorComunidad;
};

const graficarTortaParaSexosPorComunidad = (id: string) => {
    try {
        return intentaGraficarTortaParaSexosPorComunidad(id);
    } catch (error) {
        logger.error('Error buscando información de la comunidad:', error);
        return '<div>No hay datos para esta comunidad aún</div>';
    }
}

export const intentaGraficarTortaParaSexosPorComunidad = async (id: string) => {
    const informacion = await traeInformacionComunidad(id, 'online');
    const hombres = informacion.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Hombre')?.f0_ || 0;
    const mujeres = informacion.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Mujer')?.f0_ || 0;
    return <PieChart hombres={hombres} mujeres={mujeres} />;
};
