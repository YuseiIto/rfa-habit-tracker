import type { LambdaFunctionURLResult } from 'aws-lambda'
export const startWorkout = async (): Promise<LambdaFunctionURLResult> => {
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'start workout',
		}),
	}
}
