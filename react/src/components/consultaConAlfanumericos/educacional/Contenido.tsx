// src/components/consultaConAlfanumericos/educacional/Contenido.tsx

import React, { useState } from 'react';
import { CajaTitulo } from '../estilos';
import estilos from 'estilosParaMapas/ParaMapas.module.css'
import SexoEdad from '../SexoEdad';
import MapaInfraestructura from 'components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades';
import QueEstoyViendo from '../general/QueEstoyViendo';
import { datosCulturalesInvalidos, segmentarPorEdadYSexoParaGraficasPiramidales } from './utils';
import MapaConControles from './MapaConControles';
import EducacionalComunidadesEnTerritoriosDatosConsultados from 'tipos/educacional/datosConsultados';
import WrapperAnimadoParaHistorias from '../WrapperAnimadoParaHistorias';

interface ComponenteEducacionalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    datosParaConsulta: { territoriosId: string[], comunidadesId: string[] };
    queEstoyViendo: { comunidadesGeoJson: any | null, territoriosGeoJson: any | null };
    modo: string | string[];
}

const ComponenteEducacionalComunidadesEnTerritorios: React.FC<ComponenteEducacionalComunidadesEnTerritoriosImp> = ({ datosEducacionales, datosParaConsulta, queEstoyViendo, modo }) => {
    const [selectedGraph, setSelectedGraph] = useState<'escolaridadJoven' | 'escolaridad' | null>('escolaridadJoven');

    const handleSelect = (graphType: 'escolaridadJoven' | 'escolaridad') => {
        setSelectedGraph(selectedGraph === graphType ? null : graphType);
    };

    if (datosCulturalesInvalidos(datosEducacionales)) {
        return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
        </div>;
    }

    return (
        <>
            <WrapperAnimadoParaHistorias>
                <CajaTitulo>Mapa de Escolarización Primaria y Secundaria</CajaTitulo>
                <MapaConControles
                    datosEducacionales={datosEducacionales}
                    datosParaConsulta={datosParaConsulta}
                    queEstoyViendo={queEstoyViendo}
                    modo={modo}
                />
            </WrapperAnimadoParaHistorias>
            <WrapperAnimadoParaHistorias>
                <CajaTitulo>Infraestructura para la Educación</CajaTitulo>
                <MapaInfraestructura datos={datosEducacionales} modo={modo} />
            </WrapperAnimadoParaHistorias>
            <WrapperAnimadoParaHistorias>
                <CajaTitulo>Selecciona Tipo de Escolaridad</CajaTitulo>
                <div className={estilos.toggleContainer}>
                    <button
                        className={`${estilos.toggleBox} ${selectedGraph === 'escolaridadJoven' ? estilos.selected : ''}`} 
                        onClick={() => handleSelect('escolaridadJoven')}
                    >
                        Escolaridad Joven
                    </button>
                    <button
                        className={`${estilos.toggleBox} ${selectedGraph === 'escolaridad' ? estilos.selected : ''}`}
                        onClick={() => handleSelect('escolaridad')}
                    >
                        Escolaridad General
                    </button>
                </div>
                {selectedGraph === 'escolaridadJoven' && (
                    <>
                        <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridadJoven)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
                    </>
                )}
                {selectedGraph === 'escolaridad' && (
                    <>
                        <SexoEdad datosPiramidalesSexoEdad={segmentarPorEdadYSexoParaGraficasPiramidales(datosEducacionales.escolaridad)} labelIzquierdo="Hombres" labelDerecho="Mujeres" />
                    </>
                )}
            </WrapperAnimadoParaHistorias>
            <QueEstoyViendo
                comunidades={queEstoyViendo.comunidadesGeoJson}
                territorios={queEstoyViendo.territoriosGeoJson}
            />
        </>
    );
}

export default ComponenteEducacionalComunidadesEnTerritorios;
