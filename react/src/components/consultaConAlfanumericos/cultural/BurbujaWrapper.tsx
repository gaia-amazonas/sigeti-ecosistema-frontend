// src/components/consultaConAlfanumericos/cultural/BurbujaWrapper.tsx

import React from 'react';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import CulturalGraficoBurbuja from 'components/consultaConAlfanumericos/cultural/Contenido';
import CulturalComunidadesEnTerritorios, {TerritoriosGeoJson, ComunidadesGeoJson} from 'tipos/cultural/datosConsultados';

import { CajaTitulo } from '../estilos';
import QueEstoyViendo from '../general/QueEstoyViendo';

interface CulturalGraficoBurbujaWrapperImp {
  datos: CulturalComunidadesEnTerritorios;
  queEstoyViendo: {comunidadesGeoJson: ComunidadesGeoJson | null, territoriosGeoJson: TerritoriosGeoJson | null};
}

const CulturalGraficoBurbujaWrapper: React.FC<CulturalGraficoBurbujaWrapperImp> = ({ datos, queEstoyViendo }) => {
    if (datosCulturalesInvalidos(datos, queEstoyViendo)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
                <div className={estilos.spinner}></div>
            </div>;
    }
    return (
        <>
            { datos.sexosPorLengua?.rows && (
                <>
                    <CajaTitulo>Distribución de Lenguas</CajaTitulo>
                    <CulturalGraficoBurbuja datos={datos.sexosPorLengua.rows} labelKey="lengua" valueKey="conteo" />
                </>
            )}
            { datos.etnias?.rows && (
                <>
                    <CajaTitulo>Distribución de Etnias</CajaTitulo>
                    <CulturalGraficoBurbuja datos={datos.etnias.rows} labelKey="etnia" valueKey="conteo" />
                </>
            )}
            { datos.clanes?.rows && (
                <>
                    <CajaTitulo>Distribución de Clanes</CajaTitulo>  
                    <CulturalGraficoBurbuja datos={datos.clanes.rows} labelKey="clan" valueKey="conteo" />
                </>
            )}
            <QueEstoyViendo
                comunidades={queEstoyViendo.comunidadesGeoJson}
                territorios={queEstoyViendo.territoriosGeoJson}
            />
        </>
    );
};

export default CulturalGraficoBurbujaWrapper;

const datosCulturalesInvalidos = (datosCulturales: CulturalComunidadesEnTerritorios, queEstoyViendo: {comunidadesGeoJson: ComunidadesGeoJson | null, territoriosGeoJson: TerritoriosGeoJson | null}) => {
    return !datosCulturales.clanes ||
    !datosCulturales.etnias ||
    !datosCulturales.sexosPorLengua ||
    !queEstoyViendo.comunidadesGeoJson ||
    !queEstoyViendo.territoriosGeoJson
}
