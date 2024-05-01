import * as AWS from "aws-sdk";

AWS.config.update({
	region: "ap-northeast-1",
});

const lambda = new AWS.Lambda();

describe("Lambda単体のテスト", (): void => {
	test("正常なイベントがリクエストされた場合", async (): Promise<void> => {
		const testEvent = { id: 0, eventValue: "10" };
		const returnEvent = { returnValue: testEvent.eventValue };

		const result = await lambda
			.invoke({
				FunctionName: `handler-test`,
				InvocationType: "RequestResponse",
				Payload: JSON.stringify(testEvent),
			})
			.promise();

		if (result.Payload) {
			const payload = JSON.parse(result.Payload.toString());

			expect(payload).toHaveProperty("returnValue");
			expect(payload).toEqual(returnEvent);
		}
	});
});
