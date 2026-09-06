import type { Position as _Position } from "geojson";
import type { Point, Position } from "./main.ts";

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
