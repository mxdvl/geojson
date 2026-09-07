import type { Polygon, Position } from "./main.ts";
import type { StandardIssue, StandardResult, StandardSchemaV1 } from "./standard-schema.ts";

type Ring = Polygon["coordinates"][number];

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

function parsePosition(value: unknown, path: readonly PropertyKey[]): StandardResult<Position> {
	if (Array.isArray(value) && (value.length === 2 || value.length === 3) && value.every(isFiniteNumber)) {
		return { value: Object.freeze(value.slice()) as Position };
	}
	return { issues: [{ message: "expected a position: 2 or 3 finite numbers", path }] };
}

/** as per [§3.1.6](https://www.rfc-editor.org/info/rfc7946/#section-3.1.6): 4+ positions, first === last */
function parseRing(value: unknown, path: readonly PropertyKey[]): StandardResult<Ring> {
	if (!Array.isArray(value) || value.length < 4) {
		return { issues: [{ message: "expected a linear ring: 4 or more positions", path }] };
	}

	const issues: StandardIssue[] = [];
	const positions: Position[] = [];
	value.forEach((position, index) => {
		const result = parsePosition(position, [...path, index]);
		if (result.issues) issues.push(...result.issues);
		else positions.push(result.value);
	});
	if (issues.length > 0) return { issues };

	const [first, last] = [positions[0]!, positions.at(-1)!];
	if (first.length !== last.length || first.some((value, index) => value !== last[index])) {
		return { issues: [{ message: "a ring's first and last position must be identical", path }] };
	}

	return { value: Object.freeze(positions) as Ring };
}

export function parsePolygon(input: unknown): StandardResult<Polygon> {
	if (typeof input !== "object" || input === null || (input as { type?: unknown }).type !== "Polygon") {
		return { issues: [{ message: 'expected an object with type "Polygon"', path: [] }] };
	}

	const coordinates = (input as { coordinates?: unknown }).coordinates;
	if (!Array.isArray(coordinates)) {
		return { issues: [{ message: "expected an array of linear rings", path: ["coordinates"] }] };
	}

	const issues: StandardIssue[] = [];
	const rings: Ring[] = [];
	coordinates.forEach((ring, index) => {
		const result = parseRing(ring, ["coordinates", index]);
		if (result.issues) issues.push(...result.issues);
		else rings.push(result.value);
	});
	if (issues.length > 0) return { issues };

	return { value: Object.freeze({ type: "Polygon", coordinates: Object.freeze(rings) }) as Polygon };
}

export const PolygonSchema: StandardSchemaV1<unknown, Polygon> = {
	"~standard": { version: 1, vendor: "@mxdvl/geojson", validate: parsePolygon },
};
