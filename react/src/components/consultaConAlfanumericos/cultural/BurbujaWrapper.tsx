// src/components/consultaConAlfanumericos/cultural/CulturalGraficoBurbujaWrapper.tsx

import React from 'react';
import CulturalGraficoBurbuja from 'components/consultaConAlfanumericos/cultural/Contenido';

interface CulturalGraficoBurbujaWrapperProps {
  datos: any;
}

const CulturalGraficoBurbujaWrapper: React.FC<CulturalGraficoBurbujaWrapperProps> = ({ datos }) => {
    return (
        <>
            { datos.sexosPorLengua?.rows && (
                <CulturalGraficoBurbuja datos={datos.sexosPorLengua.rows} labelKey="lengua" valueKey="conteo" />
            )}
            { datos.etnias?.rows && (
                <CulturalGraficoBurbuja datos={datos.etnias.rows} labelKey="etnia" valueKey="conteo" />
            )}
            { datos.clanes?.rows && (
                <CulturalGraficoBurbuja datos={datos.clanes.rows} labelKey="clan" valueKey="conteo" />
            )}
        </>
    );
};

export default CulturalGraficoBurbujaWrapper;
