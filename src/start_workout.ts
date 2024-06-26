import aspida from "@aspida/axios";
import type { LambdaFunctionURLResult } from "aws-lambda";
import { format } from "date-fns";
import type { Env } from "./config";
import api from "./pixela/api/$api";
import type { OptionalData } from "./pixela/optional_data";

export const startWorkout = async (
	env: Env,
): Promise<LambdaFunctionURLResult> => {
	const client = api(aspida());
	const optionalData: OptionalData = { type: "start", date: Date.now() };

	await client.v1.users
		._username(env.pixelaUsername)
		.graphs._graphID(env.pixelaGraphId)
		.$post({
			headers: {
				"X-USER-TOKEN": env.pixelaToken,
			},
			body: {
				date: format(Date.now(), "yyyyMMdd"),
				optionalData: JSON.stringify(optionalData),
				quantity: "1",
			},
		})
		.catch((e) => {
			console.error("Failed to post pixel. Error: ", e);
			throw e;
		});

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "start workout",
		}),
	};
};
