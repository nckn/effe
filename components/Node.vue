<template lang="pug">
  .node.effect(v-bind:id="node.class_name" v-show="node.isOn")
    h2 {{ node.name }}
    canvas#analyser(v-if="node.class_name === 'graph'")
    .gui-wrapper.sliders(v-for="(s, index) in node.sliders" v-if="node.sliders")
      .slider-text
        label {{ s.name }}
        output(id="speed-output" for="filter") {{ s.value }}
      input(v-bind:class="`${node.class_name}-${index}`" type="range" :min="s.min" :max="s.max" :step="s.step" v-model="s.value" @input="changeValParent" v-bind:name="node.class_name" :id="`sli-${index}`" @dblclick="resetValue")
</template>

<script>

// import Logo from '~/components/Logo.vue'

export default {
  name: 'Node',
  props: ['node', 'node_id'],
  components: {
    //
  },
  data () {
    return {
      sliderVal: [],
      index: this.node_id
    }
  },
  watch: {
    sliderVal () {
      console.log('its changing ' + this.sliderVal)
    }
  },
  mounted () {
    var self = this
    if (self.node.sliders) {
      console.log(self.node.sliders[0])
    }
    // if (self.node.class_name === 'graph') {
    //   var canvas = document.getElementById('analyser');
    //   var ctx = canvas.getContext('2d')
    //   console.log('it totally is')
    //   self.$parent.frameLooper(ctx)
    // }
  },
  methods: {
    changeValParent (e) {
      var target = e.target || e.srcElement
      // console.log(target.name)
      this.$parent.changeVal(target)
    },
    resetValue (e) {
      var self = this
      var target = e.target || e.srcElement
      console.log('resetting')
      console.log('node: ' + this.node.sliders[0].name)
      var subStr = parseInt(target.id.split('-')[1])
      console.log('target: ' + typeof subStr)
      var node = this.node.sliders[subStr]
      node.value = node.default
      // this.node.sliders[this.index].value = 0.5
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
