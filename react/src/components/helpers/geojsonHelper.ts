// src/components/helpers/geojsonHelper.ts
export const convertToGeoJSON = (geometryObject: any): any => {
  let geoJSONGeometry;
  try {
    if (typeof geometryObject.value === 'string') {
      const geometryValue = geometryObject.value.trim();

      if (geometryValue.startsWith('POLYGON')) {
        const coordinates = geometryValue
          .replace('POLYGON((', '')
          .replace(/\)\)$/, '')
          .split('),(')
          .map((ring: string) => ring.split(',').map(coord => coord.trim().split(' ').map(Number)))
          .map((ring: any[]) => ring.filter(pair => !isNaN(pair[0]) && !isNaN(pair[1])));  // Filter out invalid coordinates
        geoJSONGeometry = {
          type: 'Polygon',
          coordinates: [coordinates[0]]
        };
      } else if (geometryValue.startsWith('POINT')) {
        const coordinates = geometryValue
          .replace('POINT(', '')
          .replace(/\)$/, '')
          .split(' ')
          .map(Number);
        if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
          geoJSONGeometry = {
            type: 'Point',
            coordinates: coordinates
          };
        } else {
          throw new Error('Invalid point format');
        }
      } else {
        throw new Error('Invalid geometry format');
      }
    } else {
      geoJSONGeometry = geometryObject;
    }
  } catch (error) {
    console.error('Invalid JSON format:', geometryObject, error);
    return null;
  }

  return {
    type: 'Feature',
    geometry: geoJSONGeometry,
    properties: {}
  };
};

export const getPolygonCentroid = (coordinates: number[][]): [number, number] => {
  let lngSum = 0;
  let latSum = 0;

  // Flatten the nested array structure and calculate the sum of coordinates
  coordinates[0].forEach(coords => {
    if (coords.length === 2) {
      const [lat, lng] = coords;
      latSum += lat;
      lngSum += lng;
    } else {
        console.log("Invalid coordinate pair");
    }
  });

  // Calculate the mean latitude and longitude
  const meanLng = lngSum / coordinates[0].length;
  const meanLat = latSum / coordinates[0].length;

  console.log(meanLng, meanLat);

  return [meanLng, meanLat];
};
