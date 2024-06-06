import { estiloContenedorLineaTiempo, estiloContenedorInformacion, estiloCirculo } from './estilos';

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

export const creaCirculo = (doc: any, contenedorInformacion: HTMLElement) => {
  
  const circle = document.createElement('div');
  Object.assign(circle.style, estiloCirculo);

  // Additional styles to center the text within the circle
  Object.assign(circle.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  });

  circle.title = doc.FECHA_INICIO.value;

  // Extract the last two digits of the year from Fecha_ini_actividad
  const year = doc.FECHA_INICIO.value;
  const lastTwoDigits = year.slice(2, 4);

  // Create a text node to display the last two digits within the circle
  const textNode = document.createTextNode(lastTwoDigits);
  circle.appendChild(textNode);

  circle.addEventListener('click', () => {
    contenedorInformacion.innerHTML = `
      <strong>Documento:</strong> ${doc.TIPO_DOC}<br/>
      <strong>Lugar:</strong> ${doc.Lugar}<br/>
      <strong>Fecha de Inicio:</strong> ${doc.FECHA_INICIO.value}<br/>
    `;
    contenedorInformacion.innerHTML += `<strong>Tipo Escenario:</strong> ${doc.ESCENARIO}<br/>
      <strong>Resumen: </strong> ${doc.DES_DOC}<br/>
      <strong><a href="${doc.LINK_DOC}" target="_blank">Link al Documento</a></strong><br/>`;
  });

  return circle;
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