// src/components/consultaConAlfanumericos/cultural/CulturalGraficoBurbujaWrapper.tsx

import React from 'react';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import CulturalGraficoBurbuja from 'components/consultaConAlfanumericos/cultural/Contenido';
import CulturalComunidadesEnTerritorios from 'tipos/cultural/datosConsultados';

import { CajaTitulo } from '../estilos';

interface CulturalGraficoBurbujaWrapperImp {
  datos: CulturalComunidadesEnTerritorios;
}

const CulturalGraficoBurbujaWrapper: React.FC<CulturalGraficoBurbujaWrapperImp> = ({ datos }) => {
    if (datosCulturalesInvalidos(datos)) {
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
        </>
    );
};

export default CulturalGraficoBurbujaWrapper;

const datosCulturalesInvalidos = (datosCulturales: CulturalComunidadesEnTerritorios) => {
    return !datosCulturales.clanes ||
    !datosCulturales.etnias ||
    !datosCulturales.sexosPorLengua
}