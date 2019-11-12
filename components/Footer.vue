<template lang="pug">
  .lower-bar
    .effects(v-for="(node, index) in nodes" @click="toggleNodeParent(index)" v-bind:id="index" v-bind:class="{ ison: node.isOn }")
      h4 {{ node.name }}
    .effects.player-two(@click="togglePlayerTwoParent")
      h4 Player 2
    .crossfader-box
      h4 track 1
      input.crossfader(type='range' min='0.1' max='1.9' step='0.01' value='1')
      h4 track 2
</template>

<script>

// import Logo from '~/components/Logo.vue'

export default {
  name: 'Footer',
  props: ['nodes'],
  components: {
    //
  },
  methods: {
    toggleNodeParent (id) {
      // var target = elem.target || elem.srcElement
      this.$parent.toggleNode(id)
      // console.log('id is: ' + typeof id)
    },
    togglePlayerTwoParent () {
      // var target = elem.target || elem.srcElement
      this.$parent.togglePlayerTwo()
      // console.log('id is: ' + typeof id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
