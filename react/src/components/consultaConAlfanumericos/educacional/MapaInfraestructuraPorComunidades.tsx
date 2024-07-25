import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import Comunidades from '../../Comunidades';
import logger from 'utilidades/logger';
import isClient from 'utilidades/isClient';
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet';
import DatosConsultados from 'tipos/educacional/datosConsultados';
import { traeInfraestructuraEducacionalPorComunidad } from 'buscadores/paraMapa';
import MalocasIcon from 'logos/Maloca_Redonda_001.png';
import EducativaIcon from 'logos/Educacion_001.png';
import SaludIcon from 'logos/Salud_001.png';


interface InfraestructuraPorComunidad {
    Malocas: number;
    Educativa: number;
    Salud: number;
}

interface MapaImp {
    datos: DatosConsultados;
    modo: string | string[];
}

interface TipoInfraestructuraEnComunidad {
    comunidadId: string;
    tipo: string;
    conteo: number;
}

interface TipoInfraestructuraEnComunidades {
    rows: TipoInfraestructuraEnComunidad[];
}

const TIPOS = ['Malocas', 'Educativa', 'Salud'];

const Mapa: React.FC<MapaImp> = ({ datos, modo }) => {
    const [infraestructuraEducacionalPorComunidad, establecerInfraestructuraEducacionalPorComunidad] = useState<{ [id: string]: InfraestructuraPorComunidad }>({});
    const [zoomNivel, establecerZoomNivel] = useState<number>(6);
    const centroMapa = [0.969793, -70.830454];
    const [infraestructuraCruda, establecerInfraestructuraCruda] = useState<TipoInfraestructuraEnComunidades>();
    const [comunidadesId, establecerComunidadesId] = useState<string[]>();
    const [cargando, establecerCargando] = useState<{ [id: string]: boolean }>({});

    useEffect(() => {
        establecerComunidadesId(datos.comunidadesGeoJson?.features
        .map((comunidad) => comunidad.properties?.id)
        .filter((id): id is string => typeof id === 'string') || []);
    }, [datos])

    useEffect(() => {
        if (!comunidadesId) return;
        const buscarInfraestructuraEducacionalPorComunidad = async () => {
            try {
                establecerInfraestructuraCruda(await traeInfraestructuraEducacionalPorComunidad(comunidadesId, modo));
            } catch (error) {
                logger.error('Error buscando infraestructura educacional por comunidad:', error);
            }
        };
        buscarInfraestructuraEducacionalPorComunidad();
    }, [comunidadesId, modo]);

    useEffect(() => {
        if (!infraestructuraCruda || !comunidadesId) return;
        const infraestructuraEnComunidades = infraestructuraCruda.rows;
        const tiposInfraestructuraPorComunidades = defineTiposDeInfraestructuraPorComunidades(infraestructuraEnComunidades);
        defineInfraestructuraMinimaSinUnTipoPorComunidad(comunidadesId, tiposInfraestructuraPorComunidades, infraestructuraEnComunidades);
        const infraestructuraMinima = defineInfraestructuraMinimaSiNingunTipoPorComunidad(infraestructuraEnComunidades);
        establecerInfraestructuraEducacionalPorComunidad(infraestructuraMinima);
        establecerCargando(previo => {
            const nuevoCargando = { ...previo };
            comunidadesId.forEach(id => {
                nuevoCargando[id] = false;
            });
            return nuevoCargando;
        });
    }, [infraestructuraCruda])

    const crearMarcadorNombre = (nombre: string) => {
        if (!isClient) return null;
        const leaflet = require('leaflet');
        return leaflet.divIcon({
            html: `<div style="z-index: 10;
                font-size: 1rem;
                font-weight: bold;
                color: black;
                background: white;
                margin-left: 0rem;
                margin-right: 0;
                border-radius: 1rem;
                padding-left: 1rem;
                padding-right: 5rem">${nombre}</div>`,
            iconSize: [nombre.length * 6, 20],
            iconAnchor: [nombre.length * 3, 10],
            className: ''
        });
    };

    return (
        <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={zoomNivel} style={{ height: '30rem', width: '100%', zIndex: 1, borderRadius: '3rem' }}>
            <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
            <TileLayer
                url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            {datos.territoriosGeoJson && (
                <GeoJSON data={datos.territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
            )}
            {datos.comunidadesGeoJson && (
                <>
                    <Comunidades comunidadesGeoJson={datos.comunidadesGeoJson} />
                    {
                        datos.comunidadesGeoJson.features.map((comunidad, index) => {
                            const centroide = turf.centroid(comunidad).geometry.coordinates;
                            const id = comunidad.properties?.id;
                            const nombre = comunidad.properties?.nombre || '';
                            const comunidadDatos = infraestructuraEducacionalPorComunidad[id] || { Malocas: 0, Educativa: 0, Salud: 0 };
                            const { Malocas, Educativa, Salud } = comunidadDatos;
                            return (
                                <React.Fragment key={index}>
                                    {
                                        zoomNivel >= 13 && crearMarcadorNombre(nombre) && (
                                            <Marker
                                                position={[centroide[1], centroide[0] - calculaDesplazamiento(zoomNivel, -0.01)]}
                                                icon={crearMarcadorNombre(nombre)}
                                            />
                                        )
                                    }
                                    {
                                        zoomNivel >= 10 && (
                                            <>
                                                <MarcadorConIcono position={calculaPosicionDeDesplazada([centroide[1], centroide[0]], -2, 1, zoomNivel)} icono={MalocasIcon.src} conteo={Malocas} />
                                                <MarcadorConIcono position={calculaPosicionDeDesplazada([centroide[1], centroide[0]], -4, 1, zoomNivel)} icono={EducativaIcon.src} conteo={Educativa} />
                                                <MarcadorConIcono position={calculaPosicionDeDesplazada([centroide[1], centroide[0]], -6, 1, zoomNivel)} icono={SaludIcon.src} conteo={Salud} />
                                            </>
                                        )
                                    }
                                </React.Fragment>
                            );
                        })
                    }
                </>
            )}
        </MapContainer>
    );
};

export default Mapa;

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target.getZoom());
        }
    });
    return null;
};

