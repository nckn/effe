<template lang="pug">
  div.master
    .panel
      PlayerNode(v-for="(node, index) in players" :node="node" :key="index" :player_id="index")
      Node(v-for="(node, index) in nodes" :node="node" :key="`node-${index}`")
    Footer(:nodes="nodes")
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
      players: [
        {name: 'Player 1', type: 'player', isPlaying: false, isOn: true},
        {name: 'Player 2', type: 'player', isPlaying: false, isOn: false}
      ],
      nodes: [
        {name: 'Graph', class_name: 'graph', isOn: true},
        {name: 'Speed', class_name: 'speed', isOn: true, sliders: [
          {min: 0.1, max: 1.9, step: 0.02, value: 1}
        ]},
        {name: 'Reverb', class_name: 'reverb', isOn: true, sliders: [
          {min: 0, max: 200, step: 1, value: 0}
        ]},
        {name: 'Filter', class_name: 'filter', isOn: true, sliders: [
          {name: '', min: 0, max: 200, step: 1, value: 0},
          {name: 'Tremolo', min: 1, max: 20, step: 1, value: 0}
        ]},
        {name: 'Delay', class_name: 'delay', isOn: true, sliders: [
          {min: 0, max: 4.9, step: 0.001, value: 0},
          {min: 0, max: 0.9, step: 0.01, value: 0}
        ]}
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
      curBuffer: [null, null],
      sD: [null, null]
    }
  },
  mounted () {
    var self = this
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    self.$nextTick(
      self.setupAudioNodes(),
      self.assignRightSize('node'),
      self.trackWindowResize(),
      self.prepareAnalyser()
    )
  },
  methods: {
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
    playAudio (data, num) {
      var self = this
      self.startTime[num] = self.aC.currentTime
      if (self.sD[num] === null) {
        // Has not been decoded or played yet
        self.aC.decodeAudioData(data, function (buffer) {
          self.sources[num] = self.aC.createBufferSource()
          self.sources[num].connect(self.sourceGain[num])
          self.sources[num].buffer = buffer
          self.sD[num] = buffer
          self.sourceGain[num].gain.value = 0.5
          self.sources[num].loop = true
          self.sources[num].connect(self.sourceGain[num])
          self.sourceGain[num].connect(self.aC.destination)
          self.sources[num].start(self.aC.currentTime, self.startOffset[num], self.sources[num].buffer.duration)
          // self.startAudio(buffer, num)
        }, function (e) {
          // console.log(e);
        })
      } else {
        // Has already been decoded and played once
        self.sources[num] = self.aC.createBufferSource()
        self.sources[num].connect(self.sourceGain[num])
        self.sources[num].buffer = self.sD[num]
        self.sourceGain[num].gain.value = 0.5
        self.sources[num].loop = true
        self.sources[num].connect(self.sourceGain[num])
        self.sourceGain[num].connect(self.aC.destination)
        self.sources[num].start(0, self.startOffset[num] % self.sources[num].buffer.duration)
      }
    },
    startAudio (buffer, num) {
      var self = this
    },
    pauseTrack (num) {
      var s = this
      s.startOffset[num] += s.aC.currentTime - s.startTime[num];
      if (s.sources[num]) {
        s.sources[num].disconnect()
        s.sources[num].stop(0)
        s.sources[num] = null
      }
    },
    changeVal (target) {
      var s = this
      var val = target.value
      switch (target.name) {
        case 'speed':
          s.sources[0].playbackRate.value = val
          s.sources[1].playbackRate.value = val
          break
        case 'delay':
          s.delay.delayTime.value = val
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
      var gainOne = 1.9 - val
      var gainTwo = val
      this.sourceGain[0].gain.value = (gainOne > 0.2) ? gainOne : 0
      this.sourceGain[1].gain.value = (gainTwo > 0.2) ? gainTwo : 0
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
