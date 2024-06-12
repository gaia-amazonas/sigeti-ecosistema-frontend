import * as turf from '@turf/turf';
import { Circle, Layer, Path } from 'leaflet';

import { traeInformacionComunidad, traeInformacionDocumentalLineaColindante } from 'buscadores/paraMapa';

import estilos from './Mapa.module.css';
import { estiloContenedorLineaTiempo, estiloContenedorInformacion, estiloCirculo, estiloTextoEnCirculo } from './estilos';
import { 
  FilaGestionDocumental, 
  GestionDocumental, 
  SexoComunidad, 
  PuebloComunidad, 
  InformacionLineaColindante, 
  PathZIndex, 
  LineaSeleccionada, 
  DocumentosPorTerritorio, 
  FeatureComunidades, 
  FeatureTerritorios, 
  FeatureLineas, 
  FilaComunidades, 
  FilaTerritorios, 
  FilaLineas, 
  MapaImp, 
  GeometriasConVariables, 
  Fecha 
} from './tipos';

import logger from 'utilidades/logger';

export function obtieneColorRandom() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const creaContenedorLineaTiempo = () => {
  const contenedorLineaTiempo = document.createElement('div');
  Object.assign(contenedorLineaTiempo.style, estiloContenedorLineaTiempo);
  return contenedorLineaTiempo;
};

export const creaContenedorInformacion = () => {
  const contenedorInformacion = document.createElement('div');
  Object.assign(contenedorInformacion.style, estiloContenedorInformacion);
  return contenedorInformacion;
};

export const creaCirculoConAnhoDentro = (documento: any, contenedorInformacion: HTMLElement) => {
  
  const circulo = document.createElement('div');
  Object.assign(circulo.style, estiloCirculo);
  Object.assign(circulo.style, estiloTextoEnCirculo);

  circulo.title = documento.FECHA_INICIO.value;
  const anho = documento.FECHA_INICIO.value;
  const ultimosDosDigitos = anho.slice(2, 4);
  const textEnCirculo = document.createTextNode(ultimosDosDigitos);
  circulo.appendChild(textEnCirculo);

  circulo.addEventListener('click', () => {
    contenedorInformacion.innerHTML = `
      <strong>Documento:</strong> ${documento.TIPO_DOC}<br/>
      <strong>Fecha de Inicio:</strong> ${documento.FECHA_INICIO.value}<br/>
    `;
    contenedorInformacion.innerHTML += `<strong>Tipo Escenario:</strong> ${documento.ESCENARIO}<br/>
      <strong>Resumen: </strong> ${documento.DES_DOC}<br/>
      <strong><a href="${documento.LINK_DOC}" target="_blank">Link al Documento</a></strong><br/>`;
  });

  return circulo;
};

export const adjuntarAPopUp = (territorio: any, contenedorLineaTiempo: HTMLElement, contenedorInformacion: HTMLElement) => {
  const popupContent = document.getElementById(`timeline-${territorio.properties.id}`);
  if (popupContent) {
    popupContent.appendChild(contenedorLineaTiempo);
  }

  const infoContent = document.getElementById(`info-${territorio.properties.id}`);
  if (infoContent) {
    infoContent.appendChild(contenedorInformacion);
  }
};

export const determinaColorLineaColindante = (linea: FeatureLineas) => {
  if (!linea.properties.colorOriginal) {
    linea.properties.colorOriginal = obtieneColorRandom();
  }
};

export const agregaEstiloALineaColindante = (layer: PathZIndex, linea: FeatureLineas) => {
  if (layer.setStyle) {
    layer.setStyle({
      color: linea.properties.colorOriginal,
      weight: 13,
      opacity: 0.6,
      zIndex: 10,
    });
  }
};

export const enCadaLineaClicada = async (lineaSeleccionada: LineaSeleccionada | null, linea: FeatureLineas, capa: Layer, modo: string | string[]) => {
  if (lineaSeleccionada) {
    devuelveEstiloALineaColindanteSeleccionadaAntes(lineaSeleccionada);
  }
  if ((capa as unknown as Path).setStyle) {
    agregaEstiloALineaColindanteSeleccionada(capa as unknown as PathZIndex);
  }
  const informacionDocumental = await traeInformacionDocumentalLineaColindante(linea, modo);
  htmlParaPopUpDeLineaColindante(capa as unknown as PathZIndex, informacionDocumental);
  return capa as unknown as LineaSeleccionada;
}

export const devuelveEstiloALineaColindanteSeleccionadaAntes = ( lineaSeleccionada: LineaSeleccionada ) => {
  if (lineaSeleccionada && lineaSeleccionada.setStyle) {
    lineaSeleccionada.setStyle({
      color: lineaSeleccionada.feature.properties.colorOriginal,
      weight: 13,
      opacity: 0.6,
      zIndex: 10,
    });
  }
};

