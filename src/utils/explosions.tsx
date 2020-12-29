// Inspired by: https://codepen.io/deanwagman/pen/EjLBdQ

export const explosion = (x: number, y: number) => {
    var particles: any[] = [];

    // Configuration, Play with these
    const config = {
        particleNumber: 300,
        maxParticleSize: 3,
        maxSpeed: 40,
        colorVariation: 50
    };

    // Colors
    var colorPalette = {
        bg: {r:12,g:9,b:29},
        matter: [
            {r:36,g:18,b:42}, // darkPRPL
            {r:78,g:36,b:42}, // rockDust
            {r:252,g:178,b:96}, // solorFlare
            {r:253,g:238,b:152} // totesASun
        ]
    };

    // Our Frame function
    const frame = () => {
        count--;

        drawBg();
        particles.map((p) => {
            return updateParticleModel(p);
        });

        particles.forEach((p) => {
            drawParticle(p.x, p.y, p.radius, p.color);
        });
  
        count > 0 && window.requestAnimationFrame(frame);
        count === 0 && drawBg();
    };

    // Draws the background for the canvas, because space
    const drawBg = () => {
        if (ctx) {
            ctx.putImageData(background, 0, 0);
        }
    };

    const initParticles = (numParticles: number, x: number, y: number) => {
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(x, y));
        }
    };

    // Just the function that physically draws the particles
    // Physically? sure why not, physically.
    const drawParticle = (x:number, y: number, r: number, c: any) => {
        if (ctx) {
            ctx.beginPath();
            ctx.fillStyle = c;
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
    };

    class Particle {
        x: number;
        y: number;
        radius: number;
        color: any;
        speed: number;
        direction: number;

        constructor(x: number, y: number) {
            this.x = x || Math.round(Math.random() * (canvas !== null ? canvas?.width : 1));
            this.y = y || Math.round(Math.random() * (canvas !== null ? canvas?.height : 1));
            this.radius = Math.ceil(Math.random() * config.maxParticleSize);
            this.color = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)],true );
            this.speed = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
            this.direction = Math.round(Math.random() * 360);
        }
    }

    // Used to find the rocks next point in space, accounting for speed and direction
    const updateParticleModel = (p: Particle) => {
        var a = 180 - (p.direction + 90); // find the 3rd angle
        p.direction > 0 && p.direction < 180 ? p.x += p.speed * Math.sin(p.d) / Math.sin(p.speed) : p.x -= p.speed * Math.sin(p.direction) / Math.sin(p.speed);
        p.direction > 90 && p.direction < 270 ? p.y += p.speed * Math.sin(a) / Math.sin(p.speed) : p.y -= p.speed * Math.sin(a) / Math.sin(p.speed);
        return p;
    };

    // Provides some nice color variation
    // Accepts an rgba object
    // returns a modified rgba object or a rgba string if true is passed in for argument 2
    const colorVariation = (color: any, returnString: string) => {
        var r,g,b,a;
        r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.r);
        g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.g);
        b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.b);
        a = Math.random() + .5;
        if (returnString) {
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        } else {
            return {r,g,b,a};
        }
    };

    // Remove particles that aren't on the canvas
    const cleanUpArray = () => {
        particles = [];
    };

    var count = 90;
    var canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
    var ctx = canvas ? canvas.getContext('2d') : null;
    var background: ImageData;

    if (canvas !== null && ctx !== null) {
        background = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    cleanUpArray();
    initParticles(config.particleNumber, x, y);
    frame();

};
