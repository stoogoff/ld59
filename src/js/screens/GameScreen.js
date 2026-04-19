
import { Camera, Colour, Point, Rectangle, Screen } from '/js/lib/index.js'
import { Enemy, Home, Player, Token, ENEMY_AWARENESS } from '/js/sprites/index.js'
import { getRandomInt } from '/js/lib/utils.js'

const VELOCITY = 10
const TOKEN_SCORE = 5
const WORLD_SIZE = 600

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
	#imageManager

	constructor(onComplete, imageManager) {
		super(onComplete, [])

		this.#imageManager = imageManager
	}

	init(gfx, cfg) {
		this.#score = cfg.currentScore
		this.#countdown = cfg.countdown

		this.#nodeScore = document.getElementById('score')
		this.#nodeTimer = document.getElementById('timer')
		this.#nodeTokens = document.getElementById('tokens')

		this.showHUD()

		const bounds = new Rectangle(0, 0, gfx.width, gfx.height).grow(WORLD_SIZE)

		gfx.background = cfg.colourPhase.colour.copy(0.5)

		this.#camera = new Camera(new Point(0, 0), bounds, VELOCITY)
		this.#player = new Player(gfx.viewport.centroid, VELOCITY, this.#imageManager)
		this.#home = new Home(gfx.viewport.centroid)

		const tokenCount = getRandomInt(10, 50)

		for(let i = 0; i < tokenCount; i++) {
			this.#tokens.push(
				new Token(
					getRandomInt(bounds.x, bounds.w),
					getRandomInt(bounds.y, bounds.h),
					this.#imageManager.getImages('token-1.png', 'token-2.png', 'token-3.png')
				)
			)
		}

		// add debug enemies
		if(cfg.debug) {
			//this.#enemies.push(new Enemy(0, 0, this.#imageManager.getImage('monster-sprites-black.png'), true))
			//this.#enemies.push(new Enemy(0, 0, this.#imageManager.getImage('monster-sprites-blue.png')))
		}

		if(cfg.previousColourPhase) {
			const visibleEnemy = this.#imageManager.getImage(cfg.previousColourPhase.enemyImage)
			const hiddenEnemy = this.#imageManager.getImage('monster-sprites-black.png')

			const visibleEnemyCount = getRandomInt(5, 10)
			const hiddenEnemyCount = getRandomInt(1, 5)

			for(let i = 0; i < hiddenEnemyCount; i++) {
				this.#enemies.push(
					new Enemy(
						getRandomInt(bounds.x, bounds.w),
						getRandomInt(bounds.y, bounds.h),
						hiddenEnemy,
						true
					)
				)
			}

			for(let i = 0; i < visibleEnemyCount; i++) {
				this.#enemies.push(
					new Enemy(
						getRandomInt(bounds.x, bounds.w),
						getRandomInt(bounds.y, bounds.h),
						visibleEnemy
					)
				)
			}
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
			this.#enemies.forEach(enemy => {
				if(enemy.isFleeing) return

				enemy.setPlayerTarget(this.#player.bounds)
			})

			const closest = this.#tokens
				.filter(token => token.canDraw)
				.toSorted((a, b) => {
					a = a.bounds.centroid.distance(this.#player.bounds.centroid)
					b = b.bounds.centroid.distance(this.#player.bounds.centroid)

					return a === b ? 0 : (a < b ? -1 : 1)
				})
				.slice(0, 2)

			closest.forEach(token => token.setPlayerTarget(this.#player.bounds))

			this.#player.setPulseTargets([
				this.#home.bounds.centroid,
				...closest.map(token => token.bounds.centroid)
			])
		}

		let playerIsHome = false

		// player in home space
		if(this.#player.collision(this.#home.bounds)) {
			this.#score += this.#pickedTokens * TOKEN_SCORE
			this.#pickedTokens = 0

			playerIsHome = true
		}

		this.#home.playerIsHome(playerIsHome)
		this.#countdown -= time

		let isHit = false

		// player is safe in home space, otherwise collision enemies
		// and attract close enemies
		if(!playerIsHome) {
			let alertCount = 0

			for(let i = 0; i < this.#enemies.length; i++) {
				const enemy = this.#enemies[i]

				if(this.#player.collision(enemy.bounds)) {
					isHit = true
					break
				}

				const distance = this.#player.bounds.centroid.distance(enemy.bounds.centroid)

				if(distance < ENEMY_AWARENESS && !enemy.isFleeing) {
					enemy.setPlayerTarget(this.#player.bounds)
					++alertCount
				}
			}

			this.#player.setEnemiesAlert(alertCount > 0)
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
