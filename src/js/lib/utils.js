
export const noop = () => {}

export const getRandomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export const clamp = (num, min, max) => {
	if(num > max) {
		num = max;
	}

	if(num < min) {
		num = min;
	}

	return num;
}

export const within = (num, min, max) =>
	num >= min && num <= max;
