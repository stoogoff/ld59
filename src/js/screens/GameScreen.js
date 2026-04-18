
import { Camera, Point, Rectangle, Screen } from '/js/lib/index.js'
import { Home, Player, Token } from '/js/sprites/index.js'
import { getRandomInt } from '/js/lib/utils.js'

const VELOCITY = 10
const TOKEN_SCORE = 5

export class GameScreen extends Screen {
	#home
	#player
	#camera
	#tokens = []
	#pickedTokens = 0
	#countdown = 10000
	#nodeScore
	#nodeTimer

	init(gfx) {
		this.#nodeScore = document.getElementById('score')
		this.#nodeTimer = document.getElementById('timer')

		const bounds = new Rectangle(-100, -100, gfx.width + 100, gfx.height + 100)

		this.#camera = new Camera(new Point(0, 0), bounds, VELOCITY)
		this.#player = new Player(gfx.viewport.centroid, VELOCITY)
		this.#home = new Home(gfx.viewport.centroid)

		for(let i = 0; i < 10; i++) {
			this.#tokens.push(new Token(getRandomInt(bounds.x, bounds.w), getRandomInt(bounds.y, bounds.h)))
		}

		this.addComponents([this.#camera, this.#home, ...this.#tokens, this.#player])
	}

	update(time, controller) {
		super.update(time, controller)

		// token collision
		for(let i = 0; i < this.#tokens.length; i++) {
			if(!this.#tokens[i].canDraw) continue

			if(this.#player.hitTest(this.#tokens[i].bounds)) {
				this.#tokens[i].canDraw = false
				this.#pickedTokens++
			}
		}

		// player in home space
		if(!this.#player.hitTest(this.#home.bounds)) {
			this.#countdown -= time
		}

		// update HUD
		this.#nodeScore.innerHTML = `Tokens: ${this.#pickedTokens}`
		this.#nodeTimer.innerHTML = `Time: ${Math.floor(this.#countdown / 1000)}`

		if(this.#countdown <= 0) {
			console.log('game over')
		}
	}
}


	/*const tl = new Block(new Rectangle(10, 10, 100, 100))
	const tr = new Block(new Rectangle(gfx.width - 110, 10, 100, 100))
	const br = new Block(new Rectangle(gfx.width - 110, gfx.height - 110, 100, 100))
	const bl = new Block(new Rectangle(10, gfx.height - 110, 100, 100))

	
	const boundary = {
		canDraw: true,

		render(gfx) {
			const colour = new Colour(0, 0, 0, 1)

			gfx.draw(bounds, colour)
		},
	}*/