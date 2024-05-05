const gsap = null
const bulmaToast = null
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const timeEl = document.querySelector<HTMLSpanElement>('#timeEl')
const scoreEl = document.querySelector<HTMLSpanElement>('#scoreEl')
const statusEl = document.querySelector<HTMLSpanElement>('#statusEl')
const startGameBtn =
  document.querySelector<HTMLButtonElement>('#startGameElBtn')
const modalEl = document.querySelector<HTMLDivElement>('#modalEl')
const bigScoreEl = document.querySelector<HTMLHeadElement>('#bigScoreEl')
const exportGameElBtn =
  document.querySelector<HTMLButtonElement>('#exportGameElBtn')
const exportAnswerEl = document.querySelector('#exportAnswerEl')
const answerFromEl = document.querySelector('#answerFromEl')
const submitGameElBtn = document.querySelector('#submitGameElBtn')
const submitFormEl = document.querySelector('#submitFormEl')
const submitAnswerEl = document.querySelector('#submitAnswerEl')
const submitBtnEl = document.querySelector('#submitBtnEl')
class Player {
  x: number
  y: number
  radius: number
  color: string | CanvasGradient | CanvasPattern

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string | CanvasGradient | CanvasPattern
  ) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

class Projectile {
  time: Date
  x: number
  y: number
  radius: number
  color: string | CanvasGradient | CanvasPattern
  velocity: { x: number; y: number }
  constructor(time, x, y, radius, color, velocity) {
    this.time = time
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Enemy {
  time: Date
  point: number
  x: number
  y: number
  radius: number
  color: string | CanvasGradient | CanvasPattern
  velocity: { x: number; y: number }
  constructor(time, x, y, radius, color, velocity, point) {
    this.time = time
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.point = point
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const friction = 0.99

class Particle {
  time: Date
  x: number
  y: number
  radius: number
  color: string | CanvasGradient | CanvasPattern
  velocity: { x: number; y: number }
  alpha: number

  constructor(time, x, y, radius, color, velocity) {
    this.time = time
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }
  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

class Ans {
  time: Date
  x: number
  y: number

  constructor(time, x, y) {
    this.time = time
    this.x = x
    this.y = y
  }

  toJSON() {
    return { time: this.time, x: this.x, y: this.y }
  }
}

class Submittion {
  time: Date
  x: number
  y: number

  velocity: { x: number; y: number }
  constructor(time, x, y) {
    this.time = time
    this.x = x
    this.y = y
  }

  toJSON() {
    return { time: this.time, x: this.x, y: this.y }
  }
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, 'white')
let projectiles = []
let enemies = []
let particles = []
let answer = []
let submittion = []
let gameState = false
let time = new Date()
let prevtime = 0

function init() {
  gameState = true
  time = new Date()
  player = new Player(x, y, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  answer = []
  score = 0
  scoreEl.innerHTML = score.toString()
  statusEl.innerHTML = 'Ready!'
  ;(<HTMLElement>statusEl).style.backgroundColor = 'rgb(34 197 94)'
  bigScoreEl.innerHTML = score.toString()
  prevtime = 0
}

function spawnEnemies() {
  setInterval(() => {
    const time1 = new Date()
    const radius = Math.random() * (30 - 4) + 4
    let x = 0
    let y = 0
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = canvas.height * Math.random()
    } else {
      x = canvas.width * Math.random()
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }
    const point = Math.floor(1000 * Math.random())
    enemies.push(
      new Enemy(
        (time1.getTime() - time.getTime()) / 1000,
        x,
        y,
        radius,
        color,
        velocity,
        point
      )
    )
  }, 100)
}

let animationId = null
let score = 0
function updateParticles() {
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })
}

function updateProjectiles() {
  projectiles.forEach((projectile, index) => {
    projectile.update()
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x + projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })
}

function checkCollision(projectile, enemy, enemyIndex, projectileIndex) {
  const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
  if (dist - enemy.radius - projectile.radius < 1) {
    handleCollision(projectile, enemy, enemyIndex, projectileIndex)
  }
}

function handleCollision(projectile, enemy, enemyIndex, projectileIndex) {
  for (let i = 0; i < enemy.radius * 2; ++i) {
    particles.push(
      new Particle(
        projectile.time,
        projectile.x,
        projectile.y,
        3,
        enemy.color,
        {
          x: (Math.random() - 0.5) * (Math.random() * 5),
          y: (Math.random() - 0.5) * (Math.random() * 5)
        }
      )
    )
  }
  if (enemy.radius - 10 > 10) {
    score += 100
    scoreEl.innerHTML = score.toString()
    gsap.to(enemy, { radius: enemy.radius - 10 })
    setTimeout(() => {
      projectiles.splice(projectileIndex, 1)
    }, 0)
  } else {
    score += enemy.point
    scoreEl.innerHTML = score.toString()
    setTimeout(() => {
      enemies.splice(enemyIndex, 1)
      projectiles.splice(projectileIndex, 1)
    }, 0)
  }
}

function updateEnemies() {
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (dist - enemy.radius - player.radius < 1) {
      gameState = false
      bigScoreEl.innerHTML = score.toString()
    }
    projectiles.forEach((projectile, projectileIndex) => {
      checkCollision(projectile, enemy, enemyIndex, projectileIndex)
    })
  })
}

function animate() {
  const time1 = (new Date().getTime() - time.getTime()) / 1000
  if (prevtime + 1 <= time1 || prevtime === 0) {
    statusEl.innerHTML = 'Ready!'
    statusEl.style.backgroundColor = 'rgb(34 197 94)'
  }
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0,0,0,0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  updateParticles()
  updateProjectiles()
  updateEnemies()
  timeEl.innerHTML = time1.toString()
}

canvas.addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.offsetY - canvas.height / 2,
    event.offsetX - canvas.width / 2
  )
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }
  const time1 = (new Date().getTime() - time.getTime()) / 1000

  if (prevtime === 0 || prevtime + 1 <= time1) {
    projectiles.push(
      new Projectile(
        time1,
        canvas.width / 2,
        canvas.height / 2,
        5,
        'white',
        velocity
      )
    )
    prevtime = time1
    if (gameState === true) {
      answer.push(JSON.stringify(new Ans(time1, velocity.x, velocity.y)))
    }
    statusEl.innerHTML = 'Reloading...'
    ;(<HTMLElement>statusEl).style.backgroundColor = 'rgb(239 68 68)'
    bulmaToast.toast({
      message: `Success ${JSON.stringify(
        new Ans(time1, velocity.x, velocity.y)
      )}`,
      type: 'is-success',
      dismissible: true,
      pauseOnHover: true,
      duration: 1000,
      animate: { in: 'fadeIn', out: 'fadeOut' },
      position: 'bottom-center'
    })
    console.log(
      `Success ${JSON.stringify(new Ans(time1, velocity.x, velocity.y))}`
    )
  }

  console.log(`projectiles = ${JSON.stringify(projectiles)}`)
})

