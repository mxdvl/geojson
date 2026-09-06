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

export type GeoJSON<P extends Position = Position> = Geometry<P>;

/**
 * as per [§3.1](https://www.rfc-editor.org/info/rfc7946/#section-3.1).
 */
export type Geometry<P extends Position = Position> = Point<P> | MultiPoint<P>;

/**
 * as per [§3.1.2](https://www.rfc-editor.org/info/rfc7946/#section-3.1.2).
 */
export interface Point<P extends Position = Position> extends GeoJsonObject<P> {
  readonly type: "Point";
  readonly coordinates: P;
}

/**
 * as per [§3.1.3](https://www.rfc-editor.org/info/rfc7946/#section-3.1.3).
 */
export interface MultiPoint<P extends Position = Position>
  extends GeoJsonObject<P> {
  readonly type: "MultiPoint";
  readonly coordinates: readonly P[];
}
