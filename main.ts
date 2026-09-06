/** Coordinates with either 2 or 3 dimensions, as per [§3.1.1](https://www.rfc-editor.org/info/rfc7946/#section-3.1.1) */
export type Position =
  | readonly [longitude: number, latitude: number]
  | readonly [longitude: number, latitude: number, altitude: number];

/**
 * Bounding box as per [§5](https://www.rfc-editor.org/info/rfc7946/#section-5)
 */
export type BBox =
  | readonly [
    west: number,
    south: number,
    east: number,
    north: number,
  ]
  | readonly [
    west: number,
    south: number,
    east: number,
    north: number,
    bottom: number,
    top: number,
  ];

/**
 * The base GeoJSON object as per [§3](https://www.rfc-editor.org/info/rfc7946/#section-3).
 */
export interface GeoJsonObject {
  /**
   * Specifies the type of GeoJSON object.
   */
  readonly type: GeoJsonTypes;
  /**
   * Optional bounding box as per [§5](https://www.rfc-editor.org/info/rfc7946/#section-5).
   */
  readonly bbox?: BBox;
}

export type GeoJsonTypes = GeoJSON["type"];

export type GeoJSON = Geometry;

/**
 * as per [§3.1](https://www.rfc-editor.org/info/rfc7946/#section-3.1).
 */
export type Geometry = Point;

/**
 * as per [§3.1.2](https://www.rfc-editor.org/info/rfc7946/#section-3.1.2).
 */
export interface Point extends GeoJsonObject {
  readonly type: "Point";
  readonly coordinates: Position;
}
