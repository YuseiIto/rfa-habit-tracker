type ActionType = "start" | "end";

export interface OptionalData {
	type: ActionType;
	date: number; // Mills since epoch
}

export const isOptionalData = (arg: object): arg is OptionalData => {
	if (!["start", "end"].includes(arg.type)) {
		return false;
	}
	if (typeof arg.date !== "number") {
		return false;
	}
	return true;
};
