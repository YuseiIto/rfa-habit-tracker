import type { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
	put: {
		reqHeaders: {
			"X-USER-TOKEN": string;
		};
		reqBody: {
			quantity?: string;
			optionalData?: string;
		};
	};
}>;

