/* eslint-disable */
import Vue from 'vue'

// Vue.prototype.$myInjectedFunction = string => console.log('This is an example', string)
Vue.prototype.$myInjectedFunction = function (_options) {
  // const sum, volume, overdrive;
  function createAudioNodes () {
    const ctx = _options.ctx
    const input = _options.input
    const defaults = {
      active: false,
      drive: 0,
      volume: 1
    }
    const sum = ctx.createGain()
    const volume = ctx.createGain()
    const overdrive = ctx.createWaveShaper()
    
    // console.log('is it this: ' + ctx)
    var makeDistortionCurve = function (amount) {
      var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x
      for (; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
      }
      console.log('val is: ' + amount)
      // volume.gain.value += -(amount * 0.01)
      return curve
    }
    overdrive.curve = makeDistortionCurve(defaults.drive);
    overdrive.oversample = '4x';
    volume.gain.value = 1;

    // Connect the nodes togther
    input.connect(overdrive);
    overdrive.connect(volume);
    volume.connect(sum);
    // sum.connect(ctx.destination);
    return { 
      sum: sum,
      overdrive: overdrive,
      volume: volume,
      obj: makeDistortionCurve
    }
  }
  return createAudioNodes()
}

class NewNode {
  constructor() {
    this.writeThis()
  }
  writeThis() {
    // console.log('haasdasdasd')
  }
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
