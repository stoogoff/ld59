
import {
	Controller,
	Keys,
	Graphics,
	Timer,
} from '/js/lib/index.js'
import { Block, Home, Player, Token } from '/js/sprites/index.js'
import { GameScreen, PauseScreen } from '/js/screens/index.js'

export const main = () => {
	const controller = new Controller()
	const gfx = new Graphics('canvas')

	let currentScreen = new GameScreen()

	currentScreen.init(gfx)

	// set up the game loop which will update the screen then render it
	// change screen for loading, menu, game over etc
	const gameLoop = new Timer((time) => {
		currentScreen.update(time.elapsed, controller)
		currentScreen.render(gfx)
	}, 1000 / 60)

	const pauseScreen = new PauseScreen(gameLoop)

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
