
import { Colour, Controller, Graphics, Point, Rectangle, Screen, Timer } from '/js/lib/index.js'
import { Keys, noop } from '/js/lib/utils.js'

class Player {
	constructor(start) {
		this.rect = new Rectangle(start.x, start.y, 100, 100)
		this.colour = new Colour(0, 255, 0, 0.9)
	}

	update(time, controller) {
		if(controller.isKeyPressed(Keys.SPACE)) {
			this.colour = new Colour(0, 255, 255, 0.9)
		}
		else {
			this.colour = new Colour(0, 255, 0, 0.9)
		}

		if(controller.isKeyPressed(Keys.LEFT)) {
			this.rect.x -= 10
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.rect.x += 10
		}

		if(controller.isKeyPressed(Keys.UP)) {
			this.rect.y -= 10
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.rect.y += 10
		}
	}

	render(gfx) {
		gfx.fill(this.rect, this.colour)
	}
}

class Block {
	#rect

	constructor(rect) {
		this.#rect = rect
	}

	render(gfx) {
		const colour = new Colour(255, 0, 0, 0.9)

		gfx.fill(this.#rect, colour)			
	}
}

class Camera {
	#position
	#bounds
	#speed

	constructor(position, bounds, speed) {
		this.#position = position
		this.#bounds = bounds
		this.#speed = speed
	}

	update(time, controller) {
		if(controller.isKeyPressed(Keys.LEFT)) {
			this.#position.x -= this.#speed
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.#position.x += this.#speed
		}

		if(controller.isKeyPressed(Keys.UP)) {
			this.#position.y -= this.#speed
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.#position.y += this.#speed
		}
	}

	beforeRender(gfx) {
		gfx.context.save()
		gfx.context.translate(-this.#position.x, -this.#position.y)
	}

	afterRender(gfx) {
		gfx.context.restore()
	}
}


export const main = () => {
	const controller = new Controller()

	const gfx = new Graphics('canvas')
	const tl = new Block(new Rectangle(10, 10, 100, 100))
	const tr = new Block(new Rectangle(gfx.width - 110, 10, 100, 100))
	const br = new Block(new Rectangle(gfx.width - 110, gfx.height - 110, 100, 100))
	const bl = new Block(new Rectangle(10, gfx.height - 110, 100, 100))

	const bounds = new Rectangle(-100, -100, gfx.width + 100, gfx.height + 100)
	const boundary = {
		render(gfx) {
			const colour = new Colour(0, 0, 0, 1)

			gfx.draw(bounds, colour)
		}
	}

	const camera = new Camera(new Point(0, 0), bounds, 10)
	const player = new Player(gfx.viewport.centroid.subtract(50))

	let currentScreen = new Screen([camera, boundary, tr, tl, br, bl, player])

	// set up the game loop which will update the screen then render it
	// change screen to 
	const gameLoop = new Timer((time) => {
		currentScreen.update(time.elapsed, controller)
		currentScreen.render(gfx)
	}, 1000 / 60)

	document.addEventListener('keydown', (evt) => {
		controller.pressKey(evt.keyCode)
	})
	document.addEventListener('keyup', (evt) => {
		controller.releaseKey(evt.keyCode)
	})

	// after everything is set up
	gameLoop.start()
}
