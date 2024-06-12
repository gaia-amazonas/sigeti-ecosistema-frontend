// src/components/graficos/general/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { stringPostGISAGeoJson } from 'transformadores/stringPostGISAGeoJson';
import { Feature, FeatureCollection, Point, Geometry } from 'geojson';

import {
  estiloTerritorio,
} from 'components/consultaConMapa/estilos';

import markerIconPng from 'iconos/marker-icon.png';
import markerShadowPng from 'iconos/marker-shadow.png';


const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaMapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Marcador = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const VentanaEmergente = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapaImp {
    territoriosGeoJson: FeatureCollection;
    comunidadesGeometries: any[];
}

const Mapa: React.FC<MapaImp> = ({ territoriosGeoJson, comunidadesGeometries }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        (async () => {
            const Leaflet = await import('leaflet');
            Leaflet.Icon.Default.mergeOptions({
                iconUrl:  markerIconPng.src,
                shadowUrl: markerShadowPng.src,
            });
        })();
    }, []);

    if (!isClient) {
        return <div>Cargando el mapa...</div>;
    }

    const comunidadesGeoJson: FeatureCollection<Geometry> = {
        type: 'FeatureCollection',
        features: comunidadesGeometries.map(stringPostGISAGeoJson).filter(Boolean),
    };

    const centroMapa = [0.969793, -70.830454];

    return (
        <Contenedor center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%' }}>
            <CapaMapaOSM
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <TerritoriosGeoJson data={territoriosGeoJson} style={estiloTerritorio} />
            {comunidadesGeoJson.features.map((feature, idx) => {
                const pointFeature = feature as Feature<Point>;
                const { coordinates } = pointFeature.geometry;
                return (
                    <Marcador key={idx} position={[coordinates[1], coordinates[0]]}>
                        <VentanaEmergente>
                            <span>Coordinates: {coordinates}</span>
                        </VentanaEmergente>
                    </Marcador>
                );
            })}
        </Contenedor>
    );
};

export default Mapa;
