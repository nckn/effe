<template lang="pug">
  div
    .panel
      PlayerNode(v-for="(node, index) in nodes" :node="node" :key="index")
    Footer
</template>

<script>

import PlayerNode from '~/components/PlayerNode.vue'
import Node from '~/components/Node.vue'
import Footer from '~/components/Footer.vue'

import globalFunctions from '~/mixins/globalFunctions'

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
      nodes: [
        {name: 'Player 1', type: 'player'},
        // {name: 'Player 2', type: 'player'}
      ],
      aC: null,
      sources: new Array(2),
      sourceGain: new Array(2),
      feedbackGain: null,
      fetchGain: null,
      delay: null,
      compressor: null,
      analyser: null,
      filter: null,
      masterGain: null,
      preGain: null,
      convoler: null,
      dry: null,
      wet: null,
      duration: 0.01,
      filterOn: false,
      effect_is_on: [false, false, false, false, false, false],
      newPlayer: false,
      tremoloIsAllowed: false,
      browser: 0,
      filterType: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'],
      filterValue: 0,
      // Tremolo
      tremolo: {
        isOn: false,
        ms: 0,
        round: 14,
        step: 0,
        period: 0
      },
      // PlayerNodes
      startTime: [0, 0],
      startOffset: [0, 0],
      curBuffer: [null, null]
    }
  },
  mounted () {
    var self = this
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    self.$nextTick(
      self.setupAudioNodes(),
      self.assignRightSize('node'),
      self.trackWindowResize()
    )
  },
  methods: {
    initAudio (data, num) {
      var self = this
      if (self.aC.decodeAudioData) {
        console.log('a')
        self.aC.decodeAudioData(data, function (buffer) {
          self.sources[num] = self.aC.createBufferSource()
          self.sources[num].connect(self.sourceGain[num])
          self.sources[num].buffer = buffer
          self.startAudio(buffer, num)
        }, function (e) {
          // console.log(e);
        })
      } else {
        console.log('b')
        self.sources[num].buffer = self.aC.createBuffer(data, false)
        self.startAudio()
      }
    },
    startAudio (buffer, num) {
      var self = this
      self.startTime[num] = self.aC.currentTime;
      self.sources[num].loop = true;
      // Start playback, but make sure we stay in bound of the buffer.
      // self.sources[num].start(0, self.startOffset[num] % self.buffer.duration)
      self.sources[num].start(0)
    },
    pauseTrack (num) {
      var s = this
      // self.startOffset[num] += self.aC.currentTime - self.startTime[num];
      // self.sources[num].stop(0);
      if(s.aC.state === 'running') {
        s.aC.suspend().then(function() {
          // susresBtn.textContent = 'Resume context';
        });
        console.log('suspending we are')
      } else if(s.aC.state === 'suspended') {
        console.log('unsuspending.......')
        s.aC.resume().then(function() {
          // susresBtn.textContent = 'Suspend context';
        });  
      }
    },
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
      s.routeAudioNodes()
    },
    routeAudioNodes () {
      var self = this
      for (var i = 0; i < self.sources.length; i++) {
        self.sources[i] = self.aC.createBufferSource()
        self.sources[i].connect(self.sourceGain[i])
        self.sourceGain[i].connect(self.convolver)
        self.sourceGain[i].connect(self.dry)
      }
      this.convolver.connect(this.wet);

      this.dry.connect(this.preGain)
      this.wet.connect(this.preGain)

      this.dry.gain.value = 1.0
      this.wet.gain.value = 0.0

      this.preGain.connect(this.delay)
      this.delay.connect(this.feedbackGain)
      this.feedbackGain.connect(this.delay)

      this.fetchGain.connect(this.masterGain)

      this.delay.connect(this.compressor)
      this.filter.connect(this.compressor)

      this.compressor.connect(this.masterGain)
      this.masterGain.connect(this.analyser)
      this.analyser.connect(this.aC.destination)

      for (var i = 0; i < this.sourceGain.length; i++) {
        this.sourceGain[i].gain.value = 6
      }

      this.feedbackGain.gain.value = 0
      this.masterGain.gain.value = 1
      this.filter.type = this.filterType[this.browser]
      this.filter.frequency.value = 4000
    },
    frameLooper () {
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
      this.ctx.fillStyle = 'hsla(0, 0%, 100%, .10)'
      this.ctx.fillStyle = graphFill;
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      var barWidth = (canvasWidth / bufferLength)
      var barHeight
      var x = 0
      for (var i = 0; i < bufferLength; i++) { // used to be bufferLength
        barHeight = dataArray[i]
        this.ctx.fillStyle = '#000' // 'rgb(' + (barHeight+100) + ',50,50)'
        this.ctx.fillRect(x, canvasHeight - barHeight / 2, barWidth, barHeight / 2)
        x += barWidth + 2
      }
      window.requestAnimationFrame(this.frameLooper.bind(this))
    },
    trackWindowResize () {
      if (typeof this.window !== undefined) {
        this.window.addEventListener('resize', this.assignRightSize('node'))
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
