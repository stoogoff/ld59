
export const KEYS = {
	ENTER: 13,
	SPACE: 32,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	AUDIO: 77, // M
}

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

/*var viewport = new Rectangle(0, 0, 0);
export const viewport = () => {
	return viewport;
};*/