// src/components/consultaConAlfanumericos/educacional/Contenido.tsx

import React from 'react';
import { CajaTitulo } from '../estilos';
import estilos from 'estilosParaMapas/ParaMapas.module.css'
import SexoEdad from '../SexoEdad';
import MapaInfraestructura from 'components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades';
import QueEstoyViendo from '../general/QueEstoyViendo';
import { datosCulturalesInvalidos, segmentarPorEdadYSexoParaGraficasPiramidales } from './utils';
import MapaConControles from './MapaConControles';
import EducacionalComunidadesEnTerritoriosDatosConsultados from 'tipos/educacional/datosConsultados';

interface ComponenteCulturalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    datosParaConsulta: { territoriosId: string[], comunidadesId: string[] };
    queEstoyViendo: { comunidadesGeoJson: any | null, territoriosGeoJson: any | null };
    modo: string | string[];
}

const ComponenteCulturalComunidadesEnTerritorios: React.FC<ComponenteCulturalComunidadesEnTerritoriosImp> = ({ datosEducacionales, datosParaConsulta, queEstoyViendo, modo }) => {
    if (datosCulturalesInvalidos(datosEducacionales)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
        </div>;
    }

    return (
        <>
            <CajaTitulo>Mapa de Escolarización Primaria y Secundaria</CajaTitulo>
            <MapaConControles 
                datosEducacionales={datosEducacionales}
                datosParaConsulta={datosParaConsulta}
                queEstoyViendo={queEstoyViendo}
                modo={modo}
            />
            <CajaTitulo>Infraestructura para la Educación</CajaTitulo>
            <MapaInfraestructura datos={datosEducacionales} modo={modo} />
            <CajaTitulo>Escolaridad Joven</CajaTitulo>
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
