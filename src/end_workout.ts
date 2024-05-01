import type { LambdaFunctionURLResult } from 'aws-lambda'

export const endWorkout = async (): Promise<LambdaFunctionURLResult> => {
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Hello World',
		}),
	}
}
