// components/mapas/Mapa.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';

import estilos from './Mapa.module.css';
import { estiloTerritorio, estiloContenedorBotones, estiloBoton, obtieneColorRandom } from './estilos';
import { adjuntarAPopUp, creaCirculoConAnhoDentro, creaContenedorInformacion, creaContenedorLineaTiempo } from './graficosDinamicos';

import { buscarDatos, buscarDatosGeoJson } from 'buscadores/datosSQL';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/paraTerritorios';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/paraComunidades';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/paraLineasColindantes';

const Contenedor = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const CapaOSM = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LineasColindantesGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const TerritoriosGeoJson = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const CirculoComunidad = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface MapaImp {
  modo: string | string[];
}


const Mapa: React.FC<MapaImp> = ({ modo }) => {

  let lineaSeleccionada: { setStyle: (arg0: { color: any; weight: number; opacity: number; zIndex: number; }) => void; feature: { variables: { colorOriginal: any; }; }; } | null = null;
  
  const [lineasColindantesGeoJson, establecerLineasColindantesGeoJson] = useState<FeatureCollection | null>(null);
  const [territoriosGeoJson, establecerTerritoriosGeoJson] = useState<FeatureCollection | null>(null);
  const [comunidadesGeoJson, establecerComunidadesGeoJson] = useState<FeatureCollection | null>(null);
  const [mostrarOSM, establecerMostrarOSM] = useState(true);
  const [mostrarLineasColindantes, establecerMostrarLineas] = useState(true);
  const [mostrarTerritorios, establecerMostrarTerritorios] = useState(true);
  const [mostrarComunidades, establecerMostrarComunidades] = useState(true);


  useEffect(() => {
    const buscarLineas = async () => {
      const lineas = (row: any) => ({
        type: 'Feature',
        variables: { id: row.OBJECTID, col_entre: row.COL_ENTRE },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.geometrias, modo, lineas) 
        : buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.geometrias, modo, lineas));
      establecerLineasColindantesGeoJson(geoJson);
    };
    buscarLineas();
  }, [modo]);

  useEffect(() => {
    const buscarTerritorios = async () => {
      const territorios = (row: any) => ({
        type: 'Feature',
        variables: { nombre: row.NOMBRE_TI, id: row.ID_TI, abreviacion: row.ABREV_TI },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" // para la aplicación de escritorio
        ? buscarDatosGeoJson(consultasBigQueryParaTerritorios.geometrias, modo, territorios) 
        : buscarDatosGeoJson(consultasBigQueryParaTerritorios.geometrias, modo, territorios));
      establecerTerritoriosGeoJson(geoJson);
    };
    buscarTerritorios();
  }, [modo]);

  useEffect(() => {
    const buscarComunidades = async () => {
      const comunidades = (row: any) => ({
        type: 'Feature',
        variables: { nombre: row.nomb_cnida, id: row.id_cnida },
        geometry: JSON.parse(row.geometry)
      });
      const geoJson = await (modo === "online" 
        ? buscarDatosGeoJson(consultasBigQueryParaComunidades.comunidades, modo, comunidades) 
        : buscarDatosGeoJson(consultasBigQueryParaComunidades.comunidades, modo, comunidades));
      establecerComunidadesGeoJson(geoJson);
    };
    buscarComunidades();
  }, [modo]);


  const enCadaLinea = (linea: any, capa: any) => {
    if (linea.variables && linea.variables.id) {
      determinaColorLineaColindante(linea);
      agregaEstiloALineaColindante(capa, linea);
      capa.on('click', async () => {
        devuelveEstiloALineaColindanteSeleccionadaAntes(capa, lineaSeleccionada);
        agregaEstiloALineaColindanteSeleccionada(capa);
        htmlParaPopUpDeLineaColindante(capa, await traeInformacionDocumentalLineaColindante(linea, modo));
        lineaSeleccionada = capa;
      });
    }
  };

  const enCadaTerritorio = (territorio: any, capa: any) => {
    if (territorio.variables && territorio.variables.id) {
      capa.on('click', async () => {
        const contenedorLineaTiempo = creaContenedorLineaTiempo();
        const contenedorInformacion = creaContenedorInformacion();
        const gestionDocumental = await traeInformacionDocumentalTerritorio(territorio, modo);
        gestionDocumental.forEach((documento: any) => {
          const circulo = creaCirculoConAnhoDentro(documento, contenedorInformacion);
          contenedorLineaTiempo.appendChild(circulo);
        });
        capa.bindPopup(htmlParaPopUpDeTerritorio(territorio)).openPopup();
        adjuntarAPopUp(territorio, contenedorLineaTiempo, contenedorInformacion);

      });
      agregaNombreTerritorioAPoligono(territorio, capa)
      tieneDatosTerritorio(territorio).then((tieneDatos) => {
        if (tieneDatos) {
          agregarSimboloDocumentacion(capa);
        }
      });
    }
  };
  
  const tieneDatosTerritorio = async (territorio: any): Promise<boolean> => {
    const gestionDocumental = await buscarDatos(consultasBigQueryParaTerritorios.gestionDocumentalTerritorio(territorio.variables.id), modo);
    return gestionDocumental.rows.length !== 0;
  };

  if (!lineasColindantesGeoJson || !territoriosGeoJson || !comunidadesGeoJson) return <div>Cargando el mapa...</div>;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={estiloContenedorBotones}>
        <button onClick={() => establecerMostrarOSM(!mostrarOSM)} style={estiloBoton(mostrarOSM, 'green')}>OSM</button>
        <button onClick={() => establecerMostrarLineas(!mostrarLineasColindantes)} style={estiloBoton(mostrarLineasColindantes, '#FF0000')}>Lineas</button>
        <button onClick={() => establecerMostrarTerritorios(!mostrarTerritorios)} style={estiloBoton(mostrarTerritorios, '#3388FF')}>Territorios</button>
        <button onClick={() => establecerMostrarComunidades(!mostrarComunidades)} style={estiloBoton(mostrarComunidades, '#3388FF')}>Comunidades</button>
      </div>
      <Contenedor center={[-0.227026, -70.067765]} zoom={7} style={{ height: '100%', width: '100%' }}>
        {mostrarOSM &&
          <CapaOSM
            url={modo === "online" ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          // <CapaOSM
          //   url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
          //   attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          // />
          }
        { mostrarTerritorios && territoriosGeoJson && <TerritoriosGeoJson data={territoriosGeoJson} onEachFeature={enCadaTerritorio} style={estiloTerritorio} />}
        { mostrarLineasColindantes && lineasColindantesGeoJson && <LineasColindantesGeoJson data={lineasColindantesGeoJson} onEachFeature={enCadaLinea} />}
        { mostrarComunidades && comunidadesGeoJson && comunidadesGeoJson.features.map((feature, index) => {
          const centroide = turf.centroid(feature).geometry.coordinates;
          return (
            <React.Fragment key={index}>
              <CirculoComunidad
                center={[centroide[1], centroide[0]]}
                radius={1000}
                pathOptions={{ color: 'black', fillOpacity: 0.1 }}
              />
              <CirculoComunidad
                center={[centroide[1], centroide[0]]}
                radius={10}
                pathOptions={{ color: 'black', fillOpacity: 1 }}
              />
            </React.Fragment>
          );
        })}

      </Contenedor>
    </div>
  );
};

