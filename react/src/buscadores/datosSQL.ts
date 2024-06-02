// .src/buscadores/buscarDatosBigQuery.ts
import { FeatureCollection } from 'geojson';

export const buscarDatos = async (consulta: string, modo: string) => {
    const puntofinal = modo === 'online' ? '/api/bigQuery' : '/api/postgreSQL';
    const respuesta = await fetch(`${puntofinal}?query=${encodeURIComponent(consulta)}`);
    console.log("Respuesta API:", respuesta);
    return await respuesta.json();
};

export const buscarDatosGeoJson = async (
    consulta: string,
    modo: string,
    featuresMapa: (row: any) => any
): Promise<FeatureCollection> => {
    const json = await buscarDatos(consulta, modo);
    const features = json.rows.map(featuresMapa).filter((feature: any) => feature !== null);
    return {
        type: 'FeatureCollection',
        features: features,
    };
};
