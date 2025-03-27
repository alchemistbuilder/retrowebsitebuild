// Starfield setup
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star class
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width - canvas.width/2;
        this.y = Math.random() * canvas.height - canvas.height/2;
        this.z = Math.random() * 1500;
        this.color = `hsl(${Math.random() * 360}, 50%, 80%)`;
    }

    update() {
        this.z -= 10;
        if (this.z <= 0) {
            this.reset();
        }

        const factor = 100 / this.z;
        const x = this.x * factor + canvas.width/2;
        const y = this.y * factor + canvas.height/2;
        const size = factor * 2;

        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
            this.reset();
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, Math.max(0.5, size), 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Create stars
const stars = Array(200).fill().map(() => new Star());

// Flame particles
class Flame {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'flame';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.backgroundColor = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`;
        document.getElementById('container').appendChild(this.element);
        
        setTimeout(() => {
            this.element.remove();
        }, 1000);
    }
}

// Create flames on mouse move
let lastFlameTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastFlameTime > 50) {  // Limit flame creation rate
        new Flame(e.clientX, e.clientY);
        lastFlameTime = now;
    }
});

// Matrix-style text effect for menu items
const menuItems = document.querySelectorAll('.menu a');
menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        const originalText = item.textContent;
        let iteration = 0;
        
        const interval = setInterval(() => {
            item.textContent = originalText
                .split('')
                .map((letter, index) => {
                    if(index < iteration) {
                        return originalText[index];
                    }
                    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                })
                .join('');
            
            if(iteration >= originalText.length) {
                clearInterval(interval);
                item.textContent = originalText;
            }
            iteration += 1/3;
        }, 30);
    });
});

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => star.update());
    
    requestAnimationFrame(animate);
}

// Start animation
animate(); 