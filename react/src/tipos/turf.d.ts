declare module '@turf/turf' {
  import { Feature, Geometry, Point, FeatureCollection } from 'geojson';

  export function centroid<T extends Geometry>(
    geojson: Feature<T> | FeatureCollection<T>
  ): Feature<Point>;
}
