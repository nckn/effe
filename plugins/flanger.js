/* eslint-disable */
import Vue from 'vue'

// Vue.prototype.$myInjectedFunction = string => console.log('This is an example', string)
Vue.prototype.$myInjectedFunction = function (object) {
  // const sum, volume, overdrive;
  function createAudioNodes () {
    const ctx = object.aC
    const defaults = {
      active: false,
      drive: 30,
      volume: 1
    }
    const sum = ctx.createGain()
    const volume = ctx.createGain()
    const overdrive = ctx.createWaveShaper()
    console.log('is it this: ' + object.aC)
    // makeDistortionCurve (amount) {
    //   var k = typeof amount === 'number' ? amount : 50,
    //     n_samples = 44100,
    //     curve = new Float32Array(n_samples),
    //     deg = Math.PI / 180,
    //     i = 0,
    //     x
    //   for (; i < n_samples; ++i) {
    //     x = (i * 2) / n_samples - 1
    //     curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    //   }
    //   return curve
    // }
    // overdrive.curve = makeDistortionCurve(defaults.drive);
    // overdrive.oversample = '4x';
    // volume.gain.value = 1;

    // // Connect the nodes togther
    // input.connect(overdrive);
    // overdrive.connect(volume);
    // volume.connect(sum);
  }
  createAudioNodes()
}

// const overdrivePedal = function (input, index) {
//   // Default settings
//   const defaults = {
//     active: false,
//     drive: 30,
//     volume: 1
//   }

// // Create audio nodes
// const sum = ctx.createGain()
// const volume = ctx.createGain()
// const overdrive = ctx.createWaveShaper()

// const [output, toggle] = createInputSwitch(input, sum, defaults.active)

// // Set default values
// // @link https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
// function makeDistortionCurve (amount) {
//   var k = typeof amount === 'number' ? amount : 50,
//     n_samples = 44100,
//     curve = new Float32Array(n_samples),
//     deg = Math.PI / 180,
//     i = 0,
//     x
//   for (; i < n_samples; ++i) {
//     x = (i * 2) / n_samples - 1
//     curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
//   }
//   return curve
// }

// overdrive.curve = makeDistortionCurve(defaults.drive)
// overdrive.oversample = '4x'
// volume.gain.value = 1

// // Connect the nodes togther
// input.connect(overdrive)
// overdrive.connect(volume)
// volume.connect(sum)

// $pedalboard.appendChild(pedal);
