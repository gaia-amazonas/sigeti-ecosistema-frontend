// .src/buscadores/buscarSQL.ts
import { FeatureCollection } from 'geojson';
import logger from 'utilidades/logger';

export const buscarDatos = async (consulta: string, modo: string) => {
    const puntofinal = modo === 'online' ? '/api/bigQuery' : '/api/postgreSQL';
    try {
        const respuesta = await fetch(`${puntofinal}?query=${encodeURIComponent(consulta)}`);
        logger.info("API Response", { url: puntofinal, status: respuesta.status, statusText: respuesta.statusText });
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
    modo: string | string[] | undefined,
    featuresMapa: (row: any) => any): Promise<FeatureCollection> => {

    try {
        const json = await buscarDatos(consulta, modo);
        const features = json.rows.map(featuresMapa).filter((feature: any) => feature !== null);
        const featureCollection: FeatureCollection = {
            type: 'FeatureCollection',
            features: features,
        };
        logger.info("GeoJSON Feature Collection", { featureCollection });
        return featureCollection;
    } catch (error) {
        logger.error("Error converting data to GeoJSON", { error });
        throw error;
    }
};
