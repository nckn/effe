<template lang="pug">
  .lower-bar
    .effects
      h4 graph
    .effects
      h4 speed
    .effects
      h4 reverb
    .effects
      h4 filter
    .effects
      h4 delay
    .effects.player-two
      h4 player
    .crossfader-box
      h4 track 1
      input.crossfader(type='range' min='0.1' max='1.9' step='0.01' value='1')
      h4 track 2
</template>

<script>

// import Logo from '~/components/Logo.vue'

export default {
  name: 'Footer',
  components: {
    //
  },
}
</script>

<style lang="scss" scoped>

</style>
