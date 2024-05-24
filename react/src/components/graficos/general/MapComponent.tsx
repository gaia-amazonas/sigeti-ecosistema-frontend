// components/graficos/general/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { convertToGeoJSON, getPolygonCentroid } from 'components/helpers/geojsonHelper';
import L from 'leaflet';

interface MapComponentProps {
    territorioGeometry: any;
    comunidadesGeometries: any[];
}

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

const MapComponent: React.FC<MapComponentProps> = ({ territorioGeometry, comunidadesGeometries }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div>Loading map...</div>;
    }

    // Convert geometries to valid GeoJSON
    const territorioGeoJSON = convertToGeoJSON(territorioGeometry);
    const comunidadesGeoJSON = comunidadesGeometries.map(convertToGeoJSON).filter(Boolean); // Filter out null values

    // Calculate the center of the polygon for the map center
    const center = territorioGeoJSON ? getPolygonCentroid(territorioGeoJSON.geometry.coordinates) : [-1.86, -71.62];

    // Handle invalid center calculations
    const isValidCenter = center.every(coord => !isNaN(coord));
    const mapCenter = isValidCenter ? center : [4.6, -74.1];

    const createCustomMarker = () => {
        return L.divIcon({
            html: `<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>`,
            className: '',
        });
    };

    return (
        <MapContainer center={[mapCenter[0], mapCenter[1]]} zoom={8} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {territorioGeoJSON && <GeoJSON data={territorioGeoJSON} style={{ color: 'blue' }} />}
            {comunidadesGeoJSON.map((geoJSON, idx) => (
                <Marker
                    key={idx}
                    position={[geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]}
                    icon={createCustomMarker()}
                />
            ))}
        </MapContainer>
    );
};

export default MapComponent;
