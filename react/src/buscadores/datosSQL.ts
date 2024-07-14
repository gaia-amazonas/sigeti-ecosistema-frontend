// .src/buscadores/buscarSQL.ts
import { FeatureCollection } from 'geojson';
import logger from 'utilidades/logger';

export const buscarDatos = async (consulta: string, modo: string | string[] ) => {
    const puntoFinal = modo === 'online' ? '/api/bigQuery' : '/api/postgreSQL';
    try {
        const respuesta = await fetch(`${puntoFinal}?query=${encodeURIComponent(consulta)}`);
        logger.info("Respuesta API", { url: puntoFinal, status: respuesta.status, statusText: respuesta.statusText });
        const json = await respuesta.json();
        logger.info("Analizada Respuesta API", { json });
        return json;
    } catch (error) {
        logger.error("Error buscando datos", { error });
        throw error;
    }
};

export const buscarDatosGeoJson = async (
    consulta: string,
    modo: string | string[],
    featuresMapa: (row: any) => any): Promise<FeatureCollection> => {
        try {
            const datos = await intentaBuscarDatosGeoJson(consulta, modo, featuresMapa);
            return datos;
        } catch (error) {
            logger.error("Error convirtiendo datos a GeoJson", { error });
            throw error;
        }
    };

const intentaBuscarDatosGeoJson = async (
    consulta: string,
    modo: string | string[],
    featuresMapa: (row: any) => any): Promise<FeatureCollection> => {
        console.log(consulta, "ffffffffffffffffffffff");
        const json = await buscarDatos(consulta, modo);
        console.log(json, "fffffffgggggggggggggg");
        const features = json.rows.map(featuresMapa).filter((feature: any) => feature !== null);
        const featureCollection: FeatureCollection = {
            type: 'FeatureCollection',
            features: features,
        };
        return featureCollection;
    };