const MarcadorConIcono = ({ position, icono, conteo }: { position: [number, number], icono: string, conteo: number }) => {
    const leaflet = require('leaflet');
    const customIcon = leaflet.divIcon({
        html: `<div style="position: relative;">
                <img src="${icono}" style="width: 5rem; height: 5rem;" />
                <span style="position: absolute;
                top: 0px;
                right: -5px;
                background-color: white;
                border-radius: 50%;
                padding: 2px;
                font-size: 10px;
                font-weight: bold;
                color: black;">
                    ${conteo}
                </span>
            </div>`,
        iconSize: [20, 20],
        className: ''
    });
    return <Marker position={position} icon={customIcon} />;
};

const calculaPosicionDeDesplazada = (coordenadas: [number, number], offsetX: number, offsetY: number, zoomNivel: number): [number, number] => {
    const factorDeEscala = Math.pow(2, zoomNivel - 6);
    return [coordenadas[0] + offsetY / factorDeEscala, coordenadas[1] + offsetX / factorDeEscala];
};

const calculaDesplazamiento = (zoom: number, factor: number) => {
    return factor * (15 / zoom);
};

type Key = string;
type ConjuntoDeValores = Set<"Educativa" | "Salud" | "Malocas">;
type MapaDeTiposPorComunidades = Map<Key, ConjuntoDeValores>;

const defineTiposDeInfraestructuraPorComunidades = (infraestructuraEnComunidades: { conteo: number; tipo: string; comunidadId: string; }[]) => {
    const tiposInfraestructuraPorComunidades = new Map<string, Set<"Educativa" | "Salud" | "Malocas">>();
    infraestructuraEnComunidades.forEach((comunidad: { conteo: number, tipo: string, comunidadId: string }) => {
        if (!tiposInfraestructuraPorComunidades.has(comunidad.comunidadId)) {
            tiposInfraestructuraPorComunidades.set(comunidad.comunidadId, new Set());
        }
        tiposInfraestructuraPorComunidades.get(comunidad.comunidadId)?.add(comunidad.tipo as "Educativa" | "Salud" | "Malocas");
    });
    return tiposInfraestructuraPorComunidades;
}

const defineInfraestructuraMinimaSinUnTipoPorComunidad = (comunidadesId: string[], tiposInfraestructuraPorComunidades: MapaDeTiposPorComunidades, infraestructuraEnComunidades: TipoInfraestructuraEnComunidad[]) => {
    comunidadesId.forEach((comunidadId: string) => {
        TIPOS.forEach((tipo) => {
            if (!tiposInfraestructuraPorComunidades.get(comunidadId)?.has(tipo as "Educativa" | "Salud" | "Malocas")) {
                infraestructuraEnComunidades.push({ conteo: 0, tipo: tipo as "Educativa" | "Salud" | "Malocas", comunidadId });
            }
        });
    });
}

const defineInfraestructuraMinimaSiNingunTipoPorComunidad = (infraestructuraEnComunidades: TipoInfraestructuraEnComunidad[]): { [id: string]: InfraestructuraPorComunidad } => {
    const infraestructuraMinimaCompleta = infraestructuraEnComunidades.reduce((acc: { [id: string]: InfraestructuraPorComunidad }, infraestructuraEnComunidad: TipoInfraestructuraEnComunidad) => {
        const { comunidadId, tipo, conteo } = infraestructuraEnComunidad;
        if (!acc[comunidadId]) {
            acc[comunidadId] = {
                Malocas: 0,
                Educativa: 0,
                Salud: 0,
            };
        }
        acc[comunidadId][tipo as keyof InfraestructuraPorComunidad] = conteo;
        return acc;
    }, {} as { [id: string]: InfraestructuraPorComunidad });
    return infraestructuraMinimaCompleta;
};