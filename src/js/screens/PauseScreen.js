
export class PauseScreen {
	#timer
	#node
	#isPaused = false

	constructor(timer) {
		this.#node = document.getElementById('pause')
		this.#timer = timer
	}

	toggle() {
		if(this.#isPaused) {
			this.#timer.start()
			this.#isPaused = false
			this.#node.classList.add('hidden')
		}
		else {
			this.#timer.stop()
			this.#isPaused = true
			this.#node.classList.remove('hidden')
		}
	}
}