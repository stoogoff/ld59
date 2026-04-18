
import {
	Controller,
	Keys,
	Graphics,
	Timer,
} from '/js/lib/index.js'
import { GameScreen, PauseScreen, PhaseScreen } from '/js/screens/index.js'

export const main = () => {
	const controller = new Controller()
	const gfx = new Graphics('canvas')

	const transitionManager = config => {
		gameLoop.stop()
		console.log(config)

		// TODO change the colour phase
		const nextScreen = currentScreen instanceof GameScreen
			? new PhaseScreen(transitionManager)
			: new GameScreen(transitionManager)

		currentScreen.destroy()
		currentScreen = null
		currentScreen = nextScreen
		currentScreen.init(gfx, config)

		gameLoop.start()
	}

	let currentScreen = new GameScreen(transitionManager)

	currentScreen.init(gfx, {
		currentScore: 0
	})

	// set up the game loop which will update the screen then render it
	// change screen for loading, menu, game over etc
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

	// after everything is set up
	gameLoop.start()
}
