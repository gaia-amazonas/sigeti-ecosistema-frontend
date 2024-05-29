// src/components/graficos/general/MapaComunidadesPorTerritorio.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { stringPostGISAGeoJson } from 'transformadores/stringPostGISAGeoJson';
import { Feature, FeatureCollection, Point, Geometry } from 'geojson';

import markerIconPng from 'iconos/marker-icon.png';
import markerShadowPng from 'iconos/marker-shadow.png';

// Dynamically import react-leaflet components with SSR disabled
const ContenedorMapaComunidadesPorTerritorio = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaMapaComunidadesPorTerritorioOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Marcador = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const VentanaEmergente = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapaComunidadesPorTerritorioImp {
    territoriosGeometry: any[];
    comunidadesGeometries: any[];
}

const MapaComunidadesPorTerritorio: React.FC<MapaComunidadesPorTerritorioImp> = ({ territoriosGeometry, comunidadesGeometries }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        (async () => {
            const Leaflet = await import('leaflet');
            Leaflet.Icon.Default.mergeOptions({
                iconUrl: markerIconPng.src,
                shadowUrl: markerShadowPng.src,
            });
        })();
    }, []);

    if (!isClient) {
        return <div>Cargando el mapa...</div>;
    }

    const territorioGeoJson: FeatureCollection<Geometry> = {
        type: 'FeatureCollection',
        features: territoriosGeometry.map(stringPostGISAGeoJson).filter(Boolean),
    };

    const comunidadesGeoJson: FeatureCollection<Geometry> = {
        type: 'FeatureCollection',
        features: comunidadesGeometries.map(stringPostGISAGeoJson).filter(Boolean),
    };

    const centroMapaComunidadesPorTerritorio = [0.969793, -70.830454];

    return (
        <ContenedorMapaComunidadesPorTerritorio center={centroMapaComunidadesPorTerritorio} zoom={6} style={{ height: '30rem', width: '100%' }}>
            <CapaMapaComunidadesPorTerritorioOSM
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {territorioGeoJson.features.map((feature, idx) => (
                <GeoJson key={idx} data={feature} style={{ color: 'blue' }} />
            ))}
            {comunidadesGeoJson.features.map((feature, idx) => {
                if (feature.geometry.type === 'Point') {
                    const pointFeature = feature as Feature<Point>;
                    const { coordinates } = pointFeature.geometry;
                    return (
                        <Marcador key={idx} position={[coordinates[1], coordinates[0]]}>
                            <VentanaEmergente>
                                <span>Coordinates: {coordinates}</span>
                            </VentanaEmergente>
                        </Marcador>
                    );
                } else {
                    return <GeoJson key={idx} data={feature} style={{ color: 'red' }} />;
                }
            })}
        </ContenedorMapaComunidadesPorTerritorio>
    );
};

export default MapaComunidadesPorTerritorio;
