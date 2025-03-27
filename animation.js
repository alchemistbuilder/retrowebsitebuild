const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class with glow effect
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 6;
        this.dy = (Math.random() - 0.5) * 6;
        this.glow = 20; // Glow radius
        this.mass = 1; // Mass for collision calculations
    }

    draw() {
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius * 0.5,
            this.x, this.y, this.radius + this.glow
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.4, this.color + '88');
        gradient.addColorStop(1, 'transparent');

        // Draw glowing ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + this.glow, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        // Draw solid ball center
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Check collision with another ball
    checkCollision(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + other.radius) {
            // Collision detected - calculate new velocities
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Relative velocity
            const relativeVelocityX = this.dx - other.dx;
            const relativeVelocityY = this.dy - other.dy;

            // Calculate impulse
            const speed = relativeVelocityX * normalX + relativeVelocityY * normalY;
            
            if (speed < 0) return; // Already moving apart

            const impulse = 2 * speed / (this.mass + other.mass);

            // Apply impulse
            this.dx -= impulse * other.mass * normalX;
            this.dy -= impulse * other.mass * normalY;
            other.dx += impulse * this.mass * normalX;
            other.dy += impulse * this.mass * normalY;
        }
    }

    update(balls) {
        // Wall collisions
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Keep ball within bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Check collisions with other balls
        balls.forEach(ball => {
            if (ball !== this) {
                this.checkCollision(ball);
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Disco ball class
class DiscoBall {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.rotation = 0;
        this.tiles = 12; // Number of mirror tiles
        this.beams = 8; // Number of light beams
    }

    draw() {
        // Draw disco ball
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw base sphere
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.8, '#888');
        gradient.addColorStop(1, '#666');

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw mirror tiles
        for (let i = 0; i < this.tiles; i++) {
            const angle = (i / this.tiles) * Math.PI * 2;
            for (let j = 0; j < this.tiles/2; j++) {
                const y = (j / (this.tiles/2)) * this.radius * 2 - this.radius;
                const width = Math.cos(Math.asin(y/this.radius)) * this.radius * 0.3;
                
                ctx.save();
                ctx.rotate(angle);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-width/2, y-2, width, 4);
                ctx.restore();
            }
        }

        // Draw light beams
        for (let i = 0; i < this.beams; i++) {
            const angle = (i / this.beams) * Math.PI * 2;
            const gradient = ctx.createLinearGradient(
                0, 0,
                Math.cos(angle) * canvas.width,
                Math.sin(angle) * canvas.width
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * canvas.width, Math.sin(angle) * canvas.width);
            ctx.lineWidth = 50;
            ctx.strokeStyle = gradient;
            ctx.stroke();
        }

        ctx.restore();
    }

    update() {
        this.rotation += 0.02;
        this.draw();
    }
}

// Create balls with specified colors
const balls = [
    new Ball(100, 100, 20, '#ff3333'),
    new Ball(200, 200, 20, '#3333ff'),
    new Ball(300, 300, 20, '#33ff33'),
    new Ball(400, 400, 20, '#ff9933'),
    new Ball(500, 500, 20, '#ffffff'),
    // Add three yellow balls at different positions
    new Ball(150, 150, 20, '#ffff33'),
    new Ball(350, 250, 20, '#ffff33'),
    new Ball(450, 350, 20, '#ffff33')
];

// Create disco ball in the center
const discoBall = new DiscoBall(canvas.width/2, canvas.height/2, 40);

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(17, 17, 17, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    discoBall.update();
    
    balls.forEach(ball => {
        ball.update(balls);  // Pass the balls array for collision detection
    });

    requestAnimationFrame(animate);
}

// Start animation
animate(); 