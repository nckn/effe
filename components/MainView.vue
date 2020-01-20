<template lang="pug">
  div.master
    .container.players.p-one
      //- PlayerNode(v-for="(node, index) in players" :node="node" :key="index" :player_id="index")
      PlayerNode(:node="players[0]" :key="0" :player_id="0")
    .container.fx
      Node(v-for="(node, index) in nodes" :node="node" :key="`node-${index}`" :node_id="index")
    .container.players.p-two
      PlayerNode(:node="players[1]" :key="1" :player_id="1")
    Footer(:nodes="nodes" ref="testa")
</template>

<script>

import PlayerNode from '~/components/PlayerNode.vue'
import Node from '~/components/Node.vue'
import Footer from '~/components/Footer.vue'

import globalFunctions from '~/mixins/globalFunctions'

// import flanger from '~/plugins/flanger.js'

// import {Flanger} from 'audio-effects'
// const flanger = null

export default {
  name: 'MainView',
  mixins: [globalFunctions],
  components: {
    PlayerNode,
    Node,
    Footer
  },
  data () {
    return {
      players: [
        {name: 'Player 1', type: 'player', isPlaying: false, isOn: true, vol: 0.8, id: 0, demoUrl: '/snd/effe-beat-1.wav', arrayBuffer: null},
        {name: 'Player 2', type: 'player', isPlaying: false, isOn: true, vol: 0.8, id: 1, demoUrl: '/snd/effe-bass-1.wav', arrayBuffer: null}
      ],
      nodes: [
        {name: 'Visualizer', class_name: 'graph', isOn: true},
        {name: 'Speed', class_name: 'speed', isOn: true, sliders: [
          {name: 'Speed', min: 0.1, max: 1.9, step: 0.02, value: 1, default: 1}
        ]},
        {name: 'Reverb', class_name: 'reverb', isOn: true, sliders: [
          {name: 'Wet', min: 0, max: 200, step: 1, value: 0, default: 0}
        ]},
        {name: 'Filter', class_name: 'filter', isOn: true, sliders: [
          {name: 'Value', min: 0, max: 22050, step: 1, value: 0, default: 0, curFilter: 'allpass'},
          // {name: 'Tremolo', min: 1, max: 20, step: 1, value: 0, default: 10}
          {name: 'vSpeed', min: 0, max: 20, step: 0.1, value: 0, default: 3},
          {name: 'vDepth', min: 0, max: 1, step: 0.01, value: 0, default: 0.002}
        ]},
        {name: 'Delay', class_name: 'delay', isOn: true, sliders: [
          {name: 'Delay time', min: 0, max: 1.5, step: 0.05, value: 0, default: 10},
          {name: 'Feedback', min: 0, max: 0.9, step: 0.01, value: 0, default: 0.45}
        ]},
        {name: 'Distortion', class_name: 'distortion', isOn: true, sliders: [
          {name: 'Drive', min: 0, max: 100, step: 1, value: 0, default: 0}
        ]}
      ],
      aC: null,
      sources: new Array(2),
      sourceGain: new Array(2),
      srcs: [
        {src: null, startTime: 0, childNo: 0, progress: 0, offset: 0, isVirgin: true},
        {src: null, startTime: 0, childNo: 7, progress: 0, offset: 0, isVirgin: true}
      ],
      feedbackGain: null,
      fetchGain: null,
      delay: null,
      compressor: null,
      analyser: null,
      filter: null,
      distortion: null,
      masterGain: null,
      preGain: null,
      convoler: null,
      dry: null,
      wet: null,
      duration: 0.01,
      filterOn: false,
      effect_is_on: [false, false, false, false, false, false],
      browser: 0,
      filterType: ['allpass', 'lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch'],
      filterValue: 0,
      // Tremolo
      cspeed: 0,
      cdepth: 3,
      // tremolo: {
      //   isOn: true,
      //   ms: 0,
      //   round: 14,
      //   step: 0,
      //   period: 0,
      //   filterVal: 0
      // },
      // PlayerNodes
      // startTime: [0, 0],
      curBuffer: [null, null],
      songData: [null, null],
      sliderOffset: [0, 0],
      arrayBuffersDone: 0,
      progressListens: true,
      newOffset: 0
    }
  },
  mounted () {
    var self = this
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    self.$nextTick(
      self.setupAudioNodes(),
      self.assignRightSize('node'),
      // self.assignRightSize('effects'),
      self.trackWindowResize(),
      self.prepareAnalyser(),
      self.setReverb(),
      self.setupFlanger()
    )
    // Avoid scroll down when hitting space
    document.body.onkeydown = function (e) {
      if (e.keyCode === 32) {
        e.stopPropagation()
        e.preventDefault()
      }
    }
    // Here we are listening for the Space key, for toggling play
    document.body.onkeyup = function (e) {
      // e.stopPropagation()
      // e.preventDefault()
      // if (!self.fileIsLoaded) {
      //   return
      // }
      if (e.keyCode === 32) {
        // self.$store.dispatch('updatePlaybackState', self.playing ? false : true)
        self.$children[0].togglePlay()
        self.$children[7].togglePlay()
        // self.togglePlay()
      }
    }
  },
  methods: {
    setupAudioNodes () {
      var s = this
      s.aC = new AudioContext()
      s.feedbackGain = s.aC.createGain() || s.aC.createmasterGain()
      s.fetchGain = s.aC.createGain() || s.aC.createmasterGain()
      s.delay = s.aC.createDelay() || s.aC.createDelayNode()
      s.compressor = s.aC.createDynamicsCompressor()
      s.analyser = s.aC.createAnalyser()
      s.filter = s.aC.createBiquadFilter()
      s.masterGain = s.aC.createGain()
      s.preGain = s.aC.createGain()
      s.sourceGain[0] = s.aC.createGain()
      s.sourceGain[1] = s.aC.createGain()
      s.convolver = s.aC.createConvolver()
      s.dry = s.aC.createGain()
      s.wet = s.aC.createGain()
      s.outputMix = s.aC.createGain()
      // dryGain = audioContext.createGain();
      s.wetGain = s.aC.createGain()
      s.routeAudioNodes()
    },
    routeAudioNodes () {
      var self = this
      for (var i = 0; i < self.srcs.length; i++) {
        self.srcs[i].src = self.aC.createBufferSource()
        // self.srcs[i].loop = true
        self.srcs[i].src.connect(self.sourceGain[i])
        self.sourceGain[i].connect(self.convolver)
        self.sourceGain[i].connect(self.dry)
      }
      self.convolver.connect(self.wet);

      self.dry.connect(self.preGain)
      self.wet.connect(self.preGain)

      self.dry.gain.value = 1.0
      self.wet.gain.value = 0.0

      self.preGain.connect(self.filter)
      self.filter.connect(self.delay)
      self.delay.connect(self.feedbackGain)
      self.feedbackGain.connect(self.delay)

      // Spotify source I suppose
      self.fetchGain.connect(self.masterGain)

      // self.filter.connect(self.compressor)
      self.tNode = self.createVibrato()

      self.delay.connect(self.tNode.tremolo)
      self.tNode.tremolo.connect(self.tNode.depthOut)
      self.tNode.depthOut.connect(self.tNode.sum)
      self.delay.connect(self.tNode.depthIn)
      self.tNode.depthIn.connect(self.tNode.sum)
      self.tNode.sum.connect(self.compressor)
      
      self.compressor.connect(self.masterGain)
      self.masterGain.connect(self.analyser)
      self.analyser.connect(self.aC.destination)

      // for (var i = 0; i < self.sourceGain.length; i++) {
      //   self.sourceGain[i].gain.value = 6
      // }

      self.feedbackGain.gain.value = 0
      self.masterGain.gain.value = 1
      // self.filter.type = self.filterType[self.browser]
      self.filter.type = self.filterType[0]
      self.filter.frequency.value = 440
    },
    fetchDemo (id) {
      var self = this
      // console.log(id)
      self.players.forEach(elem => {
        window
          .fetch(elem.demoUrl)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            // playButton.disabled = false
            // yodelBuffer = audioBuffer
            // console.log('arrayBuffersDone: ' + self.arrayBuffersDone)
            elem.arrayBuffer = arrayBuffer
            self.arrayBuffersDone++
            if (self.arrayBuffersDone >= 2) {
              // alert('arrayBuffersDone: ' + self.arrayBuffersDone)
              if (self.srcs[0].isVirgin) {
                console.log('is null')
                self.loadAudio(self.players[0].arrayBuffer, 0)
              } else {
                console.log('is not null. ' + self.srcs[0].src)
              }
              if (self.srcs[1].isVirgin) {
                self.loadAudio(self.players[1].arrayBuffer, 1)
              }
            }
            // return arrayBuffer
          })
      })
      // Hide demo load button
      self.demoLoaded = true
    },
    loadAudio (data, num) {
      var self = this
      var trackData = new ArrayBuffer(data)
      console.log('we are loading: ' + trackData);
      // console.log('the log is: ' + typeof trackData);
      self.aC.decodeAudioData(data, function (buffer) {
        self.srcs[num].src = self.aC.createBufferSource()
        self.srcs[num].src.connect(self.sourceGain[num])
        self.srcs[num].src.loop = true
        // Flag source as hasOne
        self.srcs[num].isVirgin = false
        // Reverse buffer
        // Array.prototype.reverse.call( buffer.getChannelData(0) )
        // Array.prototype.reverse.call( buffer.getChannelData(1) )
        // self.filter.connect(self.sourceGain[num])
        self.srcs[num].src.buffer = buffer
        self.songData[num] = buffer
        self.sourceGain[num].gain.value = 0.5
        // console.log('success.')
        // Change appearance of players now that everything is loaded
        if (num === 0) {
          self.$children[0].allowPlayer()
        } else if (num === 1) {
          self.$children[7].allowPlayer()
        }
        // Show visualizer
        self.frameLooper()
      }, function (e) {
        console.log('it fails: ' + e)
      })
    },
    playAudio (obj) {
      var self = this
      // console.log('play audio: ' + num)
      // self.progressOfSources()
      self.srcs[obj.id].startTime = self.aC.currentTime
      self.srcs[obj.id].src = self.aC.createBufferSource()
      self.srcs[obj.id].src.buffer = self.songData[obj.id]
      self.sourceGain[obj.id].gain.value = 0.5
      self.srcs[obj.id].src.connect(self.sourceGain[obj.id])
      // self.sourceGain[obj.id].connect(self.aC.destination)
      // console.log('what is offset: ' + self.srcs[obj.id].offset)
      // console.log('what is remainder: ' + self.srcs[obj.id].offset % self.srcs[obj.id].src.buffer.duration)
      // SLIDER: Play command came from slider and it brought a value
      if (obj.progress) {
        // self.sliderOffset[obj.id] = obj.progress
        // self.newOffset = self.srcs[obj.id].src.buffer.duration * obj.progress
        self.newOffset = self.srcs[obj.id].src.buffer.duration * obj.progress
        self.sliderOffset[obj.id] = parseFloat(obj.progress)
        self.progressListens = false /* Because scrub happened */
        self.srcs[obj.id].src.start(self.aC.currentTime, self.newOffset, self.srcs[obj.id].src.buffer.duration)
      }
      // PLAY BUTTON: It came from the play button and must rely on ongoing progress
      else
      {
        self.srcs[obj.id].src.start(0, self.srcs[obj.id].offset % self.srcs[obj.id].src.buffer.duration)
        self.sliderOffset[obj.id] = parseFloat(self.srcs[obj.id].progress)
      }
      self.srcs[obj.id].src.loop = true
      // Animate progress
      // self.progressListens = true
      self.progressOfSources()
      console.log('src startTime: ' + self.srcs[obj.id].startTime)
      console.log('self.newOffset: ' + self.newOffset)
      console.log('self.sliderOffset[obj.id]: ' + self.sliderOffset[obj.id])
    },
    pauseTrack (num) {
      // Called when play buttons are called and when scrub starts
      var s = this
      s.srcs[num].offset += s.aC.currentTime - s.srcs[num].startTime
      // console.log('pause track')
      console.log('offset is: ' + s.srcs[num].offset)
      console.log('aC.currentTime is: ' + s.aC.currentTime)
      if (s.srcs[num].src) {
        s.srcs[num].src.disconnect()
        s.srcs[num].src.stop(0)
        s.srcs[num].src = null
      }
    },
    progressOfSources () {
      var self = this
      // console.log('in loop');
      self.srcs.forEach((element, index) => {
        // console.log(element)
        if (!element.isVirgin) {
          var childNo = element.childNo /* Which element */
          // console.log(element.src.buffer)
          // return
          if (!element.src) {
            return
          }
          if (self.progressListens) {
            // if (index === 0) {
            //   return
            // }
            // console.log('progressListens is true')
            if (element.src.buffer.duration) {
              var newTime = (self.aC.currentTime) - (element.startTime)
              // console.log('currentTime - startTime: ' + newTime.toFixed(2))
              // element.progress = self.sliderOffset[index] + ((self.aC.currentTime - element.startTime) / element.src.buffer.duration)
              element.progress = (newTime / element.src.buffer.duration) + self.sliderOffset[index] // org
              console.log('progress: ' + parseFloat(element.progress).toFixed(3))
              if (element.progress >= 1) {
                self.sliderOffset[index] = 0
                self.srcs[index].startTime = self.aC.currentTime
              } 
              // element.progress = ((self.aC.currentTime - (element.offset)) / element.src.buffer.duration) // closer to ideal
              // element.progress = parseFloat(self.sliderOffset[index] + ((self.aC.currentTime - element.startTime) / element.src.buffer.duration)) // closer to ideal
            }
          } else {
            // console.log('progressListens is false')
            // element.progress = self.sliderOffset[index]
            element.progress = self.newOffset
            self.progressListens = true
            // element.startTime = self.aC.currentTime
          }
          if (this.$children[childNo].checkIfPlaying()) {
            this.$children[childNo].updateProgress(element.progress)
          }
          // console.log('self.aC.currentTime: ' + self.aC.currentTime)
          // console.log('self.srcs[0].startTime: ' + self.srcs[0].startTime)
          // console.log('newOffset: ' + self.newOffset)
          // console.log('duration: ' + element.src.buffer.duration)
          // console.log('currentTime - startTime: ' + newTime)
          // if (index === 1) {
          //   // console.log('progress: ' + element.progress.toFixed(2))
          //   this.$children[childNo].updateProgress(element.progress)
          // }
          // this.$children[childNo].updateProgress(0.5)
          // console.log('the log is: ' + null);
        }
      })
      window.requestAnimationFrame(self.progressOfSources)
    },
    iterateFilter () {
      var s = this
      s.browser++
      if (s.browser > s.filterType.length) {
        s.browser = 0
      }
      s.filter.type = s.filterType[s.browser]
      s.nodes[3].sliders[0].curFilter = s.filter.type
    },
    resetFilter () {
      var s = this
      s.filter.type = 'allpass'
      s.browser = 0
    },
    setReverb () {
      var self = this
      var loadImpulse = function (fileName) {
        // console.log('load Impulse')
        var url = '/snd/GraffitiHallway.wav'
        var request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'arraybuffer'
        request.onload = function () {
          self.aC.decodeAudioData(request.response, function (buffer) {
            self.convolver.buffer = buffer;
          }, function (e) { 
            console.log(e)
            // console.log('it worked')
          })
        }
        request.onerror = function (e) {
          console.log(e)
          console.log('didnt work')
        }
        request.send()
      }
      loadImpulse(0)
      self.mix(0)
    },
    mix (value) {
      var reverb = value / 80.0;
      this.dry.gain.value = (1.0 - reverb);
      this.wet.gain.value = reverb;
    },
    changeReverb (value, type) {
      var self = this
      var value = parseFloat(value)
      switch (type) {
        case 'mix':
          self.mix(value)
          break
      }
    },
    createVibrato() {
      var self = this
      // Default settings
      const defaults = {
        speed: 3,
        depth: 0.3,
        wave: 'sine',
        active: true
      };

      // Create audio nodes
      const sum = self.aC.createGain()
      const lfo = self.aC.createOscillator()
      const tremolo = self.aC.createGain()
      const depthIn = self.aC.createGain()
      const depthOut = self.aC.createGain()
      const filter = self.aC.createBiquadFilter()

      filter.type = 'lowpass';
      filter.Q.value = parseFloat(1)
      // lplfofilter = filter

      // filter.frequency.value = 2500;  // center frequency - this is kinda arbitrary.
      // depthOut.gain.value = 2500 * parseFloat( 1 )
      
      // const [output, toggle] = self.createInputSwitch(input, sum, defaults.active)

      // Set default values
      lfo.frequency.value = self.cspeed
      depthIn.gain.value = 1 - self.cdepth
      depthOut.gain.value = self.cdepth

      // Connect the nodes togther
      lfo.connect(filter)
      filter.connect(tremolo.gain)
      lfo.start()
      // input.connect(tremolo)
      // tremolo.connect(depthOut)
      // depthOut.connect(sum)
      // input.connect(depthIn)
      // depthIn.connect(sum)
      self.tremolo = {
        speed: lfo.frequency.value,
        depth: depthIn.gain.value
      }
      return {lfo, sum, tremolo, depthOut, depthIn, filter}
    },
    changeVibrato (target) {
      var self = this
      // console.log('im here')
      if (target.id === 'sli-1') {
        self.tNode.lfo.frequency.value = parseFloat( target.value )
        // console.log('slider 1')
      } else if (target.id === 'sli-2') {
        self.tNode.depthIn.gain.value = 1 - Number(target.value)
        self.tNode.depthOut.gain.value = Number(target.value)
        // console.log('slider 2')
      } else if (target.id === 'sli-3') {
        // self.cspeed.frequency.value = parseFloat( target.value )
      }
    },
    changeDrive (value) {
      var self = this
      self.distortion.overdrive.curve = self.distortion.obj(Number(value))
      var distGain = self.convertRange(value, [0, 100], [0.9, 0.3])
      self.distortion.volume.gain.value = distGain
    },
    prepareAnalyser () {
      if (document.getElementById('analyser')) {
        this.canvas = document.getElementById('analyser')
        this.ctx = this.canvas.getContext('2d')
        console.log('preparing analyzer')
      }
    },
    toggleNode (id) {
      var self = this
      self.nodes[id].isOn = self.nodes[id].isOn ? false : true
      // console.log('id is: ' + id)
    },
    togglePlayerTwo () {
      var self = this
      self.players[1].isOn = self.players[1].isOn ? false : true
      // console.log('id is: ' + id)
    },
    changeVal (target, value) {
      var s = this
      var val = value ? value : target.value
      // console.log('val is: ' + val)
      switch (target.name) {
        case 'speed':
          if (s.srcs[0].src) {
            s.srcs[0].src.playbackRate.value = val
          }
          if (s.srcs[1].src) {
            s.srcs[1].src.playbackRate.value = val
          }
          break
        case 'delay':
          if (target.id === 'sli-0') {
            s.delay.delayTime.value = val
          } else if (target.id === 'sli-1') {
            s.feedbackGain.gain.value = val
          }
          break
        case 'reverb':
          s.changeReverb(val, 'mix')
          break
        case 'filter':
          if (target.id === 'sli-0') {
            s.filter.frequency.value = val
          } else if (target.id === 'sli-1' || target.id === 'sli-2' || target.id === 'sli-3') {
            s.changeVibrato(target)
          }
          break
        case 'distortion':
          // s.changeReverb(val, 'mix')
          // console.log('valyuhuuue: ' + val)
          s.changeDrive(val)
          break
        default:
          console.log('Nothing happens...')
      }
    },
    controlVolume (val, num) {
      // console.log('logging value: ' + val + ', and is of type: ' + typeof val)
      this.sourceGain[num].gain.value = val
    },
    crossFadeVolume (val) {
      var self = this
      // var gainOne = 1 - val
      // var gainTwo = val
      var gainOne = self.convertRange( val, [ 0.1, 1.9 ], [ 1, 0 ] )
      var gainTwo = self.convertRange( val, [ 0.1, 1.9 ], [ 0, 1 ] )
      // console.log('gainOne: ' + gainOne + ', ' + 'gainTwo: ' + gainTwo)
      // Snapping effect. Snaps to zero
      // this.sourceGain[0].gain.value = (gainOne > 0.2) ? gainOne : 0
      // this.sourceGain[1].gain.value = (gainTwo > 0.2) ? gainTwo : 0
      // this.players[0].vol = (gainOne > 0.1) ? gainOne : 0
      // this.players[1].vol = (gainTwo > 0.1) ? gainTwo : 0
      // gainOne = (gainOne > 0.1) ? gainOne : 0
      // gainTwo = (gainTwo > 0.1) ? gainTwo : 0
      this.sourceGain[0].gain.value = gainOne
      this.sourceGain[1].gain.value = gainTwo
      this.players[0].vol = gainOne
      this.players[1].vol = gainTwo
    },
    setupFlanger () {
      var self = this
      var obj = self.logObject(this.$children)
      // console.log('finding other player: ')
      // console.log(this.$children)
      // console.log(this.$children[0])
      // flanger.logThis()
      // makeDistortionCurve(Number(event.target.value))
      self.distortion = this.$myInjectedFunction({
        input: self.compressor,
        ctx: self.aC
      })
      self.compressor.disconnect(self.masterGain)
      // self.compressor.connect(distortion)
      self.distortion.sum.connect(self.masterGain)
      // const distortion = new this.myInjectedFunction.distortion()
      // self.overdrive = new Flanger.Overdrive()
      // console.log(self.overdrive)
      // console.log('obj is: ' + self.distortion.obj)
      // console.log('compressor is: ' + self.compressor)
      // distortion.connect(s.aC)
      // Prepare flanger node
      // flanger = new Flanger(s.aC)
      // flanger.delay = 0.005; // Set the delay to 0.005 seconds
      // flanger.depth = 0.002; // Set the depth to 0.002
      // flanger.feedback = 0.5; // Set the feedback to 50%
      // flanger.speed = 0.25; // Set the speed to 0.25 Hz
    },
    frameLooper (ctx) {
      var self = this
      var fbc_array, bar_x, bar_width, bar_height, graphFill = '#ececec'
      var canvasWidth = document.getElementById('analyser').width
      var canvasHeight = document.getElementById('analyser').height
      this.analyser.fftSize = 64
      var bufferLength = this.analyser.frequencyBinCount
      var dataArray = new Uint8Array(bufferLength)
      this.analyser.minDecibels = -90
      this.analyser.maxDecibels = -10
      this.analyser.smoothingTimeConstant = 0.90
      this.analyser.getByteFrequencyData(dataArray)
      this.ctx.fillStyle = graphFill;
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      var barWidth = (canvasWidth / bufferLength)
      var barHeight
      var x = 0
      for (var i = 0; i < bufferLength; i++) { // used to be bufferLength
        barHeight = dataArray[i]
        this.ctx.fillStyle = '#dc5050' // 'rgb(' + (barHeight+100) + ',50,50)'
        this.ctx.fillRect(x, canvasHeight - barHeight / 2, barWidth, barHeight / 2)
        x += barWidth + 2
      }
      window.requestAnimationFrame(this.frameLooper.bind(this))
    },
    trackWindowResize () {
      window.addEventListener('resize', () => {
        // console.log('yeah hello')
        this.assignRightSize('node')
      })
      this.window.addEventListener('resize', this.assignRightSize('node'))
      // if (typeof this.window !== undefined) {
      //   this.window.addEventListener('resize', this.assignRightSize('node'))
      // }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