function checkBullet() {
  const timer = setInterval(() => {
    if (gameState === false) {
      clearInterval(timer)
    }
    const time1 = (new Date().getTime() - time.getTime()) / 1000
    submittion.forEach((p, i) => {
      {
        console.log(`canvasw = ${canvas.width / 2}`)
        projectiles.push(
          new Projectile(
            p.time,
            canvas.width / 2 + p.x * (time1 - p.time),
            canvas.height / 2 + p.y * (time1 - p.time),
            5,
            'white',
            { x: p.x, y: p.y }
          )
        )
        answer.push(JSON.stringify(new Ans(p.time, p.x, p.y)))
        submittion.splice(i, 1)
        console.log(`projectiles1 = ${JSON.stringify(projectiles)}`)
        prevtime = p.time
        statusEl.innerHTML = 'Reloading...'
        ;(<HTMLElement>statusEl).style.backgroundColor = 'rgb(239 68 68)'
        bulmaToast.toast({
          message: `Success ${JSON.stringify(new Ans(p.time, p.x, p.y))}`,
          type: 'is-success',
          dismissible: true,
          pauseOnHover: true,
          duration: 1000,
          animate: { in: 'fadeIn', out: 'fadeOut' },
          position: 'bottom-center'
        })
        console.log(`Success ${JSON.stringify(new Ans(p.time, p.x, p.y))}`)
      }
    })
  }, 1)
}

startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  ;(<HTMLElement>modalEl).style.display = 'none'
  ;(<HTMLElement>exportAnswerEl).style.display = 'none'
})
exportGameElBtn.addEventListener('click', () => {
  const exportAnswer = []
  answer.forEach((x, i) => {
    exportAnswer.push(JSON.parse(x))
  })
  ;(<HTMLInputElement>answerFromEl).value = JSON.stringify(
    exportAnswer,
    null,
    2
  )
  if ((<HTMLElement>exportAnswerEl).style.display === 'flex') {
    ;(<HTMLElement>exportAnswerEl).style.display = 'none'
  } else {
    // (<HTMLElement>exportAnswerEl).style.display = "flex";
  }
})
submitGameElBtn.addEventListener('click', () => {
  ;(<HTMLInputElement>submitFormEl).value = ''
  if ((<HTMLElement>submitAnswerEl).style.display === 'flex') {
    ;(<HTMLElement>submitAnswerEl).style.display = 'none'
    ;(<HTMLElement>submitBtnEl).style.display = 'none'
  } else {
    // (<HTMLElement>submitAnswerEl).style.display = "flex";
    // (<HTMLElement>submitBtnEl).style.display = "inline-block";
  }
})
submitBtnEl.addEventListener('click', () => {
  submittion = []
  const sub = JSON.parse((<HTMLInputElement>submitFormEl).value)
  sub.forEach((x, i) => {
    submittion.push(new Submittion(x.time, x.x, x.y))
  })
  console.log(submittion)
  init()
  animate()
  spawnEnemies()
  checkBullet()
  ;(<HTMLElement>modalEl).style.display = 'none'
  ;(<HTMLElement>exportAnswerEl).style.display = 'none'
})

addEventListener('click', () => {
  animate()
  spawnEnemies()
})
