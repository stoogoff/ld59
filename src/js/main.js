
import { Colour, Controller, Keys, Graphics, Timer } from '/js/lib/index.js'
import { getRandomInt } from '/js/lib/utils.js'
import { GameScreen, PauseScreen, PhaseScreen } from '/js/screens/index.js'
import { Cycle } from '/js/helpers/Cycle.js'

export const main = () => {
	const controller = new Controller()
	const gfx = new Graphics('canvas')
	const colourPhases = new Cycle([
		new Colour(44, 122, 36),
		new Colour(235, 72, 121),
		new Colour(50, 85, 209),
	])

	const transitionManager = config => {
		gameLoop.stop()

		const nextScreen = currentScreen instanceof GameScreen
			? new PhaseScreen(transitionManager)
			: new GameScreen(transitionManager)

		if(nextScreen instanceof PhaseScreen) {
			// change the colour phase
			config.colourPhase = colourPhases.next()
		}

		config.countdown = getRandomInt(5, 12) * 1000

		currentScreen.destroy()
		currentScreen = null
		currentScreen = nextScreen
		currentScreen.init(gfx, config)

		gameLoop.start()
	}

	let currentScreen = new GameScreen(transitionManager)

	currentScreen.init(gfx, {
		currentScore: 0,
		colourPhase: colourPhases.next(),
		countdown: getRandomInt(5, 12) * 1000,
	})

	// set up the game loop which will update the screen then render it
	const gameLoop = new Timer((time) => {
		if(!currentScreen) {
			gameLoop.stop()
			throw new Error('Screen not loaded')
		}

		currentScreen.update(time.elapsed, controller)
		currentScreen.render(gfx)
	}, 1000 / 60)

	const pauseScreen = new PauseScreen(gameLoop)

	// register keyboard events
	document.addEventListener('keydown', (evt) => {
		controller.pressKey(evt.keyCode)

		if(controller.isKeyPressed(Keys.PAUSE)) {
			pauseScreen.toggle()
		}
	})
	document.addEventListener('keyup', (evt) => {
		controller.releaseKey(evt.keyCode)
	})

	// after everything is set up start
	gameLoop.start()
}