export default Mapa;

const traeInformacionDocumentalLineaColindante = async (linea: any, modo: string | string[]) => {
  const gestionDocumental = await buscarDatos(consultasBigQueryParaLineasColindantes.gestionDocumentalLineaColindante(linea.variables.id), modo);
  organizaDocumentacionPorFecha(gestionDocumental);
  return gestionDocumental.rows[0];
}

const determinaColorLineaColindante = (linea: any) => {
  if (!linea.variables.colorOriginal) {
    linea.variables.colorOriginal = obtieneColorRandom();
  }
}

const agregaEstiloALineaColindante = (capa: any, linea: any) => {
  capa.setStyle({
    color: linea.variables.colorOriginal,
    weight: 13,
    opacity: 0.6,
    zIndex: 10,
  });
}

const devuelveEstiloALineaColindanteSeleccionadaAntes = (capa: any, lineaSeleccionada: any) => {
  if (lineaSeleccionada && lineaSeleccionada !== capa) {
    lineaSeleccionada.setStyle({
      color: lineaSeleccionada.feature.variables.colorOriginal,
      weight: 13,
      opacity: 0.6,
      zIndex: 10,
    });
  }
}

const agregaEstiloALineaColindanteSeleccionada = (capa: any) => {
  capa.setStyle({
    color: 'yellow',
    weight: 13,
    opacity: 0.8,
    zIndex: 10,
  });
}

