<template lang="pug">
  div
    .overlay
    header
      a(href='index.html')
        .logo
    .panel
      .node.player
        #start-one.button-reg-one.invisible.drop(for='file-upload')
          label#upload-button-one(for='file-upload')
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
  components: {
    //
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
