// src/components/consultaConAlfanumericos/educacional/IconosPorComunidad.tsx

import { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import estilos from 'estilosParaMapas/ParaMapas.module.css';

const IconosConInfraestructuraEducacional: React.FC<{ posicion: [number, number], datos: { malocas: number, educativas: number, deSalud: number }, estaCargando: boolean }> = ({ posicion, datos, estaCargando }) => {
    const mapa = useMap();
    const [posicionDePixel, establecerPosicionDePixel] = useState<[number, number] | null>(null);
    const [nivelDeZoom, establecerNivelDeZoom] = useState(mapa.getZoom());

    const actualizaPosicionDePixel = () => {
        if (mapa) {
            const punto = mapa.latLngToContainerPoint(posicion);
            establecerPosicionDePixel([punto.x, punto.y]);
        }
    };

    useMapEvents({
        move: () => {
            actualizaPosicionDePixel();
        },
        zoom: () => {
            establecerNivelDeZoom(mapa.getZoom());
            actualizaPosicionDePixel();
        }
    });

    useEffect(() => {
        actualizaPosicionDePixel();
    }, [mapa, posicion]);

    if (!posicionDePixel || nivelDeZoom <= 9) return null;

    return (
        <div
            style={{
                position: 'absolute',
                width: `${nivelDeZoom / 2}rem`,
                left: `${posicionDePixel[0] - 4 * nivelDeZoom}px`,
                top: `${posicionDePixel[1] - 6 * nivelDeZoom}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 400,
            }}
        >datos</div>
    );
};

export default IconosConInfraestructuraEducacional;