const htmlParaPopUpDeLineaColindante = (linea: any, info: any) => {
  if (info) {
    const texto = `<strong>Colindante Entre:</strong> ${info.COL_ENTRE}<br/>
    <strong>¿Hubo acuerdo?:</strong> ${info.ACUERDO}<br/>
    <strong>Acuerdo entre:</strong> ${info.COL_ENTRE}<br/>
    <strong><a href="${info.LINK_DOC}" target="_blank">Link al Documento</a></strong><br/>
    <strong>Fecha:</strong> ${info.FECHA_INICIO.value}<br/>
    <strong>Lugar:</strong> ${info.LUGAR}<br/>
    <strong>Tipo de documento:</strong> ${info.TIPO_DOC}<br/>
    <strong>Escenario:</strong> ${info.ESCENARIO}<br/>
    <strong>Nombre del escenario:</strong> ${info.FECHA_INICIO.value}<br/>
    <strong>Resumen:</strong> ${info.DES_DOC}<br/>`;
    linea.bindPopup(texto).openPopup();
  }
}

const organizaDocumentacionPorFecha = (gestionDocumental: any) => {
  gestionDocumental.rows.sort((a: any, b: any) => a.FECHA_INICIO.value.localeCompare(b.FECHA_INICIO.value));
}

const agregarSimboloDocumentacion = async (capa: any) => {
  const leaflet = (await import('leaflet')).default;
  const simbolo = leaflet.divIcon({
    className: 'custom-data-icon',
    html: '<div style="font-size: 24px;">📄</div>',
    iconSize: [1, 1],
  });
  const centroid = turf.centroid(capa.feature).geometry.coordinates;
  const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
  marker.addTo(capa._map);
};

const agregaNombreTerritorioAPoligono = async (territorio: any, capa: any) => {
  const leaflet = (await import('leaflet')).default;
  const abreviacionNombre = territorio.variables.abreviacion;
  const simbolo = leaflet.divIcon({
    className: estilos['territorio-nombre'],
    html: `<div>${abreviacionNombre}</div>`,
    iconSize: [abreviacionNombre.length * 6, 20],
    iconAnchor: [abreviacionNombre.length * 3, 10]
  });
  const centroid = turf.centroid(territorio).geometry.coordinates;
  const marker = leaflet.marker([centroid[1], centroid[0]], { icon: simbolo });
  marker.addTo(capa._map);
};

const traeInformacionDocumentalTerritorio = async (territorio: any, modo: string | string[]) => {
  const gestionDocumental = await buscarDatos(consultasBigQueryParaTerritorios.gestionDocumentalTerritorio(territorio.variables.id), modo);
  organizaDocumentacionPorFecha(gestionDocumental);
  return gestionDocumental.rows;
}

const htmlParaPopUpDeTerritorio = (territorio: any) => {
  return `<div style="width: auto; max-width: 20rem;">
    <strong>${territorio.variables.nombre}</strong> (${territorio.variables.id})<br/>
    <div id="timeline-${territorio.variables.id}" style="display: flex; flex-wrap: wrap;">Hechos históricos</div>
    <div id="info-${territorio.variables.id}"></div>
  </div>`
}