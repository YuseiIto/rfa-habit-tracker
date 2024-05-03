import aspida from "@aspida/axios";
import type { LambdaFunctionURLResult } from "aws-lambda";
import { format, parse } from "date-fns";
import type { Env } from "./config";
import api from "./pixela/api/$api";
import { OptionalData, isOptionalData } from "./pixela/optional_data";

const DEFAULT_QUANTITY = 10; // 10 minutes

const putWorkoutWithQuantity = async (
	env: Env,
	date: Date,
	quantity: number,
) => {
	const client = api(aspida());

	await client.v1.users
		._username(env.pixelaUsername)
		.graphs._graphID(env.pixelaGraphId)
		._yyyyMMdd(format(date, "yyyyMMdd"))
		.$put({
			headers: {
				"X-USER-TOKEN": env.pixelaToken,
			},
			body: {
				quantity: Math.round(quantity).toString(),
				optionalData: JSON.stringify({ type: "end", date: date.getTime() }),
			},
		})
		.catch((e) => {
			console.error("Failed to put pixel.");
			throw e;
		});
};

const putDefaultWorkout = async (env: Env, date: Date) => {
	await putWorkoutWithQuantity(env, date, DEFAULT_QUANTITY);
};

export const endWorkout = async (
	env: Env,
): Promise<LambdaFunctionURLResult> => {
	console.log("EndWorkout called");

	const client = api(aspida());

	const res = await client.v1.users
		._username(env.pixelaUsername)
		.graphs._graphID(env.pixelaGraphId)
		.latest.get({
			headers: {
				"X-USER-TOKEN": env.pixelaToken,
			},
		})
		.catch((e) => {
			if (e.status !== 404) {
				console.warn("Latest pixel not found. (404)");
				return { status: 404, body: null };
			}

			console.error("Failed to get latest pixel. ");
			throw e;
		});

	if (res.status !== 200) {
		// Maybe start pixel is not posted somehow
		console.error(
			"No last pixel found. Maybe start pixel is not posted. Fixing...",
		);
		await putDefaultWorkout(env, new Date());
	} else {
		const latest = res.body;
		const payload = JSON.parse(latest.optionalData);

		if (!isOptionalData(payload)) {
			console.error("payload is not an instance of OptionalData. ", payload);
			throw new Error("payload is not an instance of OptionalData.");
		}

		const date = new Date(payload.date);
		const diff_ms = new Date().getTime() - payload.date;

		if (payload.type === "start") {
			// Maybe start pixel is not posted somehow
			if (diff_ms > 24 * 60 * 60 * 1000) {
				console.warn(
					"The last pixel is 'start', but it's older than 24 hours. Fixing...",
				);

				// Finalize last workout with default quantity because it's too old and actual end time is unknown
				await putDefaultWorkout(env, date);

				// Place today's pixel with default quantity. Its actual start time is unknown.
				await putDefaultWorkout(env, new Date());
			} else {
				console.log("Valid endWorkout is found. Finalizing Workout...");
				const quantity = diff_ms / 1000 / 60;
				console.log("Quantity: ", quantity);
				await putWorkoutWithQuantity(env, date, quantity);
			}
		} else if (payload.type === "end") {
			if (diff_ms < 60 * 1000) {
				console.warn(
					"EndWorkout posted within 60 seconds. Maybe it's called twice. Ignoring",
				);
			} else {
				console.warn(
					"EndWorkout requested, but the latest pixel is 'end'. So the quantity will be set to default...",
				);
				await putDefaultWorkout(env, new Date());
			}
		} else {
			console.error("Unknown type of pixel is found. Fixing...");
			return {
				statusCode: 412,
				body: JSON.stringify({
					message: "End Workout",
				}),
			};
		}
	}

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "End Workout",
		}),
	};
};
