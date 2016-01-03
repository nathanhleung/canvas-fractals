$(document).ready(() => {
  let fractals = new Fractals("#fractals", 500);
});

// Add captalize method to string
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

class Fractals {
  constructor(selector, size = 250) {
    this.selector = selector;
    this.size = size;
    this.fractals = [
      // "squares",
      "mandelbrot",
      "mandelbrotPi",
      "fern",
      "fernPi"
    ];
    this.generateCanvases();
  }
  generateCanvases() {
    for (let fractal of this.fractals) {
      let canvas = document.createElement('canvas');
      canvas.className = fractal + "-canvas";
      canvas.height = canvas.width = this.size;
      $(this.selector).append(canvas); 
    }
    this.fillCanvases();
  }
  fillCanvases() {
    for (let fractal of this.fractals) {
      this["generate" + fractal.capitalize()]();
    }
  }
  /**
   * Generates a fractal of increasingly small squares
   * @todo Clean up, this is long
   */
  generateSquares() {
    [].forEach.call(document.getElementsByClassName('squares-canvas'), (el, index) => {
      let context = el.getContext("2d");
      let initialWidth = this.size / 2;
      // Fill Red
      let offsetTop = 0;
      let offsetLeft = 0;
      let width = initialWidth;
      context.fillStyle = 'rgba(255,0,0,0.5)';
      for (let i = 0; i < 20; i++) {
        context.fillRect(offsetLeft, offsetTop, width, width);
        offsetTop += width;
        offsetLeft += width;
        width /= 2;
      }
      // Fill Green
      offsetTop = 0;
      offsetLeft = initialWidth;
      width = initialWidth;
      context.fillStyle = 'rgba(0,255,0,0.5)';
      for (let i = 0; i < 20; i++) {
        context.fillRect(offsetLeft, offsetTop, width, width);
        offsetTop += width;
        offsetLeft -= width / 2;
        width /= 2;
      }
      // Fill Blue
      offsetTop = initialWidth;
      offsetLeft = 0;
      width = initialWidth;
      context.fillStyle = 'rgba(0,0,255,0.5)';
      for (let i = 0; i < 20; i++) {
        context.fillRect(offsetLeft, offsetTop, width, width);
        offsetTop /= 2;
        offsetLeft += width;
        width /= 2;
      }
      // Fill Purple
      offsetTop = initialWidth;
      offsetLeft = initialWidth;
      width = initialWidth;
      context.fillStyle = 'rgba(255,0,255,0.5)';
      for (let i = 0; i < 20; i++) {
        context.fillRect(offsetLeft, offsetTop, width, width);
        offsetTop -= width / 2;
        offsetLeft -= width / 2;
        width /= 2;
      }
    });
  }
  canvasToCartesian(canvasCoords) {
    return {
      x: canvasCoords.x - Math.round(this.size / 2),
      y: Math.round(this.size / 2) - canvasCoords.y
    };
  }
  plotPoint(context, x, y, color) {
    // Assuming the origin is at the center
    let canvasX = x + Math.round(this.size / 2);
    let canvasY = Math.round(this.size / 2) - y;
    // Draw point
    context.fillStyle = color;
    context.fillRect(canvasX, canvasY, 1, 1);
  }
  generateMandelbrot() {
    // Tested with 500px, that's why we divide by 500
    // Bigger scale num = bigger picture
    let scale = 170 * this.size / 500;
    // 90 is usally a good number for this
    let shift = /* 90 */ 0 * this.size / 500; // There are more points on the left side.  This specifies how far to the right to shift the image
    [].forEach.call(document.getElementsByClassName('mandelbrot-canvas'), (el, index) => {
      let context = el.getContext("2d");
      // cY = canvas Y
      for (let cY = 0; cY < this.size; cY++) {
        for (let cX = 0; cX < this.size; cX++) {
          let cartesianCoords = this.canvasToCartesian({
            x: cX,
            y: cY
          });
          let scaledY = cartesianCoords.y / scale;
          let scaledX = cartesianCoords.x / scale;
          // [real, imaginary]
          let result = [0, 0];
          let i = 0;
          // result + (a + bi)^2
          // result + (x + yi)^2
          // D/R: (-2, 2)
          // Find out why result[0] needs to be less than 2
          while (result[0] <= 2 && i < 2500) {
            let newReal = Math.pow(result[0], 2) - Math.pow(result[1], 2) + scaledX;
            let newImaginary = 2 * result[0] * result[1] + scaledY;
            result[0] = newReal;
            result[1] = newImaginary;
            i++;
          }
          if (result[0] <= 2) {
            this.plotPoint(context, scaledX * scale + shift, scaledY * scale, "black");
          } else {
            // How fast the sequence diverges
            let lightness = 100 - i;
            if (lightness < 0) {
              lightness = 0;
            }
            this.plotPoint(context, scaledX * scale + shift, scaledY * scale, "hsl(0,0%," + lightness.toString() + "%)");
          }
        }
      }
    });
  }
  generateMandelbrotPi() {
    $.ajax({
      method: 'GET',
      url: 'https://cdn.rawgit.com/nathanhleung/a2453482da7d70636747/raw/dad85e1b74fb473a0dee3aa48f4fb83e09489740/pi-10000.json',
      success: (data) => {
        let PI = data.digits.split("");
        // Tested with 500px, that's why we divide by 500
        // Bigger scale num = bigger picture
        let scale = 170 * this.size / 500;
        let shift = 0 * this.size / 500; // There are more points on the left side.  This specifies how far to the right to shift the image (usually 90)
        [].forEach.call(document.getElementsByClassName('mandelbrotPi-canvas'), (el, index) => {
          let context = el.getContext("2d");
          // cY = canvas Y
          for (let cY = 0; cY < this.size; cY++) {
            for (let cX = 0; cX < this.size; cX++) {
              let cartesianCoords = this.canvasToCartesian({
                x: cX,
                y: cY
              });
              let scaledY = cartesianCoords.y / scale;
              let scaledX = cartesianCoords.x / scale;
              // [real, imaginary]
              let result = [0, 0];
              let i = 0;
              // result + (a + bi)^2
              // result + (x + yi)^2
              // D/R: (-2, 2)
              // Find out why result[0] needs to be less than 2
              while (result[0] <= 2 && i < 2500) {
                let newReal = Math.pow(result[0], 2) - Math.pow(result[1], 2) + scaledX;
                let newImaginary = 2 * result[0] * result[1] + scaledY;
                result[0] = newReal;
                result[1] = newImaginary;
                i++;
              }
              if (result[0] <= 2) {
                this.plotPoint(context, scaledX * scale + shift, scaledY * scale, "black");
              } else {
                this.plotPoint(context, scaledX * scale + shift, scaledY * scale, "hsl(" + 360 / 10 * parseInt(PI[i], 10) + ", 50%, 50%)");
              }
            }
          }
        });
      }
    });
  }
  generateFern() {
    let scale = 45 * this.size / 500;
    let verticalShift = -225 * this.size / 500;
    [].forEach.call(document.getElementsByClassName('fern-canvas'), (el, index) => {
      let context = el.getContext("2d");
      let coords = [0, 0];
      this.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "black");
      let i = 0;
      while (i < 100000) {
        let random = Math.round(Math.random() * 100) / 100;
        // 1% chance
        if (random < 0.01) {
          coords[0] = 0;
          coords[1] = 0.16 * coords[1];
          // 85% chance
        } else if (random < 0.86) {
          coords[0] = 0.85 * coords[0] + 0.04 * coords[1];
          coords[1] = -0.04 * coords[0] + 0.85 * coords[1] + 1.6;
          // 7% chance
        } else if (random < 0.93) {
          coords[0] = 0.2 * coords[0] - 0.26 * coords[1];
          coords[1] = 0.23 * coords[0] + 0.22 * coords[1] + 1.6;
          // 7% chance
        } else {
          coords[0] = -0.15 * coords[0] + 0.28 * coords[1];
          coords[1] = 0.26 * coords[0] + 0.24 * coords[1] + 0.44;
        }
        this.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "green");
        i++;
      }
    });
  }
  generateFernPi() {
    $.ajax({
      method: 'GET',
      url: 'https://cdn.rawgit.com/nathanhleung/a2453482da7d70636747/raw/dad85e1b74fb473a0dee3aa48f4fb83e09489740/pi-10000.json',
      success: (data) => {
        let PI = data.digits.split("");
        let scale = 45 * this.size / 500;
        let verticalShift = -225 * this.size / 500;
        [].forEach.call(document.getElementsByClassName('fernPi-canvas'), (el, index) => {
          let context = el.getContext("2d");
          // [real, imaginary]
          let coords = [0, 0];
          this.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "black");

          let i = 0;
          while (i < 100000) {
            let random = Math.round(Math.random() * 100) / 100;
            // 1% chance
            if (random < 0.01) {
              coords[0] = 0;
              coords[1] = 0.16 * coords[1];
              // 85% chance
            } else if (random < 0.86) {
              coords[0] = 0.85 * coords[0] + 0.04 * coords[1];
              coords[1] = -0.04 * coords[0] + 0.85 * coords[1] + 1.6;
              // 7% chance
            } else if (random < 0.93) {
              coords[0] = 0.2 * coords[0] - 0.26 * coords[1];
              coords[1] = 0.23 * coords[0] + 0.22 * coords[1] + 1.6;
              // 7% chance
            } else {
              coords[0] = -0.15 * coords[0] + 0.28 * coords[1];
              coords[1] = 0.26 * coords[0] + 0.24 * coords[1] + 0.44;
            }
            this.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "hsl(" + 360 / 10 * parseInt(PI[i % 10000], 10) + ", 50%, 50%)");
            i++;
          }
        });
      }
    });
  }
}
