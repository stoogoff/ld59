
import { Colour, Controller, Keys, Graphics, Timer } from '/js/lib/index.js'
import { getRandomInt } from '/js/lib/utils.js'
import { GameScreen, PauseScreen, PhaseScreen } from '/js/screens/index.js'
import { ImageManager } from '/js/helpers/ImageManager.js'
import { Cycle } from '/js/helpers/Cycle.js'

export const main = () => {
	const imageManager = new ImageManager('/img/', [
		'lightning-sprites.png',
		'monster-sprites-black.png',
		'monster-sprites-blue.png',
		'monster-sprites-green.png',
		'monster-sprites-red.png',
		'player-sprites.png',
		'token-1.png',
		'token-2.png',
		'token-3.png',
	])

	imageManager.init(() => {
		console.log('Ready')
	})

	const controller = new Controller()
	const gfx = new Graphics('canvas')
	const colourPhases = new Cycle([
		{
			colour: new Colour(44, 122, 36),
			enemyImage: 'monster-sprites-green.png',
		},
		{
			colour: new Colour(235, 72, 121),
			enemyImage: 'monster-sprites-red.png',
		},
		{
			colour: new Colour(50, 85, 209),
			enemyImage: 'monster-sprites-blue.png',
		},
	])

	const transitionManager = config => {
		gameLoop.stop()

		const nextScreen = currentScreen instanceof GameScreen
			? new PhaseScreen(transitionManager)
			: new GameScreen(transitionManager, imageManager)

		// keep the last colour phase as enemies will be that 
		config.previousColourPhase = colourPhases.current

		if(nextScreen instanceof PhaseScreen) {
			// change the colour phase
			config.colourPhase = colourPhases.next()
		}

		config.countdown = getRandomInt(10, 20) * 1000

		currentScreen.destroy()
		currentScreen = null
		currentScreen = nextScreen
		currentScreen.init(gfx, config)

		gameLoop.start()
	}

	let currentScreen = new GameScreen(transitionManager, imageManager)

	currentScreen.init(gfx, {
		currentScore: 0,
		colourPhase: colourPhases.next(),
		previousColourPhase: null,
		countdown: 10000, // should be short for first run through
		debug: true,
	})

	// DEBUG
	/*currentScreen.init(gfx, {
		currentScore: 0,
		colourPhase: colourPhases.next(),
		previousColourPhase: colourPhases.current,//null,
		countdown: 60000, // should be short for first run through
		debug: true,
	})*/

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
