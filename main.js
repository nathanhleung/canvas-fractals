"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
  var fractals = new Fractals("#fractals", 500);
});

// Add captalize method to string
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var Fractals = (function () {
  function Fractals(selector) {
    var size = arguments.length <= 1 || arguments[1] === undefined ? 250 : arguments[1];

    _classCallCheck(this, Fractals);

    this.selector = selector;
    this.size = size;
    this.fractals = [
    // "squares",
    "mandelbrot", "mandelbrotPi", "fern", "fernPi"];
    this.generateCanvases();
  }

  _createClass(Fractals, [{
    key: "generateCanvases",
    value: function generateCanvases() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.fractals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fractal = _step.value;

          var canvas = document.createElement('canvas');
          canvas.className = fractal + "-canvas";
          canvas.height = canvas.width = this.size;
          $(this.selector).append(canvas);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.fillCanvases();
    }
  }, {
    key: "fillCanvases",
    value: function fillCanvases() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.fractals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var fractal = _step2.value;

          this["generate" + fractal.capitalize()]();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    /**
     * Generates a fractal of increasingly small squares
     * @todo Clean up, this is long
     */

  }, {
    key: "generateSquares",
    value: function generateSquares() {
      var _this = this;

      [].forEach.call(document.getElementsByClassName('squares-canvas'), function (el, index) {
        var context = el.getContext("2d");
        var initialWidth = _this.size / 2;
        // Fill Red
        var offsetTop = 0;
        var offsetLeft = 0;
        var width = initialWidth;
        context.fillStyle = 'rgba(255,0,0,0.5)';
        for (var i = 0; i < 20; i++) {
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
        for (var i = 0; i < 20; i++) {
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
        for (var i = 0; i < 20; i++) {
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
        for (var i = 0; i < 20; i++) {
          context.fillRect(offsetLeft, offsetTop, width, width);
          offsetTop -= width / 2;
          offsetLeft -= width / 2;
          width /= 2;
        }
      });
    }
  }, {
    key: "canvasToCartesian",
    value: function canvasToCartesian(canvasCoords) {
      return {
        x: canvasCoords.x - Math.round(this.size / 2),
        y: Math.round(this.size / 2) - canvasCoords.y
      };
    }
  }, {
    key: "plotPoint",
    value: function plotPoint(context, x, y, color) {
      // Assuming the origin is at the center
      var canvasX = x + Math.round(this.size / 2);
      var canvasY = Math.round(this.size / 2) - y;
      // Draw point
      context.fillStyle = color;
      context.fillRect(canvasX, canvasY, 1, 1);
    }
  }, {
    key: "generateMandelbrot",
    value: function generateMandelbrot() {
      var _this2 = this;

      // Tested with 500px, that's why we divide by 500
      // Bigger scale num = bigger picture
      var scale = 170 * this.size / 500;
      // 90 is usally a good number for this
      var shift = /* 90 */0 * this.size / 500; // There are more points on the left side.  This specifies how far to the right to shift the image
      [].forEach.call(document.getElementsByClassName('mandelbrot-canvas'), function (el, index) {
        var context = el.getContext("2d");
        // cY = canvas Y
        for (var cY = 0; cY < _this2.size; cY++) {
          for (var cX = 0; cX < _this2.size; cX++) {
            var cartesianCoords = _this2.canvasToCartesian({
              x: cX,
              y: cY
            });
            var scaledY = cartesianCoords.y / scale;
            var scaledX = cartesianCoords.x / scale;
            // [real, imaginary]
            var result = [0, 0];
            var i = 0;
            // result + (a + bi)^2
            // result + (x + yi)^2
            // D/R: (-2, 2)
            // Find out why result[0] needs to be less than 2
            while (result[0] <= 2 && i < 2500) {
              var newReal = Math.pow(result[0], 2) - Math.pow(result[1], 2) + scaledX;
              var newImaginary = 2 * result[0] * result[1] + scaledY;
              result[0] = newReal;
              result[1] = newImaginary;
              i++;
            }
            if (result[0] <= 2) {
              _this2.plotPoint(context, scaledX * scale + shift, scaledY * scale, "black");
            } else {
              // How fast the sequence diverges
              var lightness = 100 - i;
              if (lightness < 0) {
                lightness = 0;
              }
              _this2.plotPoint(context, scaledX * scale + shift, scaledY * scale, "hsl(0,0%," + lightness.toString() + "%)");
            }
          }
        }
      });
    }
  }, {
    key: "generateMandelbrotPi",
    value: function generateMandelbrotPi() {
      var _this3 = this;

      $.ajax({
        method: 'GET',
        url: 'https://cdn.rawgit.com/nathanhleung/a2453482da7d70636747/raw/dad85e1b74fb473a0dee3aa48f4fb83e09489740/pi-10000.json',
        success: function success(data) {
          var PI = data.digits.split("");
          // Tested with 500px, that's why we divide by 500
          // Bigger scale num = bigger picture
          var scale = 170 * _this3.size / 500;
          var shift = 0 * _this3.size / 500; // There are more points on the left side.  This specifies how far to the right to shift the image (usually 90)
          [].forEach.call(document.getElementsByClassName('mandelbrotPi-canvas'), function (el, index) {
            var context = el.getContext("2d");
            // cY = canvas Y
            for (var cY = 0; cY < _this3.size; cY++) {
              for (var cX = 0; cX < _this3.size; cX++) {
                var cartesianCoords = _this3.canvasToCartesian({
                  x: cX,
                  y: cY
                });
                var scaledY = cartesianCoords.y / scale;
                var scaledX = cartesianCoords.x / scale;
                // [real, imaginary]
                var result = [0, 0];
                var i = 0;
                // result + (a + bi)^2
                // result + (x + yi)^2
                // D/R: (-2, 2)
                // Find out why result[0] needs to be less than 2
                while (result[0] <= 2 && i < 2500) {
                  var newReal = Math.pow(result[0], 2) - Math.pow(result[1], 2) + scaledX;
                  var newImaginary = 2 * result[0] * result[1] + scaledY;
                  result[0] = newReal;
                  result[1] = newImaginary;
                  i++;
                }
                if (result[0] <= 2) {
                  _this3.plotPoint(context, scaledX * scale + shift, scaledY * scale, "black");
                } else {
                  _this3.plotPoint(context, scaledX * scale + shift, scaledY * scale, "hsl(" + 360 / 10 * parseInt(PI[i], 10) + ", 50%, 50%)");
                }
              }
            }
          });
        }
      });
    }
  }, {
    key: "generateFern",
    value: function generateFern() {
      var _this4 = this;

      var scale = 45 * this.size / 500;
      var verticalShift = -225 * this.size / 500;
      [].forEach.call(document.getElementsByClassName('fern-canvas'), function (el, index) {
        var context = el.getContext("2d");
        var coords = [0, 0];
        _this4.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "black");
        var i = 0;
        while (i < 100000) {
          var random = Math.round(Math.random() * 100) / 100;
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
          _this4.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "green");
          i++;
        }
      });
    }
  }, {
    key: "generateFernPi",
    value: function generateFernPi() {
      var _this5 = this;

      $.ajax({
        method: 'GET',
        url: 'https://cdn.rawgit.com/nathanhleung/a2453482da7d70636747/raw/dad85e1b74fb473a0dee3aa48f4fb83e09489740/pi-10000.json',
        success: function success(data) {
          var PI = data.digits.split("");
          var scale = 45 * _this5.size / 500;
          var verticalShift = -225 * _this5.size / 500;
          [].forEach.call(document.getElementsByClassName('fernPi-canvas'), function (el, index) {
            var context = el.getContext("2d");
            // [real, imaginary]
            var coords = [0, 0];
            _this5.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "black");

            var i = 0;
            while (i < 100000) {
              var random = Math.round(Math.random() * 100) / 100;
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
              _this5.plotPoint(context, coords[0] * scale, coords[1] * scale + verticalShift, "hsl(" + 360 / 10 * parseInt(PI[i % 10000], 10) + ", 50%, 50%)");
              i++;
            }
          });
        }
      });
    }
  }]);

  return Fractals;
})();