const bufferMod = require("buffer");

// Polyfill SlowBuffer for legacy dependencies (buffer-equal-constant-time)
// The dependency expects require('buffer').SlowBuffer to exist.
if (!bufferMod.SlowBuffer) {
  bufferMod.SlowBuffer = bufferMod.Buffer;
  console.log("Polyfilled SlowBuffer for legacy dependencies");
}
