// src/components/consultaConAlfanumericos/general/sexosPorComunidadGraficoTorta/MarcadorConSexosPorComunidadGraficoTorta.tsx

import { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import estilos from 'estilosParaMapas/ParaMapas.module.css';

import SexosPorComunidadGraficoTorta from './SexosPorComunidadGraficoTorta';

const MarcadorConSexosPorComunidadGraficoTorta: React.FC<{ posicion: [number, number], datos: { hombres: number, mujeres: number }, estaCargando: boolean }> = ({ posicion, datos, estaCargando }) => {
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
                zIndex: 2000,
            }}
        >
            {estaCargando ? (
                <div className={estilos.spinnerMinimalista}></div>
            ) : (
                <SexosPorComunidadGraficoTorta hombres={datos.hombres} mujeres={datos.mujeres} />
            )}
        </div>
    );
};

export default MarcadorConSexosPorComunidadGraficoTorta;
