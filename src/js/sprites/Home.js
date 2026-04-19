
import { Colour, Interval, Point, Rectangle, Sprite } from '/js/lib/index.js'
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

	// override collision to use circle geometry
	collision(target) {
		const dx = this.bounds.centroid.x - target.centroid.x
		const dy = this.bounds.centroid.y - target.centroid.y
		const distance = Math.sqrt(dx * dx + dy * dy)

		return distance < (this.bounds.w / 2) + Math.min(target.w, target.h) / 2
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
			if(this.collision(enemies[i].bounds)) {
				const distance = home.distance(enemies[i].bounds.centroid)
				const point = home
					.subtract(enemies[i].bounds.centroid)
					.divide(distance)
					.multiply(getRandomInt(75, 100))

				enemies[i].setFleeTarget(enemies[i].bounds.centroid.subtract(point))
			}
		}
	}

	update(elapsed, controller) {
		if(this.#fade) {
			this.#colour = this.#colour.copy(1 - (this.#fade.elapsed / this.#fade.span))

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