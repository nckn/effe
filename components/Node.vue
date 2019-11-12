<template lang="pug">
  .node.effect(v-bind:id="node.class_name" v-show="node.isOn")
    h2 {{ node.name }}
    canvas#analyser(v-if="node.class_name === 'graph'")
    .gui-wrapper.sliders(v-for="(s, index) in node.sliders" v-if="node.sliders")
      .slider-text
        label val
        output(id="speed-output" for="filter") {{ sliderVal }}
      input(v-bind:class="`${node.class_name}-${index}`" type="range" :min="s.min" :max="s.max" :step="s.step" v-model="sliderVal" @input="changeValParent" v-bind:name="node.class_name")
</template>

<script>

// import Logo from '~/components/Logo.vue'

export default {
  name: 'Node',
  props: ['node'],
  components: {
    //
  },
  data () {
    return {
      sliderVal: ''
    }
  },
  watch: {
    sliderVal () {
      // console.log('its changing ' + this.sliderVal)
    }
  },
  mounted () {
    var self = this
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
