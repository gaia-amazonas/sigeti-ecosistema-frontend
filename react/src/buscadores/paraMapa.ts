const fetchLineas = async (modo: any) => {
  establecerEstaCargandoLineas(true);
  try {
    const lineas = (row: any) => ({
      type: 'Feature',
      variables: { id: row.OBJECTID, col_entre: row.COL_ENTRE },
      geometry: JSON.parse(row.geometry)
    });
    const geoJsonLineas = await buscarDatosGeoJson(consultasBigQueryParaLineasColindantes.geometrias, modo, lineas);
    establecerLineasColindantesGeoJson(geoJsonLineas);
  } catch (error) {
    logger.error('Error fetching lineas data:', error);
  } finally {
    establecerEstaCargandoLineas(false);
  }
};

const fetchTerritorios = async (modo: any) => {
  establecerEstaCargandoTerritorios(true);
  try {
    const territorios = (row: any) => ({
      type: 'Feature',
      variables: { nombre: row.NOMBRE_TI, id: row.ID_TI, abreviacion: row.ABREV_TI },
      geometry: JSON.parse(row.geometry)
    });
    const geoJsonTerritorios = await buscarDatosGeoJson(consultasBigQueryParaTerritorios.geometrias, modo, territorios);
    establecerTerritoriosGeoJson(geoJsonTerritorios);
  } catch (error) {
    logger.error('Error fetching territorios data:', error);
  } finally {
    establecerEstaCargandoTerritorios(false);
  }
};

const fetchComunidades = async (modo: any) => {
  establecerEstaCargandoComunidades(true);
  try {
    const comunidades = (row: any) => ({
      type: 'Feature',
      variables: { nombre: row.nomb_cnida, id: row.id_cnida },
      geometry: JSON.parse(row.geometry)
    });
    const geoJsonComunidades = await buscarDatosGeoJson(consultasBigQueryParaComunidades.comunidades, modo, comunidades);
    establecerComunidadesGeoJson(geoJsonComunidades);
  } catch (error) {
    logger.error('Error fetching comunidades data:', error);
  } finally {
    establecerEstaCargandoComunidades(false);
  }
};
