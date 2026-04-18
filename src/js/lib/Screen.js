
import { noop } from './utils.js'

// really an abstract class
// inherit from and define functions to implement game logic
// could store the node for the screen here and hide/show it when the screen is activated
export class Screen {
	#components = []
	#onComplete = noop

	constructor(onComplete, components = []) {
		this.#components = []
		this.#onComplete = onComplete
	}

	get components() {
		return this.#components
	}

	addComponents(components) {
		components.forEach(component => this.#components.push(component))
	}

	init(gfx) {}

	complete(config) {
		this.#onComplete(config)
	}

	update(time, controller) {
		this.#components.forEach(component => {
			if(component.canUpdate && component.update) {
				component.update(time, controller)
			}
		})
	}

	render(gfx) {
		gfx.begin()

		this.#components.forEach(component => {
			if(component.canDraw && component.beforeRender) {
				component.beforeRender(gfx)
			}
		})

		this.#components.forEach(component => {
			if(component.canDraw && component.render) {
				component.render(gfx)
			}
		})

		this.#components.forEach(component => {
			if(component.canDraw && component.afterRender) {
				component.afterRender(gfx)
			}
		})
	}

	destroy() {
		this.#components.forEach(component => {
			if(component.destroy) {
				component.destroy()
			}
		})

		this.#components = []
	}
}

