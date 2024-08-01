// src/components/consultaConAlfanumericos/educacional/Contenido.tsx

import React, { useState } from 'react';
import { CajaTitulo } from '../estilos';
import ContenedorContexto from '../ContenedorContexto';
import estilos from 'estilosParaMapas/ParaMapas.module.css'
import SexoEdad from '../SexoEdad';
import MapaInfraestructura from 'components/consultaConAlfanumericos/educacional/MapaInfraestructuraPorComunidades';
import QueEstoyViendo from '../general/QueEstoyViendo';
import { datosCulturalesInvalidos, segmentarPorEdadYSexoParaGraficasPiramidales } from './utils';
import MapaConControles from './MapaDeEscolarizacionConControles';
import EducacionalComunidadesEnTerritoriosDatosConsultados from 'tipos/educacional/datosConsultados';
import WrapperAnimadoParaHistorias from '../WrapperAnimadoParaHistorias';
import { useUser } from '../../../context/UserContext';

interface ComponenteEducacionalComunidadesEnTerritoriosImp {
    datosEducacionales: EducacionalComunidadesEnTerritoriosDatosConsultados;
    datosParaConsulta: { territoriosId: string[], comunidadesId: string[] };
    queEstoyViendo: { comunidadesGeoJson: any | null, territoriosGeoJson: any | null };
    modo: string | string[];
}

const ComponenteEducacionalComunidadesEnTerritorios: React.FC<ComponenteEducacionalComunidadesEnTerritoriosImp> = ({ datosEducacionales, datosParaConsulta, queEstoyViendo, modo }) => {
    const user = useUser();
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
            {
                user && user.user && (
                    <WrapperAnimadoParaHistorias>
                        <CajaTitulo>Mapa de Escolarización Primaria y Secundaria</CajaTitulo>
                        <MapaConControles
                            datosEducacionales={datosEducacionales}
                            datosParaConsulta={datosParaConsulta}
                            queEstoyViendo={queEstoyViendo}
                            modo={modo}
                        />
                    </WrapperAnimadoParaHistorias>
                )
            }
            <WrapperAnimadoParaHistorias>
                <CajaTitulo>Infraestructura para la Educación</CajaTitulo>
                <ContenedorContexto texto = 'Los siguientes datos constituyen una caracterización de la población escolarizada en el territorio. Esta información básica es útil para observar a detalle la infraestructura educativa, el grado de escolarización y la distribución poblacional según su nivel educativo.' />
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
