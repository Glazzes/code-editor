export const convertFakeTimeToText = (fakeTime: number) => {
	if(fakeTime < 1000) {
		return `${Math.floor(fakeTime)} ms`;
	}

	const seconds = (fakeTime / 1000).toFixed(1);
	return `${seconds} s`
}
