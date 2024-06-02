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
  circle.title = doc.Fecha_ini_actividad.value;

  circle.addEventListener('click', () => {
    contenedorInformacion.innerHTML = `
      <strong>Documento:</strong> ${doc.Nombre_documento}<br/>
      <strong>Lugar:</strong> ${doc.Lugar}<br/>
      <strong>Fechas</strong><br/>
      <strong> - de Inicio:</strong> ${doc.Fecha_ini_actividad.value}<br/>
    `;
    if (doc.Fecha_fin_actividad) {
      contenedorInformacion.innerHTML += `<strong> - de Finalización:</strong> ${doc.Fecha_fin_actividad.value}<br/>`;
    }
    contenedorInformacion.innerHTML += `<strong>Tipo Escenario:</strong> ${doc.Tipo_escenario}<br/>
      <strong><a href="${doc.Link_documento}" target="_blank">Link Documento</a></strong><br/>
      <strong><a href="${doc.Link_acta_asistencia}" target="_blank">Link Acta Asistencia</a></strong><br/>`;
  });

  return circle;
};

export const adjuntarAPopUp = (territorio: any, contenedorLineaTiempo: HTMLElement, contenedorInformacion: HTMLElement) => {
  const popupContent = document.getElementById(`timeline-${territorio.properties.id_ti}`);
  if (popupContent) {
    popupContent.appendChild(contenedorLineaTiempo);
  }

  const infoContent = document.getElementById(`info-${territorio.properties.id_ti}`);
  if (infoContent) {
    infoContent.appendChild(contenedorInformacion);
  }
};
