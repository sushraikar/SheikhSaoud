// Particle system for hero section
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.animationId = null;
        
        this.config = {
            particleCount: window.innerWidth < 768 ? 50 : 100,
            maxDistance: 150,
            particleSpeed: 0.5,
            particleSize: 2,
            connectionOpacity: 0.3,
            particleOpacity: 0.8,
            colors: {
                primary: '#00d4ff',
                secondary: '#d4af37',
                accent: '#ff6b35'
            }
        };
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                color: this.getRandomColor(),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomColor() {
        const colors = Object.values(this.config.colors);
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Update pulse phase
            particle.pulsePhase += 0.02;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5;
            const alpha = this.config.particleOpacity * pulse;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) + 
                    Math.pow(particle1.y - particle2.y, 2)
                );
                
                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * this.config.connectionOpacity;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = this.config.colors.primary;
                    this.ctx.lineWidth = 1;
                    this.ctx.shadowBlur = 5;
                    this.ctx.shadowColor = this.config.colors.primary;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                    
                    this.connections.push({
                        particle1,
                        particle2,
                        distance,
                        opacity
                    });
                }
            }
        }
    }
    
    drawBackground() {
        // Create subtle animated background gradient
        const time = Date.now() * 0.001;
        const gradient = this.ctx.createLinearGradient(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        
        const hue1 = (time * 20) % 360;
        const hue2 = (time * 30 + 120) % 360;
        
        gradient.addColorStop(0, `hsla(${hue1}, 70%, 20%, 0.1)`);
        gradient.addColorStop(0.5, 'hsla(220, 30%, 10%, 0.05)');
        gradient.addColorStop(1, `hsla(${hue2}, 60%, 25%, 0.1)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw animated background
        this.drawBackground();
        
        // Update and draw particles
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        // Add special effects periodically
        if (Math.random() < 0.01) {
            this.createPulseEffect();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    createPulseEffect() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = 200;
        let radius = 0;
        
        const pulse = () => {
            this.ctx.save();
            this.ctx.globalAlpha = (1 - radius / maxRadius) * 0.3;
            this.ctx.strokeStyle = this.config.colors.accent;
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = this.config.colors.accent;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
            
            radius += 5;
            
            if (radius < maxRadius) {
                requestAnimationFrame(pulse);
            }
        };
        
        pulse();
    }
    
    addMouseInteraction(x, y) {
        // Create attraction/repulsion effect at mouse position
        this.particles.forEach(particle => {
            const dx = x - particle.x;
            const dy = y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 1000;
                particle.vx += (dx / distance) * force;
                particle.vy += (dy / distance) * force;
                
                // Limit velocity
                const maxVel = 2;
                particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
                particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
            }
        });
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.config.particleCount = window.innerWidth < 768 ? 50 : 100;
            this.createParticles();
        });
        
        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            
            this.addMouseInteraction(mouseX, mouseY);
        });
        
        // Touch interaction for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
            
            this.addMouseInteraction(mouseX, mouseY);
        });
        
        // Pause/resume on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Reduce particle count on battery save mode (if supported)
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                const updateParticleCount = () => {
                    if (battery.charging === false && battery.level < 0.2) {
                        this.config.particleCount = Math.floor(this.config.particleCount * 0.5);
                        this.createParticles();
                    }
                };
                
                battery.addEventListener('chargingchange', updateParticleCount);
                battery.addEventListener('levelchange', updateParticleCount);
            });
        }
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        this.particles = [];
        this.connections = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Performance monitoring
    getPerformanceStats() {
        return {
            particleCount: this.particles.length,
            connectionCount: this.connections.length,
            fps: this.fps || 0
        };
    }
}

// Network visualization effect
class NetworkEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.time = 0;
        
        this.createNetwork();
    }
    
    createNetwork() {
        const nodeCount = 20;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 200;
        
        // Create nodes in a circular pattern
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.nodes.push({
                x: x,
                y: y,
                originalX: x,
                originalY: y,
                size: Math.random() * 4 + 2,
                pulsePhase: Math.random() * Math.PI * 2,
                connected: false
            });
        }
        
        // Create edges with probability
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() < 0.3) {
                    this.edges.push({
                        from: i,
                        to: j,
                        strength: Math.random(),
                        active: false
                    });
                }
            }
        }
    }
    
    update() {
        this.time += 0.02;
        
        // Update node positions with gentle movement
        this.nodes.forEach((node, index) => {
            node.pulsePhase += 0.03;
            
            const offsetX = Math.sin(this.time + index * 0.5) * 10;
            const offsetY = Math.cos(this.time + index * 0.7) * 10;
            
            node.x = node.originalX + offsetX;
            node.y = node.originalY + offsetY;
        });
        
        // Randomly activate edges
        this.edges.forEach(edge => {
            if (Math.random() < 0.02) {
                edge.active = !edge.active;
            }
        });
    }
    
    draw() {
        // Draw edges
        this.edges.forEach(edge => {
            if (edge.active) {
                const fromNode = this.nodes[edge.from];
                const toNode = this.nodes[edge.to];
                
                this.ctx.save();
                this.ctx.globalAlpha = edge.strength * 0.6;
                this.ctx.strokeStyle = '#00d4ff';
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00d4ff';
                
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                this.ctx.lineTo(toNode.x, toNode.y);
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
            
            this.ctx.save();
            this.ctx.globalAlpha = pulse;
            this.ctx.fillStyle = '#d4af37';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#d4af37';
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        let particleSystem;
        let networkEffect;
        
        // Check if reduced motion is preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (!prefersReducedMotion.matches) {
            // Initialize full particle system
            particleSystem = new ParticleSystem(canvas);
            
            // Add network effect every 30 seconds
            setInterval(() => {
                if (networkEffect) {
                    networkEffect = null;
                }
                networkEffect = new NetworkEffect(canvas);
                
                let duration = 0;
                const networkAnimation = () => {
                    networkEffect.update();
                    networkEffect.draw();
                    
                    duration += 16;
                    if (duration < 5000) { // Show for 5 seconds
                        requestAnimationFrame(networkAnimation);
                    }
                };
                
                networkAnimation();
            }, 30000);
            
        } else {
            // Simplified static version for users who prefer reduced motion
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Draw static grid pattern
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
            ctx.lineWidth = 1;
            
            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (particleSystem) {
                particleSystem.resizeCanvas();
                particleSystem.createParticles();
            }
        });
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (particleSystem) {
                particleSystem.destroy();
            }
        });
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, NetworkEffect };
}