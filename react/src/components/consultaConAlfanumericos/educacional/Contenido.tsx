// src/components/consultaConAlfanumericos/educacional/Contenido.tsx
import React from 'react';

import SexoEdad from '../SexoEdad';
import { CajaTitulo } from '../estilos';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import MapaEducativo from 'components/consultaConAlfanumericos/educacional/MapaComunidades';
import EducacionalComunidadesEnTerritoriosDatosConsultados, { Escolaridad, EscolaridadFila } from 'tipos/educacional/datosConsultados';
import { ComunidadesGeoJson, TerritoriosGeoJson } from 'tipos/cultural/datosConsultados';
import QueEstoyViendo from '../general/QueEstoyViendo';

interface ComponenteCulturalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    queEstoyViendo: {comunidadesGeoJson: ComunidadesGeoJson | null, territoriosGeoJson: TerritoriosGeoJson | null};
    modo: string | string[];
}


const ComponenteCulturalComunidadesEnTerritorios: React.FC<ComponenteCulturalComunidadesEnTerritoriosImp> = ({datosEducacionales, queEstoyViendo, modo}) => {
    if (datosCulturalesInvalidos(datosEducacionales)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
        </div>;
    }
    return (
        <>
            <CajaTitulo>Infraestructura</CajaTitulo>
            <MapaEducativo datos={datosEducacionales} modo={modo} />
            <CajaTitulo>Escolaridad Jóven</CajaTitulo>
            <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridadJoven)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
            <CajaTitulo>Escolaridad General</CajaTitulo>
            <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridad)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
            <QueEstoyViendo
                comunidades={queEstoyViendo.comunidadesGeoJson}
                territorios={queEstoyViendo.territoriosGeoJson}
            />
        </>
    );
}

export default ComponenteCulturalComunidadesEnTerritorios;

const datosCulturalesInvalidos = (datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados) => {
    return !datosEducacionales.comunidadesGeoJson ||
    !datosEducacionales.escolaridad ||
    !datosEducacionales.escolaridadJoven ||
    !datosEducacionales.territoriosGeoJson;
}

const segmentarPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: Escolaridad | null) => {
    if (!sexoEdadDatos) {
        return null;
    }
    return sexoEdadDatos.rows.map((item: EscolaridadFila) => ({
        grupo: item.nivelEducativo,
        [item.sexo]: item.conteo * (item.sexo === 'Hombres' ? -1 : 1)
    }));
};