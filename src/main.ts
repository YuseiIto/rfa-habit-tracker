import type { Context, LambdaFunctionURLHandler, LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda'


const handler: LambdaFunctionURLHandler = async (event: LambdaFunctionURLEvent, _context: Context): Promise<LambdaFunctionURLResult> => {

	const method = event.requestContext.http.method;


	const response: LambdaFunctionURLResult = {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Hello World',
		}),
	}

	return response
}

exports.handler = handler
