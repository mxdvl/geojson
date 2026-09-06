import type { Position as _Position } from "geojson";
import type { Point, Position, Position2D, Position3D } from "./main.ts";

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
