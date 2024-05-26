// components/graficos/general/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { stringPostGISAGeoJSON } from 'components/transformadores/stringPostGISAGeoJson';
import { Feature, FeatureCollection, Point } from 'geojson';
import L from 'leaflet';

// Import marker icons statically
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapComponentProps {
    territorioGeometry: any;
    comunidadesGeometries: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ territorioGeometry, comunidadesGeometries }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Configure Leaflet default icon paths on client side
        L.Icon.Default.mergeOptions({
            iconUrl: markerIconPng.src,
            shadowUrl: markerShadowPng.src,
        });
    }, []);

    if (!isClient) {
        return <div>Cargando el mapa...</div>;
    }

    // Convert geometries to valid GeoJSON
    const territorioGeoJSON = {
        type: 'FeatureCollection',
        features: [stringPostGISAGeoJSON(territorioGeometry)],
    } as FeatureCollection;

    const comunidadesGeoJSON = {
        type: 'FeatureCollection',
        features: comunidadesGeometries.map(stringPostGISAGeoJSON).filter(Boolean),
    } as FeatureCollection;

    // Calculate the center of the polygon for the map center
    const centroMapa = [-1.86, -71.62];

    return (
        <MapContainer center={centroMapa} zoom={8} style={{ height: '30rem', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {territorioGeoJSON && <GeoJSON data={territorioGeoJSON} style={{ color: 'blue' }} />}
            {comunidadesGeoJSON.features.map((feature, idx) => {
                if (feature.geometry.type === 'Point') {
                    const pointFeature = feature as Feature<Point>;
                    const { coordinates } = pointFeature.geometry;
                    return (
                        <Marker key={idx} position={[coordinates[1], coordinates[0]]}>
                            <Popup>
                                <span>Coordinates: {coordinates[1]}, {coordinates[0]}</span>
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
