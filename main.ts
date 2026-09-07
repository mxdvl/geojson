export type Position2D = readonly [
  longitude: number,
  latitude: number,
];

export type Position3D = readonly [
  longitude: number,
  latitude: number,
  altitude: number,
];

/** Coordinates with either 2 or 3 dimensions, as per [§3.1.1](https://www.rfc-editor.org/info/rfc7946/#section-3.1.1) */
export type Position = Position2D | Position3D;

export type BBox2D = readonly [
  west: number,
  south: number,
  east: number,
  north: number,
];
export type BBox3D = readonly [
  west: number,
  south: number,
  east: number,
  north: number,
  bottom: number,
  top: number,
];

/**
 * Bounding box as per [§5](https://www.rfc-editor.org/info/rfc7946/#section-5)
 */
export type BBox<P extends Position = Position> = P extends Position2D ? BBox2D
  : BBox3D;

/**
 * The base GeoJSON object as per [§3](https://www.rfc-editor.org/info/rfc7946/#section-3).
 */
export interface GeoJsonObject<P extends Position = Position> {
  /**
   * Specifies the type of GeoJSON object.
   */
  readonly type: GeoJsonTypes;
  /**
   * Optional bounding box as per [§5](https://www.rfc-editor.org/info/rfc7946/#section-5).
   */
  readonly bbox?: BBox<P>;
}

export type GeoJsonTypes = GeoJSON["type"];

export type GeoJSON<P extends Position = Position> = Geometry<P> | GeometryCollection<P>;

/**
 * as per [§3.1](https://www.rfc-editor.org/info/rfc7946/#section-3.1),
 * excluding {@link GeometryCollection} — see {@link GeoJSON} for the full union
 */
export type Geometry<P extends Position = Position> =
  | Point<P>
  | MultiPoint<P>
  | LineString<P>
  | MultiLineString<P>
  | Polygon<P>
  | MultiPolygon<P>;

/**
 * as per [§3.1.2](https://www.rfc-editor.org/info/rfc7946/#section-3.1.2)
 */
export interface Point<P extends Position = Position> extends GeoJsonObject<P> {
  readonly type: "Point";
  readonly coordinates: P;
}

/**
 * as per [§3.1.3](https://www.rfc-editor.org/info/rfc7946/#section-3.1.3)
 */
export interface MultiPoint<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "MultiPoint";
  readonly coordinates: readonly P[];
}

/**
 * as per [§3.1.4](https://www.rfc-editor.org/info/rfc7946/#section-3.1.4)
 */
export interface LineString<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "LineString";
  readonly coordinates: readonly [P, P, ...P[]];
}

/**
 * as per [§3.1.5](https://www.rfc-editor.org/info/rfc7946/#section-3.1.5)
 */
export interface MultiLineString<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "MultiLineString";
  readonly coordinates: readonly LineString<P>["coordinates"][];
}

/** the first and last value must be identical, follows right-hand rule */
type LinearRing<P extends Position = Position> = readonly [P, P, P, P, ...P[]];

/**
 * as per [§3.1.6](https://www.rfc-editor.org/info/rfc7946/#section-3.1.6)
 */
export interface Polygon<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "Polygon";
  /** the first {@link LinearRing} must be an outer counterclockwise ring, the rest are inner clockwise rings */
  readonly coordinates: readonly LinearRing<P>[];
}

/**
 * as per [§3.1.7](https://www.rfc-editor.org/info/rfc7946/#section-3.1.7)
 */
export interface MultiPolygon<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "MultiPolygon";
  readonly coordinates: readonly Polygon<P>["coordinates"][];
}

/**
 * as per [§3.1.8](https://www.rfc-editor.org/info/rfc7946/#section-3.1.8),
 * nesting collections is discouraged by spec, and not permitted here
 */
export interface GeometryCollection<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "GeometryCollection";
  readonly geometries: readonly Geometry<P>[];
}
