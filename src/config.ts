export interface Env {
	pixelaUsername: string;
	pixelaToken: string;
	pixelaGraphId: string;
}

export const configure = (): Env => {
	const pixelaUsername = process.env.PIXELA_USERNAME;
	const pixelaToken = process.env.PIXELA_TOKEN;
	const pixelaGraphId = process.env.PIXELA_GRAPH_ID;

	if (!pixelaUsername) {
		throw new Error('PIXELA_USERNAME is not defined');
	}

	if (!pixelaToken) {
		throw new Error('PIXELA_TOKEN is not defined');
	}

	if (!pixelaGraphId) {
		throw new Error('PIXELA_GRAPH_ID is not defined');
	}

	return { pixelaUsername, pixelaToken, pixelaGraphId };
}
