
import { Colour, Interval, Rectangle, Sprite } from '/js/lib/index.js'
import { getRandomInt } from '/js/lib/utils.js'

export class Home extends Sprite {
	#colour = new Colour(118, 240, 42, 1)
	#fade

	canDraw = true
	canUpdate = true

	constructor(position) {
		const centre = position.subtract(100)

		super(new Rectangle(centre.x, centre.y, 200, 200))
	}

	playerIsHome(is) {
		if(is) {
			this.canDraw = true
			this.#fade = null
			this.#colour = this.#colour.copy(1)
		}
		else if(this.#fade === null) {
			this.#fade = new Interval(500)
		}
	}

	// repulse  enemies away from home
	repulseEnemies(enemies) {
		const home = this.bounds.centroid

		for(let i = 0; i < enemies.length; i++) {
			if(this.collision(enemies[i].bounds.grow(50))) {
				let point = home.subtract(enemies[i].bounds.centroid)
				const distance = Math.hypot(point.x, point.y)

				point = point.divide(distance).multiply(getRandomInt(75, 125))

				enemies[i].setFleeTarget(point)
			}
		}
	}

	update(elapsed, controller) {
		if(this.#fade) {
			this.#colour = this.#colour.copy(1 - (this.#fade.elapsed / 500))

			if(this.#fade.next(elapsed)) {
				this.canDraw = false
				this.#fade = null
			}
		}
	}

	render(gfx) {
		gfx.fillCircle(this.bounds, this.#colour)
	}
}