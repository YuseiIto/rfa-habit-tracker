import type { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
	post: {
		reqHeaders: {
			"X-USER-TOKEN": string;
		};
		reqBody: {
			date: string;
			quantity: string;
			optionalData: string;
		};
	};
}>;
