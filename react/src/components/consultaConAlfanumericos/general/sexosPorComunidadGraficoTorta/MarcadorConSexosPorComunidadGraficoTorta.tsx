import { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

import SexosPorComunidadGraficoTorta from './SexosPorComunidadGraficoTorta';


const MarcadorConSexosPorComunidadGraficoTorta: React.FC<{ posicion: [number, number], datos: { hombres: number, mujeres: number } }> = ({ posicion, datos }) => {
    const mapa = useMap();
    const [positionPixel, setPositionPixel] = useState<[number, number] | null>(null);
    const [zoomLevel, setZoomLevel] = useState(mapa.getZoom());

    const  actualizaPosicionDePixel = () => {
        if (mapa) {
            const punto = mapa.latLngToContainerPoint(posicion);
            setPositionPixel([punto.x, punto.y]);
        }
    };

    useMapEvents({
        move: () => {
             actualizaPosicionDePixel();
        },
        zoom: () => {
            setZoomLevel(mapa.getZoom());
             actualizaPosicionDePixel();
        }
    });

    useEffect(() => {
         actualizaPosicionDePixel();
    }, [mapa, posicion]);

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
            <SexosPorComunidadGraficoTorta hombres={datos.hombres} mujeres={datos.mujeres} />
        </div>
    );
};

export default MarcadorConSexosPorComunidadGraficoTorta;