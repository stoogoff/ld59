
import { Graphics, Screen, Timer } from '/js/lib/index.js'

const gfx = new Graphics('canvas')

let currentScreen = new Screen()

// set up the game loop which will update the screen then render it
// change screen to 
const gameLoop = new Timer((time) => {
	currentScreen.update(time.elapsed)
	gfx.begin()
	currentScreen.render(gfx)
}, 1000 / 60)


// after everything is set up
gameLoop.start()