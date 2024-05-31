import { FeatureCollection } from 'geojson';


export const buscarDatos = async (consulta: string) => {
    const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
    return await respuesta.json();
};

export const buscarDatosGeoJson = async (query: string, establecedor: React.Dispatch<React.SetStateAction<FeatureCollection | null>>, featuresMapa: (filas: any) => any) => {
    
    const respuesta = await fetch(`/api/bigQueryEspacial?query=${encodeURIComponent(query)}`);
    const json = await respuesta.json();
    const features = json.rows.map(featuresMapa).filter((feature: any) => feature !== null);

    establecedor({
        type: 'FeatureCollection',
        features: features,
    });

};