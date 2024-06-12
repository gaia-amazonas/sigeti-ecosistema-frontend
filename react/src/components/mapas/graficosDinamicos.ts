import { estiloContenedorLineaTiempo, estiloContenedorInformacion, estiloCirculo, estiloTextoEnCirculo } from './estilos';

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