export const agregaEstiloALineaColindanteSeleccionada = (capa: PathZIndex) => {
  if (capa.setStyle) {
    capa.setStyle({
      color: 'yellow',
      weight: 13,
      opacity: 0.8,
      zIndex: 10,
    });
  }
};

export const htmlParaPopUpDeLineaColindante = (capa: PathZIndex, informacion: InformacionLineaColindante) => {
  if (informacion) {
    const texto = `<strong>Acuerdo entre:</strong> ${informacion.COL_ENTRE}<br/>
      <strong><a href="${informacion.LINK_DOC}" target="_blank">Link al Documento</a></strong><br/>
      <strong>Definición:</strong> ${informacion.DEFINICION}<br/>
      <strong>Descripción del documento:</strong> ${informacion.DES_DOC}<br/>
      <strong>Acta de Colindancia:</strong> <a href="${informacion.ACTA_COL}" target="_blank">Link al Documento</a><br/>
      <strong>PV 1:</strong> <a href="${informacion.PV_1}" target="_blank">Link al Documento</a><br/>
      <strong>PV 2:</strong> <a href="${informacion.PV_2}" target="_blank">Link al Documento</a><br/>`;
    capa.bindPopup(texto).openPopup();
  }
};

export const crearHtmlPopUpComunidad = async (id: string, modo: string | string[], circle: Circle) => {
  try {
    return intentaCrearHtmlPopUpComunidad(id, modo);
  } catch (error) {
    logger.error('Error buscando información de la comunidad:', error);
    return '<div>No hay datos para esta comunidad aún</div>';
  }
};


export const intentaCrearHtmlPopUpComunidad = async (id: string, modo: string | string[]) => {
  const informacion = await traeInformacionComunidad(id, modo);
  const hombres = informacion.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Hombre')?.f0_ || 0;
  const mujeres = informacion.sexos.rows.find((s: SexoComunidad) => s.SEXO === 'Mujer')?.f0_ || 0;
  const poblacionTotal = hombres + mujeres;
  return `
    <div>
      <strong>Nombre:</strong> ${informacion.nombre.rows[0].NOMB_CNIDA}<br/>
      <strong>Territorio:</strong> ${informacion.territorio.rows[0].nombreTerritorio}<br/>
      <strong>Población:</strong> ${poblacionTotal} habitantes<br/>
      <strong>Familias:</strong> ${informacion.familias.rows[0].familias}<br/>
      <strong>Pueblos:</strong> ${informacion.pueblos.rows.map((p: PuebloComunidad) => p.PUEBLO).join(', ')}<br/>
      <strong>Sexos:</strong><br/>
      &nbsp;&nbsp;&nbsp;${mujeres} mujeres<br/>
      &nbsp;&nbsp;&nbsp;${hombres} hombres
    </div>
  `;
}

export const agregarSimboloDocumentacion = async (territorio: FeatureTerritorios, capa: Layer) => {
  const leaflet = (await import('leaflet')).default;
  const simbolo = leaflet.divIcon({
    className: 'custom-data-icon',
    html: '<div style="font-size: 24px;">📄</div>',
    iconSize: [1, 1],
  });

  const centroide = turf.centroid(territorio).geometry.coordinates;
  const marcador = leaflet.marker([centroide[1], centroide[0]], { icon: simbolo });

  marcador.addTo((capa as any)._map);

};

export const agregaNombreTerritorioAPoligono = async (territorio: FeatureTerritorios, capa: Layer) => {
  const leaflet = (await import('leaflet')).default;
  const abreviacionNombre = territorio.properties.abreviacion;
  const simbolo = leaflet.divIcon({
    className: estilos['territorio-nombre'],
    html: `<div>${abreviacionNombre}</div>`,
    iconSize: [abreviacionNombre.length * 6, 20],
    iconAnchor: [abreviacionNombre.length * 3, 10],
  });
  const centroide = turf.centroid(territorio).geometry.coordinates;
  const marcador = leaflet.marker([centroide[1], centroide[0]], { icon: simbolo });
  marcador.addTo((capa as any)._map);
};

export const htmlParaPopUpDeTerritorio = (territorio: FeatureTerritorios) => {
  return `<div style="width: auto; max-width: 20rem;">
    <strong>${territorio.properties.nombre}</strong> (${territorio.properties.id})<br/>
    <div id="timeline-${territorio.properties.id}" style="display: flex; flex-wrap: wrap;">Hechos históricos</div>
    <div id="info-${territorio.properties.id}"></div>
  </div>`;
};