import type { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
	get: {
		reqHeaders: {
			"X-USER-TOKEN": string;
		};
		resBody: {
			date: string;
			quantity: number;
			optionalData: string;
		};
	};
}>;
