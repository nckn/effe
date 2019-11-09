<template lang="pug">
  .node.player
    #start-one.button-reg-one.invisible.drop(for='file-upload')
      div#upload-button-one(for='file-upload' @change="dropEvent")
      #buttonicon.buttonicon
      // <h4 id="drag-instr"><p>drag song here</p></h4>
    output#infolist.artistinfo.one
      | Song:
      br
    input.volume-slider-one(type='range' name='color' min='0' max='5' step='0.1')
    .songsearch
      form
        input#query(type='text' placeholder='Type the name of a song')
        input(type='submit' value='Find')
      #result
        #text
        div
          svg#svg(width='100%' height='40')
          button#play Play track
        audio#audio
</template>

<script>

// import Logo from '~/components/Logo.vue'

export default {
  name: 'PlayerNode',
  components: {
    //
  },
}
</script>

<style lang="scss" scoped>

</style>
