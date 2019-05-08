const isMobile = window.innerWidth <= 768;
if (!isMobile) {
  //------------------------------------//
  //  Canvas Utils                      //
  //------------------------------------//
  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }
  
  /**
   * Rotates coordinate system for velocities
   *
   * Takes velocities and alters them as if the coordinate system they're on was rotated
   *
   * @param  Object | velocity | The velocity of an individual particle
   * @param  Float  | angle    | The angle of collision between two objects in radians
   * @return Object | The altered x and y velocities after the coordinate system has been rotated
   */
  
  function rotate(velocity, angle) {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
  
    return rotatedVelocities;
  }
  
  /**
  * Swaps out two colliding particles' x and y velocities after running through
  * an elastic collision reaction equation
  *
  * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
  * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
  * @return Null | Does not return a value
  */
  
  function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
  
    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;
  
    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
  
      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;
  
      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);
  
      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
  
      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);
  
      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;                
      particle.velocity.y = vFinal1.y;
  
      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
    }
  }
  
  //------------------------------------//
  //  Canvas Config                     //
  //------------------------------------//
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const canvasParentElement = <HTMLElement>canvas.parentElement;
  const c = canvas.getContext('2d');
  const headerWaveHeight = 80;
  const imageDefaultDimensions = 55.5;
  
  // Set Canvas Dimensions
  canvas.width = canvasParentElement.getBoundingClientRect().width;
  canvas.height = canvasParentElement.getBoundingClientRect().height - headerWaveHeight;
  
  window.onresize = () => {
    canvas.width = canvasParentElement.getBoundingClientRect().width;
    canvas.height = canvasParentElement.getBoundingClientRect().height - headerWaveHeight;
  }
  
  const mouse = { x: null, y: null };
  
  // Event Listeners
  addEventListener('mousemove', event => {
    mouse.x = event.clientX,
    mouse.y = event.clientY
  });
  
  
  // Objects
  function ImageObject(x, y, image, width, height, randomBoolean, imageDescription, textOffset) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.height = height;
    this.width = width;
    this.description = 
    this.velocity = {
      x: randomBoolean ? Math.random() - 0.3 : -Math.random() + 0.3,
      y: !randomBoolean ? Math.random() - 0.3 : -Math.random() + 0.3
    }
    this.mass = 1;
    this.description = imageDescription;
    this.textOffset = textOffset;
  }
  
  ImageObject.prototype.draw = function() {
    c.drawImage(this.image, this.x, this.y, this.width, this.height);
    
    if(distance(mouse.x, mouse.y, this.x, this.y) <= 180) {
      c.font = '700 16px Lato';
      c.fillStyle = 'white';
      c.fillText(this.description, this.x - this.textOffset, this.y - 10);
    }
  };
  
  ImageObject.prototype.update = function(imageObjects) {
    this.draw();
    for (let i = 0; i < imageObjects.length; i++) {
      if (this === imageObjects[i]) continue;
      if (window.innerWidth > 992 && distance(this.x, this.y, imageObjects[i].x, imageObjects[i].y) - imageDefaultDimensions < 0) {
        resolveCollision(this, imageObjects[i]);
      }
    }
  
    if (this.x <= 0 || this.x + imageDefaultDimensions >= canvas.width) {
      this.velocity.x = -this.velocity.x;
    }
  
    if (this.y <= 0 || this.y + imageDefaultDimensions >= canvas.height) {
      this.velocity.y = -this.velocity.y;
    }
  
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
  
  // Implementation
  let imageObjects = [];
  function init() {
    const images = [
      { src: './assets/images/web-technologies/typescript.svg', description: 'TypeScript', offset: 10.5 },
      { src: './assets/images/web-technologies/css3.svg', description: 'CSS3', offset: -10 },
      { src: './assets/images/web-technologies/html5.svg', description: 'HTML5', offset: -1 },
      { src: './assets/images/web-technologies/mongodb.svg', description: 'MongoDB', offset: 4 },
      { src: './assets/images/web-technologies/node-dot-js.svg', description: 'Node.js', offset: -1 },
      { src: './assets/images/web-technologies/react.svg', description: 'React', offset: -7 },
      { src: './assets/images/web-technologies/redux.svg', description: 'Redux', offset: -5 },
      { src: './assets/images/web-technologies/sass.svg', description: 'Sass', offset: -12 },
      { src: './assets/images/web-technologies/webpack.svg', description: 'Webpack', offset: 5 },
      { src: './assets/images/web-technologies/aws-s3.svg', description: 'AWS S3', offset: 0 },
      { src: './assets/images/web-technologies/socket-io.svg', description: 'Socket.io', offset: 3 },
      { src: './assets/images/web-technologies/redis.svg', description: 'Redis', offset: -8 },
      { src: './assets/images/web-technologies/visual-studio-code.svg', description: 'VS Code', offset: 2 },
      { src: './assets/images/web-technologies/git.svg', description: 'Git', offset: -15 },
      { src: './assets/images/web-technologies/graphql.svg', description: 'GraphQL', offset: 2 }
    ];
    
    images.forEach((image, i) => {
      let positionX = randomIntFromRange(imageDefaultDimensions, canvas.width - imageDefaultDimensions);
      let positionY = randomIntFromRange(imageDefaultDimensions, canvas.height - imageDefaultDimensions);
      
      if (i !== 0) {
        for(let j = 0; j < imageObjects.length; j++) {
          if (distance(positionX, positionY, imageObjects[j].x, imageObjects[j].y) - imageDefaultDimensions < 0) {
            positionX = randomIntFromRange(imageDefaultDimensions, canvas.width - imageDefaultDimensions);
            positionY = randomIntFromRange(imageDefaultDimensions, canvas.height - imageDefaultDimensions);
            j = -1;
          }
        }
      }
      const randomBoolean = Math.random() >= 0.5;
      const imageEl = new Image();
      imageEl.src = image.src;
      //TODO: Hnalde Error
      imageEl.onerror = () => {
        
      }
      imageObjects.push(new ImageObject(positionX, positionY, imageEl, imageDefaultDimensions, imageDefaultDimensions, randomBoolean, image.description, image.offset));
    });
  }
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    imageObjects.forEach(image => image.update(imageObjects));
  }

  // Used { requestAnimationFrame } to solve IE11 drawImage bug.
  requestAnimationFrame(() => {
    init();
    animate();
  });
}

