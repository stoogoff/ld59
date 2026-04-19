
import { Colour, Rectangle, Screen } from '../lib/index.js'
import { Fade } from '../sprites/index.js'

export class PhaseScreen extends Screen {
	#fade
	#cfg

	init(gfx, cfg) {
		this.#cfg = cfg

		const bounds = new Rectangle(0, 0, gfx.width, gfx.height)
		
		this.#fade = new Fade(bounds, cfg.colourPhase.colour)
		this.components.push(this.#fade)
	}

	update(time, controller) {
		super.update(time, controller)

		if(this.#fade.isComplete) {
			this.complete(this.#cfg)
		}
	}
}
