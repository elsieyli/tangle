import $ from 'jquery';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Config {
  star: {
    color: string;
    width: number;
  };
  line: {
    color: string;
    width: number;
  };
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  velocity: number;
  length: number;
  distance: number;
  radius: number;
  stars: Star[];
}

class Constellation {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private config: Config;

  constructor(canvas: HTMLCanvasElement, options: Partial<Config> = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const defaults: Config = {
      star: {
        color: 'rgba(255, 255, 255, .8)',
        width: 4,
      },
      line: {
        color: 'rgba(255, 255, 255, .5)',
        width: 0.2,
      },
      position: {
        x: 0,
        y: 0,
      },
      width: window.innerWidth,
      height: window.innerHeight,
      velocity: 0.1,
      length: 150, // Increase the number of stars
      distance: 120, // Increase the distance threshold for more connecting lines
      radius: 250,
      stars: [],
    };

    this.config = $.extend(true, {}, defaults, options);
    this.setCanvas();
    this.setContext();
    this.setInitialPosition();
    this.createStars(); // Create stars only once
    this.loop(this.animateStars.bind(this)); // Only animate stars, don't recreate them
    this.bind();
  }

  private setCanvas() {
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
  }

  private setContext() {
    this.context.fillStyle = this.config.star.color;
    this.context.strokeStyle = this.config.line.color;
    this.context.lineWidth = this.config.line.width;
  }

  private setInitialPosition() {
    this.config.position.x = this.canvas.width * 0.5;
    this.config.position.y = this.canvas.height * 0.5;
  }

  // Create stars only once
  private createStars() {
    for (let i = 0; i < this.config.length; i++) {
      const star: Star = {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: this.config.velocity - Math.random() * 0.5,
        vy: this.config.velocity - Math.random() * 0.5,
        radius: Math.random() * this.config.star.width,
      };

      this.config.stars.push(star);
    }
  }

  // Draw and animate stars
  private animateStars() {
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.config.stars.length; i++) {
      const star = this.config.stars[i];
      this.createStar(star); // Draw each star

      // Update the star's position
      star.x += star.vx;
      star.y += star.vy;

      // Reverse velocity if the star hits the canvas boundaries
      if (star.y < 0 || star.y > this.canvas.height) {
        star.vy = -star.vy;
      }

      if (star.x < 0 || star.x > this.canvas.width) {
        star.vx = -star.vx;
      }
    }

    this.drawLines(); // Draw the connecting lines between stars
  }

  // Draw the star
  private createStar(star: Star) {
    this.context.beginPath();
    this.context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
    this.context.fill();
  }

  // Draw lines connecting the stars
  private drawLines() {
    for (let i = 0; i < this.config.stars.length; i++) {
      for (let j = 0; j < this.config.stars.length; j++) {
        const iStar = this.config.stars[i];
        const jStar = this.config.stars[j];

        if (
          Math.abs(iStar.x - jStar.x) < this.config.distance &&
          Math.abs(iStar.y - jStar.y) < this.config.distance
        ) {
          if (
            Math.abs(iStar.x - this.config.position.x) < this.config.radius &&
            Math.abs(iStar.y - this.config.position.y) < this.config.radius
          ) {
            this.context.beginPath();
            this.context.moveTo(iStar.x, iStar.y);
            this.context.lineTo(jStar.x, jStar.y);
            this.context.stroke();
          }
        }
      }
    }
  }

  // Main animation loop
  private loop(callback: () => void) {
    callback();
    window.requestAnimationFrame(() => this.loop(callback));
  }

  // Bind mouse movement to update position
  private bind() {
    $(window).on('mousemove', (e) => {
      this.config.position.x = e.pageX - $(this.canvas).offset()!.left;
      this.config.position.y = e.pageY - $(this.canvas).offset()!.top;
    });
  }
}

export default Constellation;
