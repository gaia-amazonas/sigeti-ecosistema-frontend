import React, { useState, useEffect } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { General } from 'components/consultaConAlfanumericos/general/General';
import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';
import { buscarDatosPorTerritorioYComunidad, buscarDatosParaTodosTerritoriosYComunidades, buscarDatosPorTerritorio } from 'buscadores/paraAlfanumerica';

interface DatosParaConsultar {
  territorios_id: string[];
  comunidades_id: string[];
}

interface PestanhasImp {
  datosParaConsultar: DatosParaConsultar;
  reiniciar: () => void;
  modo: string;
}

interface General {
  sexo: string;
  familias: string;
  sexo_edad: string;
  territorio: string;
  comunidades_en_territorio: string;
  territoriosGeoJson: FeatureCollection | null;
}

interface DatosPorPestanhaImp {
  general: General[];
  cultural: any[];
  educacion: any[];
}

interface DatosConsultados {
  sexo: any;
  familias: any;
  sexo_edad: any;
  territorio: any;
  comunidades_en_territorio: any;
  territoriosGeoJson: FeatureCollection | null;
}

const initialDatosConsultados: DatosConsultados = {
  sexo: '',
  familias: '',
  sexo_edad: '',
  territorio: '',
  comunidades_en_territorio: '',
  territoriosGeoJson: null,
};

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanha_general');
  const [datosConsultados, establecerDatosConsultados] = useState<DatosConsultados>(initialDatosConsultados);
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
    general: [],
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo]);

  useEffect(() => {
    establecerDatosPorPestanha({
      general: [
        datosConsultados.sexo,
        datosConsultados.familias,
        datosConsultados.sexo_edad,
        datosConsultados.territorio,
        datosConsultados.comunidades_en_territorio,
        datosConsultados.territoriosGeoJson
      ],
      cultural: [], 
      educacion: []
    });
  }, [datosConsultados])

  const buscarDatosParaPestanha = async () => {
    if (datosParaConsultar.comunidades_id && datosParaConsultar.comunidades_id[0] !== 'Todas') {
      establecerDatosConsultados(await buscarDatosPorTerritorioYComunidad(datosParaConsultar, modo));
    } else if (datosParaConsultar.territorios_id[0] === 'Todos' && datosParaConsultar.comunidades_id[0] === 'Todas') {
      establecerDatosConsultados(await buscarDatosParaTodosTerritoriosYComunidades(modo));
    } else if (datosParaConsultar.comunidades_id[0] === 'Todas') {
      establecerDatosConsultados(await buscarDatosPorTerritorio(datosParaConsultar, modo));
    } else {
      throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidades_id}, territorio: ${datosParaConsultar.territorios_id})`);
    }
  };

  return (
    <Contenedor>
      <BotonReiniciar onClick={reiniciar} />
      <Titulo>Temáticas</Titulo>
      <ListaPestanhas>
        <EstiloPestanha active={activo === 'pestanha_general'} onClick={() => establecerActivo('pestanha_general')}>General</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_cultural'} onClick={() => establecerActivo('pestanha_cultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_educacional'} onClick={() => establecerActivo('pestanha_educacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanha_general' && <General datos={datosPorPestanha.general} />}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;
