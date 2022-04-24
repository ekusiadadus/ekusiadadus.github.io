const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const timeEl = document.querySelector("#timeEl");
const scoreEl = document.querySelector("#scoreEl");
const statusEl = document.querySelector("#statusEl");
const startGameBtn = document.querySelector("#startGameElBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScoreEl");
const exportGameElBtn = document.querySelector("#exportGameElBtn");
const exportAnswerEl = document.querySelector("#exportAnswerEl");
const answerFromEl = document.querySelector("#answerFromEl");
const submitGameElBtn = document.querySelector("#submitGameElBtn");
const submitFormEl = document.querySelector("#submitFormEl");
const submitAnswerEl = document.querySelector("#submitAnswerEl");
const submitBtnEl = document.querySelector("#submitBtnEl");
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}
class Projectile {
    constructor(time, x, y, radius, color, velocity) {
        this.time = time;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
class Enemy {
    constructor(time, x, y, radius, color, velocity, point) {
        this.time = time;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.point = point;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
const friction = 0.99;
class Particle {
    constructor(time, x, y, radius, color, velocity) {
        this.time = time;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}
class Ans {
    constructor(time, x, y) {
        this.time = time;
        this.x = x;
        this.y = y;
    }
}
class Submittion {
    constructor(time, x, y) {
        this.time = time;
        this.x = x;
        this.y = y;
    }
}
const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 10, "white");
let projectiles = [];
let enemies = [];
let particles = [];
let answer = [];
let submittion = [];
let gameState = false;
let time = new Date();
let prevtime = 0;
function init() {
    gameState = true;
    time = new Date();
    player = new Player(x, y, 10, "white");
    projectiles = [];
    enemies = [];
    particles = [];
    answer = [];
    score = 0;
    scoreEl.innerHTML = score.toString();
    statusEl.innerHTML = "Ready!";
    statusEl.style.backgroundColor = "rgb(34 197 94)";
    bigScoreEl.innerHTML = score.toString();
    prevtime = 0;
}
function spawnEnemies() {
    setInterval(() => {
        var time1 = new Date();
        const radius = Math.random() * (30 - 4) + 4;
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = canvas.height * Math.random();
        }
        else {
            x = canvas.width * Math.random();
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360},50%,50%)`;
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
        const point = Math.floor(1000 * Math.random());
        enemies.push(new Enemy((time1.getTime() - time.getTime()) / 1000, x, y, radius, color, velocity, point));
    }, 100);
}
let animationId;
let score = 0;
function animate() {
    var time1 = (new Date().getTime() - time.getTime()) / 1000;
    if (prevtime + 1 <= time1 || prevtime === 0) {
        statusEl.innerHTML = "Ready!";
        statusEl.style.backgroundColor = "rgb(34 197 94)";
    }
    animationId = requestAnimationFrame(animate);
    c.fillStyle = "rgba(0,0,0,0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        }
        else {
            particle.update();
        }
    });
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();
        if (projectile.x - projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1) {
            // cancelAnimationFrame(animationId);
            // (<HTMLElement>modalEl).style.display = "flex";
            bigScoreEl.innerHTML = score.toString();
            gameState = false;
        }
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                for (let i = 0; i < enemy.radius * 2; ++i) {
                    particles.push(new Particle(projectile.time, projectile.x, projectile.y, 3, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 5),
                        y: (Math.random() - 0.5) * (Math.random() * 5),
                    }));
                }
                if (enemy.radius - 10 > 10) {
                    score += 100;
                    scoreEl.innerHTML = score.toString();
                    gsap.to(enemy, { radius: enemy.radius - 10 });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                else {
                    score += enemy.point;
                    scoreEl.innerHTML = score.toString();
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
    timeEl.innerHTML = ((new Date().getTime() - time.getTime()) /
        1000).toString();
}
canvas.addEventListener("click", (event) => {
    const angle = Math.atan2(event.offsetY - canvas.height / 2, event.offsetX - canvas.width / 2);
    const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
    var time1 = (new Date().getTime() - time.getTime()) / 1000;
    if (prevtime === 0 || prevtime + 1 <= time1) {
        projectiles.push(new Projectile(time1, canvas.width / 2, canvas.height / 2, 5, "white", velocity));
        prevtime = time1;
        if (gameState === true) {
            answer.push(JSON.stringify(new Ans(time1, velocity.x, velocity.y)));
        }
        statusEl.innerHTML = "Reloading...";
        statusEl.style.backgroundColor = "rgb(239 68 68)";
        bulmaToast.toast({
            message: `Success ${JSON.stringify(new Ans(time1, velocity.x, velocity.y))}`,
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
            duration: 1000,
            animate: { in: "fadeIn", out: "fadeOut" },
            position: "bottom-center",
        });
        console.log(`Success ${JSON.stringify(new Ans(time1, velocity.x, velocity.y))}`);
    }
    console.log(`projectiles = ${JSON.stringify(projectiles)}`);
});
function checkBullet() {
    var timer = setInterval(() => {
        if (gameState === false) {
            clearInterval(timer);
        }
        let time1 = (new Date().getTime() - time.getTime()) / 1000;
        submittion.forEach((p, i) => {
            {
                console.log(`canvasw = ${canvas.width / 2}`);
                projectiles.push(new Projectile(p.time, canvas.width / 2 + p.x * (time1 - p.time), canvas.height / 2 + p.y * (time1 - p.time), 5, "white", { x: p.x, y: p.y }));
                answer.push(JSON.stringify(new Ans(p.time, p.x, p.y)));
                submittion.splice(i, 1);
                console.log(`projectiles1 = ${JSON.stringify(projectiles)}`);
                prevtime = p.time;
                statusEl.innerHTML = "Reloading...";
                statusEl.style.backgroundColor = "rgb(239 68 68)";
                bulmaToast.toast({
                    message: `Success ${JSON.stringify(new Ans(p.time, p.x, p.y))}`,
                    type: "is-success",
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 1000,
                    animate: { in: "fadeIn", out: "fadeOut" },
                    position: "bottom-center",
                });
                console.log(`Success ${JSON.stringify(new Ans(p.time, p.x, p.y))}`);
            }
        });
    }, 1);
}
startGameBtn.addEventListener("click", () => {
    init();
    animate(), spawnEnemies();
    modalEl.style.display = "none";
    exportAnswerEl.style.display = "none";
});
exportGameElBtn.addEventListener("click", () => {
    let exportAnswer = [];
    answer.forEach((x, i) => {
        exportAnswer.push(JSON.parse(x));
    });
    answerFromEl.value = JSON.stringify(exportAnswer, null, 2);
    if (exportAnswerEl.style.display == "flex") {
        exportAnswerEl.style.display = "none";
    }
    else {
        // (<HTMLElement>exportAnswerEl).style.display = "flex";
    }
});
submitGameElBtn.addEventListener("click", () => {
    submitFormEl.value = "";
    if (submitAnswerEl.style.display == "flex") {
        submitAnswerEl.style.display = "none";
        submitBtnEl.style.display = "none";
    }
    else {
        // (<HTMLElement>submitAnswerEl).style.display = "flex";
        // (<HTMLElement>submitBtnEl).style.display = "inline-block";
    }
});
submitBtnEl.addEventListener("click", () => {
    submittion = [];
    let sub = JSON.parse(submitFormEl.value);
    sub.forEach((x, i) => {
        submittion.push(new Submittion(x.time, x.x, x.y));
    });
    console.log(submittion);
    init();
    animate(), spawnEnemies(), checkBullet();
    modalEl.style.display = "none";
    exportAnswerEl.style.display = "none";
});
addEventListener("click", () => {
    animate(), spawnEnemies();
});
//# sourceMappingURL=background.js.map