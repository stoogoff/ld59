
import { Camera, Point, Rectangle, Screen } from '/js/lib/index.js'
import { Enemy, Home, Player, Token } from '/js/sprites/index.js'
import { getRandomInt } from '/js/lib/utils.js'

const VELOCITY = 10
const TOKEN_SCORE = 5

export class GameScreen extends Screen {
	#home
	#player
	#camera
	#tokens = []
	#enemies = []
	#pickedTokens = 0
	#score = 0
	#countdown = 10000
	#nodeScore
	#nodeTimer
	#nodeTokens

	init(gfx, cfg) {
		this.#score = cfg.currentScore
		this.#countdown = cfg.countdown

		this.#nodeScore = document.getElementById('score')
		this.#nodeTimer = document.getElementById('timer')
		this.#nodeTokens = document.getElementById('tokens')

		this.showHUD()

		const size = 1000
		const bounds = new Rectangle(-size, -size, gfx.width + size * 2, gfx.height + size * 2)

		gfx.background = cfg.colourPhase

		this.#camera = new Camera(new Point(0, 0), bounds, VELOCITY)
		this.#player = new Player(gfx.viewport.centroid, VELOCITY)
		this.#home = new Home(gfx.viewport.centroid)

		const tokenCount = getRandomInt(10, 50)

		for(let i = 0; i < tokenCount; i++) {
			this.#tokens.push(new Token(getRandomInt(bounds.x, bounds.w), getRandomInt(bounds.y, bounds.h)))
		}

		const enemyCount = getRandomInt(5, 20)

		for(let i = 0; i < enemyCount; i++) {
			this.#enemies.push(new Enemy(getRandomInt(bounds.x, bounds.w), getRandomInt(bounds.y, bounds.h)))
		}

		this.addComponents([
			this.#camera,
			this.#home,
			...this.#tokens,
			...this.#enemies,
			this.#player
		])
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
		if(this.#player.hitTest(this.#home.bounds)) {
			this.#score += this.#pickedTokens * TOKEN_SCORE
			this.#pickedTokens = 0
			this.#home.playerIsHome(true)
		}
		else {
			this.#home.playerIsHome(false)
		}

		this.#countdown -= time

		// update HUD
		this.#nodeTokens.innerHTML = `Tokens: ${this.#pickedTokens}`
		this.#nodeTimer.innerHTML = `Time: ${this.#countdown / 1000}`
		this.#nodeScore.innerHTML = `Score: ${this.#score}`

		// time has run out reset and start again
		if(this.#countdown <= 0) {
			this.hideHUD()
			this.complete({
				currentScore: this.#score
			})
		}
	}

	hideHUD() {
		document.getElementById('hud').classList.add('hidden')
	}

	showHUD() {
		document.getElementById('hud').classList.remove('hidden')
	}
}
