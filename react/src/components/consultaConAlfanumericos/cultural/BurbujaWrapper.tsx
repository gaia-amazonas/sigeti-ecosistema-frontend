// src/components/consultaConAlfanumericos/cultural/CulturalGraficoBurbujaWrapper.tsx

import React from 'react';
import CulturalGraficoBurbuja from 'components/consultaConAlfanumericos/cultural/Contenido';

import { CajaTitulo } from '../estilos';

interface CulturalGraficoBurbujaWrapperProps {
  datos: any;
}

const CulturalGraficoBurbujaWrapper: React.FC<CulturalGraficoBurbujaWrapperProps> = ({ datos }) => {
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
