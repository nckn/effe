<template lang="pug">
  .panel
    Node(v-for="(node, index) in nodes" :node="node" :key="index")
</template>

<script>

import Node from '~/components/Node.vue'

export default {
  name: 'MainView',
  components: {
    Node
  },
  data () {
    return {
      nodes: [
        {name: 'Player 2', type: 'player'},
        {name: 'Player 2', type: 'player'}
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
      filterOn: false,
      effect_is_on: [false, false, false, false, false, false],
      newPlayer: false,
      tremoloIsAllowed: false,
      browser: 0,
      filterType: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'],
      filterValue: 0
    }
  },
  mounted () {
    var self = this
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    self.$nextTick(
      self.setupAudioNodes()
    )
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
