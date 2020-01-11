<template lang="pug">
  div.master-container
    //- Header
    MainView
    //- Footer
</template>

<script>

import Header from '~/components/Header.vue'
import MainView from '~/components/MainView.vue'
// import Footer from '~/components/Footer.vue'

export default {
  name: 'Index',
  components: {
    Header,
    MainView,
    // Footer
  },
}
</script>

<style lang="scss">

@import "./assets/scss/main.scss";

</style>
