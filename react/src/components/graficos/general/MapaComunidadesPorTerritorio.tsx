// src/components/graficos/general/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { stringPostGISAGeoJson } from 'transformadores/stringPostGISAGeoJson';
import { Feature, FeatureCollection, Point, Geometry } from 'geojson';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapComponentImp {
    territoriosGeometry: any[];
    comunidadesGeometries: any[];
}

const MapComponent: React.FC<MapComponentImp> = ({ territoriosGeometry, comunidadesGeometries }) => {
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

    const centroMapa = [-1.86, -71.62];

    return (
        <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={8} style={{ height: '30rem', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {territorioGeoJson.features.map((feature, idx) => (
                <GeoJSON key={idx} data={feature} style={{ color: 'blue' }} />
            ))}
            {comunidadesGeoJson.features.map((feature, idx) => {
                if (feature.geometry.type === 'Point') {
                    const pointFeature = feature as Feature<Point>;
                    const { coordinates } = pointFeature.geometry;
                    return (
                        <Marker key={idx} position={[coordinates[1], coordinates[0]]}>
                            <Popup>
                                <span>Coordinates: {coordinates}</span>
                            </Popup>
                        </Marker>
                    );
                } else {
                    return <GeoJSON key={idx} data={feature} style={{ color: 'red' }} />;
                }
            })}
        </MapContainer>
    );
};

export default MapComponent;
