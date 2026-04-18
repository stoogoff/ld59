
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
	#walls = []
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

		if(cfg.previousColourPhase) {
			const visibleEnemyCount = getRandomInt(5, 10)
			const hiddenEnemyCount = getRandomInt(1, 5)

			/*for(let i = 0; i < visibleEnemyCount; i++) {
				this.#enemies.push(
					new Enemy(
						getRandomInt(bounds.x, bounds.w),
						getRandomInt(bounds.y, bounds.h),
						cfg.previousColourPhase
					)
				)
			}

			for(let i = 0; i < hiddenEnemyCount; i++) {
				this.#enemies.push(
					new Enemy(
						getRandomInt(bounds.x, bounds.w),
						getRandomInt(bounds.y, bounds.h),
						cfg.colourPhase
					)
				)
			}*/

			this.#enemies.push(
					new Enemy(
						0,
						0,
						cfg.previousColourPhase
					)
				)
		}

		this.addComponents([
			this.#camera,
			this.#home,
			...this.#tokens,
			...this.#enemies,
			this.#player,
		])
	}

	update(time, controller) {
		super.update(time, controller)

		// token collision
		for(let i = 0; i < this.#tokens.length; i++) {
			if(!this.#tokens[i].canDraw) continue

			if(this.#player.collision(this.#tokens[i].bounds)) {
				this.#tokens[i].canDraw = false
				this.#pickedTokens++
			}
		}

		// the player has sent out a signal attracting all enemies
		if(this.#player.isPulsing) {
			this.#enemies.forEach(enemy => enemy.setPlayerTarget(this.#player.bounds))

			const closest = this.#tokens
				.filter(token => token.canDraw)
				.toSorted((a, b) => {
					a = a.bounds.centroid.distance(this.#player.bounds.centroid)
					b = b.bounds.centroid.distance(this.#player.bounds.centroid)

					return a === b ? 0 : (a < b ? -1 : 1)
				})

			this.#player.setPulseTargets([
				this.#home.bounds.centroid,
				...closest.slice(0, 2).map(token => token.bounds.centroid)
			])
		}

		// TODO enemies which are close to the play should target it, not just during pulse

		let playerIsHome = false

		// player in home space
		if(this.#player.collision(this.#home.bounds)) {
			this.#score += this.#pickedTokens * TOKEN_SCORE
			this.#pickedTokens = 0

			playerIsHome = true
		}

		this.#home.playerIsHome(playerIsHome)
		this.#countdown -= time

		// player is safe in home space, otherwise collision enemies
		let isHit = false

		if(!playerIsHome) {
			for(let i = 0; i < this.#enemies.length; i++) {
				if(this.#player.collision(this.#enemies[i].bounds)) {
					isHit = true
					break
				}
			}
		}

		// repulse enemies from home space
		this.#home.repulseEnemies(this.#enemies)

		// time has run out or the player has been hit, so reset and start again
		if(this.#countdown <= 0 || isHit) {
			this.hideHUD()
			this.complete({
				currentScore: this.#score,
			})
		}

		// update HUD
		this.#nodeTokens.innerHTML = `Tokens: ${this.#pickedTokens}`
		this.#nodeTimer.innerHTML = `Time: ${this.#countdown / 1000}`
		this.#nodeScore.innerHTML = `Score: ${this.#score}`
	}

	hideHUD() {
		document.getElementById('hud').classList.add('hidden')
	}

	showHUD() {
		document.getElementById('hud').classList.remove('hidden')
	}
}
