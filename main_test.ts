import type { Position as _Position } from "geojson";
import type {
  Feature,
  FeatureCollection,
  GeometryCollection,
  LineString,
  MultiLineString,
  Point,
  Position,
  Position2D,
  Position3D,
} from "./main.ts";

const position = [123, 456] satisfies Position;

display(position);
display([1, 2, 3]);

function display([x, y, z]: Position) {
  return z === undefined ? `${x},${y}` : `${x},${y},${z}`;
}

const point: Point = {
  type: "Point",
  coordinates: [123, 456],
};

// @ts-expect-error -- this is immutable
point.type = "Point";

function flip({ coordinates: [x, y, z], ...rest }: Point): Point {
  return {
    ...rest,
    coordinates: z === undefined ? [x, -y] : [x, -y, z],
  };
}

flip(point);

const two: Point<Position2D> = {
  type: "Point",
  coordinates: [123, 456],
};

const three: Point<Position3D> = {
  type: "Point",
  coordinates: [123, 456, 789],
};

two.bbox?.[2]; // east
three.bbox?.[5]; // top

const lineString: LineString = {
  type: "LineString",
  coordinates: [[12, 34], [56, 78]],
};

const _multiLineString: MultiLineString = {
  type: "MultiLineString",
  coordinates: [lineString.coordinates],
};

// a Feature's geometry defaults to allowing null, per the RFC's own minimal example
const emptyFeature: Feature = {
  type: "Feature",
  geometry: null,
  properties: {},
};

emptyFeature.geometry?.coordinates;

const feature: Feature = {
  type: "Feature",
  geometry: point,
  properties: { name: "test" },
};

feature.properties.name;

const _featureWithNullProperties: Feature = {
  type: "Feature",
  geometry: null,
  // @ts-expect-error -- null properties are normalised to {} at parse time, not representable here
  properties: null,
};

const collection: GeometryCollection = {
  type: "GeometryCollection",
  geometries: [point],
};

const _featureWithCollectionGeometry: Feature = {
  type: "Feature",
  // @ts-expect-error -- a Feature's geometry excludes GeometryCollection
  geometry: collection,
  properties: {},
};

const _nestedCollection: GeometryCollection = {
  type: "GeometryCollection",
  // @ts-expect-error -- nesting GeometryCollections is not permitted
  geometries: [collection],
};

const _emptyCollection: GeometryCollection = {
  type: "GeometryCollection",
  geometries: [],
};

const pointFeature: Feature<Point<Position2D>> = {
  type: "Feature",
  geometry: two,
  properties: {},
};

const _pinnedFeatureCollection: FeatureCollection<Point<Position2D>> = {
  type: "FeatureCollection",
  features: [
    pointFeature,
    // @ts-expect-error -- pinned to Point<Position2D>, this feature's geometry is the wider default Point
    feature,
  ],
};

const _emptyFeatureCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const _featureCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [feature, emptyFeature],
};
