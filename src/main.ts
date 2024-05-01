import type { Context, LambdaFunctionURLHandler, LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda'
import { match } from 'ts-pattern'
import { startWorkout } from './start_workout'
import { endWorkout } from './end_workout'

const METHOD_NOT_ALLOWED_RESPONSE = {
	statusCode: 405,
	body: JSON.stringify({
		message: 'Method Not Alowed',
	}),
};

const BAD_REQUEST_RESPONSE = {
	statusCode: 400,
	body: JSON.stringify({
		message: 'Bad Request',
	}),
};

const handler: LambdaFunctionURLHandler = async (event: LambdaFunctionURLEvent, _context: Context): Promise<LambdaFunctionURLResult> => {

	const method = event.requestContext.http.method;
	if (method !== 'POST') return METHOD_NOT_ALLOWED_RESPONSE;

	const kind = event.queryStringParameters?.kind;

	const response = match(kind)
		.with('start_workout', async () => await startWorkout())
		.with('end_workout', async () => await endWorkout())
		.otherwise(() => BAD_REQUEST_RESPONSE);

	return response;
}

exports.handler = handler
