
export const Keys = {
	ENTER: 13,
	SPACE: 32,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	AUDIO: 77, // M for Mute
	PAUSE: 80, // P for Pause
}

export const KeyState = {
	DOWN: true,
	UP: false,
}

export class Controller {
	#keyState = {}

	constructor() {
		Object.keys(Keys).forEach(key => this.#keyState[Keys[key]] = KeyState.UP)
	}

	pressKey(keyCode) {
		if(keyCode in this.#keyState) {
			this.#keyState[keyCode] = KeyState.DOWN
		}
	}

	releaseKey(keyCode) {
		if(keyCode in this.#keyState) {
			this.#keyState[keyCode] = KeyState.UP
		}
	}

	isKeyPressed(keyCode) {
		return keyCode in this.#keyState ? this.#keyState[keyCode] : false
	}
}
