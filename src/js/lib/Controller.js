
import { Keys, KeyState } from './utils.js'

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
