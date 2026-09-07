/** the [Standard Schema](https://standardschema.dev) interface, reproduced verbatim — it's designed to be copied, not installed */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
	readonly "~standard": {
		readonly version: 1;
		readonly vendor: string;
		readonly validate: (value: unknown) => StandardResult<Output> | Promise<StandardResult<Output>>;
		readonly types?: { readonly input: Input; readonly output: Output };
	};
}

export type StandardResult<Output> =
	| { readonly value: Output; readonly issues?: undefined }
	| { readonly issues: readonly StandardIssue[] };

export interface StandardIssue {
	readonly message: string;
	readonly path?: readonly PropertyKey[];
}
