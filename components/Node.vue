<template lang="pug">
  .node.effect(v-bind:id="node.class_name" v-show="node.isOn")
    h2 {{ node.name }}
    .gui-wrapper.sliders(v-for="(s, index) in node.sliders")
      .slider-text
        label val
        output(id="speed-output" for="filter") {{ sliderVal }}
      input(v-bind:class="`${node.class_name}-${index}`" type="range" :min="s.min" :max="s.max" :step="s.step" v-model="sliderVal")
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
  }
}
</script>

<style lang="scss" scoped>

</style>
