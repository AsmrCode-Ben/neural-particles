let canvas = document.querySelector('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let ctx = canvas.getContext('2d');

//color particles
let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, 'aqua');
gradient.addColorStop(0.25, 'lime');
gradient.addColorStop(0.5, 'yellow');
gradient.addColorStop(0.75, 'fuchsia');
gradient.addColorStop(1, 'red');

ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';

let mouse = {
    x: undefined,
    y: undefined,
    radius: 100,
    force: 10
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y
})

function Particle(x, y, radius, dx, dy) {
    //This is for particles

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;

    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    this.update = () => {

        let dist = Math.sqrt(Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2));

        if (dist <= mouse.radius) {

            let forceFact = 1 - (dist / mouse.radius);

            let angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            this.x += Math.cos(angle) * mouse.force * forceFact;
            this.y += Math.sin(angle) * mouse.force * forceFact;
        }

        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0)
            this.dx = -this.dx;

        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
            this.dy = -this.dy;

        this.draw();
    }
}

function NeuralFx(particles) {
    this.particels = particles;
    this.particleRange = 100;

    this.connectParticle = () => {
        for (let i = 0; i < this.particels.length; i++) {
            for (let j = i + 1; j < this.particels.length; j++) {
                let particle1 = particles[i];
                let particle2 = particles[j];

                let dist = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) +
                    Math.pow(particle1.y - particle2.y, 2)
                );

                if (dist <= this.particleRange) {
                    let opacity = 1 - (dist / this.particleRange);
                    ctx.save();

                    ctx.globalAlpha = opacity * 1.5;

                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.stroke();

                    ctx.restore();
                }
            }
        }
    }
}

let particles = [];
let spawnFact = 0.0003;
let particleCount = spawnFact * (canvas.width * canvas.height);
let maxRadius = 5;
let maxSpeed = 2;
let fx = new NeuralFx(particles);

for (let i = 0; i < particleCount; i++) {
    let radius = Math.random() * maxRadius + 2.5;

    let x = Math.random() * (canvas.width - 2 * radius) + radius;
    let y = Math.random() * (canvas.height - 2 * radius) + radius;

    let dx = Math.random() * maxSpeed - (maxSpeed / 2);
    let dy = Math.random() * maxSpeed - (maxSpeed / 2);

    let particle = new Particle(x, y, radius, dx, dy);
    particles.push(particle);
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fx.connectParticle();
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    requestAnimationFrame(animate);
}
animate();