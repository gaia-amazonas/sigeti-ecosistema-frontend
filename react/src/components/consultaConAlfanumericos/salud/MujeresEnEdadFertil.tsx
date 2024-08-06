// src/components/consultaConAlfanumericos/salud/MujeresEnEdadFertilMap.tsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import bbox from '@turf/bbox';
import CustomCircleMarker from '../general/CustomCircleMarker';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';

interface MujeresEnEdadFertilMapProps {
  mujeresEnEdadFertil: any;
  comunidadesGeoJson: FeatureCollection<Geometry, GeoJsonProperties>;
  territoriosGeoJson: FeatureCollection<Geometry, GeoJsonProperties>;
  zoomNivel: number;
  establecerZoomNivel: (zoom: number) => void;
}

const MujeresEnEdadFertilMap: React.FC<MujeresEnEdadFertilMapProps> = ({
  mujeresEnEdadFertil, comunidadesGeoJson, territoriosGeoJson, zoomNivel, establecerZoomNivel
}) => {
    if (!mujeresEnEdadFertil?.rows || mujeresEnEdadFertil?.rows.length === 0) {
        return <div><p>No cuentas con permisos necesarios para ver el mapa.</p></div>;
    }
    const getColor = (value: number, limit: number): string => {
        const red = 200;
        const green = value < limit ? 200 : Math.round(255 * (1 - (Math.log(value - limit + 1) / Math.log((100 - limit) + 1))));
        const blue = 0;
        return `rgb(${red}, ${green}, ${blue})`;
    };
    const getCoordinates = (geometry: any): number[][] => {
        if (geometry.type === 'Polygon') {
        return geometry.coordinates[0];
        } else if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates[0][0];
        } else if (geometry.type === 'Point') {
        return [geometry.coordinates];
        } else if (geometry.type === 'MultiPoint') {
        return [geometry.coordinates[0]];
        } else {
        return [];
        }
    };
    return (
        <MapContainer center={[0.969793, -70.830454]} zoom={zoomNivel} style={{ height: '600px', width: '100%', borderRadius: '3rem' }}>
        <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
        {territoriosGeoJson && (
            <AdjustMapBounds territoriosGeoJson={territoriosGeoJson} />
        )}
        <TileLayer
            url="https://api.maptiler.com/maps/210f299d-7ee0-44b4-8a97-9c581923af6d/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {territoriosGeoJson && (
            <GeoJSON data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
        )}
        {mujeresEnEdadFertil.rows.map((row: { comunidadId: any; proporcionMujeresEnEdadFertil: number; mujeresEnEdadFertil: any; }, idx: any) => {
            const community = comunidadesGeoJson?.features.find(feature => feature.properties?.id === row.comunidadId);
            if (!community) return null;
            const coordinates = getCoordinates(community.geometry);
            if (coordinates.length === 0) return null;
            return (
            <CustomCircleMarker
                key={idx}
                center={[coordinates[0][1], coordinates[0][0]]}
                baseRadius={2}  
                color={getColor(row.proporcionMujeresEnEdadFertil, 50)}
                proporcion={Math.round(row.proporcionMujeresEnEdadFertil)}
                total={row.mujeresEnEdadFertil}
                zoomNivel={zoomNivel}
            />
            );
        })}
        </MapContainer>
    );
};

export default MujeresEnEdadFertilMap;

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      }
    });
    return null;
};

const AdjustMapBounds = ({ territoriosGeoJson }: { territoriosGeoJson: FeatureCollection }) => {
    const map = useMap();

    useEffect(() => {
        if (territoriosGeoJson) {
        const bounds = bbox(territoriosGeoJson);
        map.fitBounds([
            [bounds[1], bounds[0]],
            [bounds[3], bounds[2]]
        ]);
        }
    }, [territoriosGeoJson, map]);

    return null;
};