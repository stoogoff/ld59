
import { Colour, Rectangle, Screen } from '/js/lib/index.js'
import { Fade } from '/js/sprites/index.js'

export class PhaseScreen extends Screen {
	#fade
	#cfg

	init(gfx, cfg) {
		this.#cfg = cfg

		const bounds = new Rectangle(0, 0, gfx.width, gfx.height)
		
		this.#fade = new Fade(bounds, new Colour(255, 0, 0))
		this.components.push(this.#fade)
	}

	update(time, controller) {
		super.update(time, controller)

		if(this.#fade.isComplete) {
			this.complete(this.#cfg)
		}
	}
}
