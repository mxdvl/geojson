import { assert, assertEquals } from "@std/assert";
import { parsePolygon, PolygonSchema } from "./polygon.ts";
import type { StandardSchemaV1 } from "./standard-schema.ts";

const square = {
	type: "Polygon",
	coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]]],
};

Deno.test("parses a valid polygon", () => {
	const result = parsePolygon(square);
	if (result.issues) throw new Error("expected success");
	assertEquals(result.value.type, "Polygon");
	assertEquals(result.value.coordinates.length, 1);
	assertEquals(result.value.coordinates[0]?.length, 5);
	assertEquals(result.value.coordinates[0]?.[2], [4, 4]);
});

Deno.test("deep-freezes the parsed value", () => {
	const result = parsePolygon(square);
	if (result.issues) throw new Error("expected success");
	assert(Object.isFrozen(result.value));
	assert(Object.isFrozen(result.value.coordinates));
	assert(Object.isFrozen(result.value.coordinates[0]));
	assert(Object.isFrozen(result.value.coordinates[0]![0]));
});

Deno.test("rejects an unclosed ring", () => {
	const result = parsePolygon({
		type: "Polygon",
		coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4]]], // 4 positions, but doesn't close
	});
	assert(result.issues);
	assertEquals(result.issues[0]?.message, "a ring's first and last position must be identical");
	assertEquals(result.issues[0]?.path, ["coordinates", 0]);
});

Deno.test("rejects a ring with fewer than 4 positions", () => {
	const result = parsePolygon({ type: "Polygon", coordinates: [[[0, 0], [4, 0], [0, 0]]] });
	assert(result.issues);
	assertEquals(result.issues[0]?.message, "expected a linear ring: 4 or more positions");
});

Deno.test("reports a precise path to a bad coordinate", () => {
	const result = parsePolygon({
		type: "Polygon",
		coordinates: [[[0, 0], [4, 0], [4, "four"], [0, 4], [0, 0]]],
	});
	assert(result.issues);
	assertEquals(result.issues[0]?.path, ["coordinates", 0, 2]);
});

Deno.test("collects every issue across rings, not just the first", () => {
	const result = parsePolygon({
		type: "Polygon",
		coordinates: [
			[[0, 0], [4, 0], [4, 4], [0, 4]], // unclosed
			[["bad"], [1, 0], [1, 1], [0, 1], [0, 0]], // malformed position
		],
	});
	assert(result.issues);
	assertEquals(result.issues.length, 2);
});

Deno.test("is a Standard Schema", () => {
	assertEquals(PolygonSchema["~standard"].version, 1);
	assertEquals(PolygonSchema["~standard"].vendor, "@mxdvl/geojson");
});

Deno.test("a generic Standard Schema consumer needs zero adapter code", async () => {
	const value = await standardValidate(PolygonSchema, square);
	assertEquals(value.coordinates.length, 1);
});

/** straight from https://standardschema.dev — any consumer can use a schema this way, no vendor-specific glue */
async function standardValidate<Output>(schema: StandardSchemaV1<unknown, Output>, input: unknown): Promise<Output> {
	const result = await schema["~standard"].validate(input);
	if (result.issues) throw new Error(result.issues.map((issue) => issue.message).join("; "));
	return result.value;
}
