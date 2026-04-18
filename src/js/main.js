
import {
	Camera,
	Colour,
	Controller,
	Graphics,
	Point,
	Rectangle,
	Screen,
	Timer,
} from '/js/lib/index.js'
import { getRandomInt } from '/js/lib/utils.js'
import { Block, Home, Player, Token } from '/js/sprites/index.js'

export const main = () => {
	const controller = new Controller()

	const gfx = new Graphics('canvas')
	const tl = new Block(new Rectangle(10, 10, 100, 100))
	const tr = new Block(new Rectangle(gfx.width - 110, 10, 100, 100))
	const br = new Block(new Rectangle(gfx.width - 110, gfx.height - 110, 100, 100))
	const bl = new Block(new Rectangle(10, gfx.height - 110, 100, 100))

	const bounds = new Rectangle(-100, -100, gfx.width + 100, gfx.height + 100)
	const boundary = {
		canDraw: true,

		render(gfx) {
			const colour = new Colour(0, 0, 0, 1)

			gfx.draw(bounds, colour)
		},
	}

	const camera = new Camera(new Point(0, 0), bounds, 10)
	const player = new Player(gfx.viewport.centroid, 10)
	const home = new Home(gfx.viewport.centroid)
	const tokens = []

	for(let i = 0; i < 10; i++) {
		tokens.push(new Token(getRandomInt(-200, gfx.width), getRandomInt(-200, gfx.height)))
	}

	let currentScreen = new Screen([camera, home, boundary, tr, tl, br, bl, ...tokens, player])

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
