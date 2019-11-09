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
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
