<template lang="pug">
  .node.player
    #start-one.button-reg-one.invisible.drop(for='file-upload' @click="playSong" @drop="dropEvent" @dragover="dragOver")
      div#upload-button-one(for='file-upload')
      #buttonicon.buttonicon(ref="buttonicon")
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
  name: 'Node',
  components: {
    //
  },
  data () {
    return {
      playToggle: null,
      isSoundPlaying: [false, false],
      songData: null
    }
  },
  mounted () {
    var self = this
    self.buttonIcon = self.$refs.buttonicon
  },
  methods: {
    playSong () {
      var self = this
      self.playToggle = click.target.id
      // Get drop event target number
      var num = playToggle.substring(6, 9)
      var cur = num == 'one' ? 0 : 1
      console.log(num)
      if (isSoundPlaying[cur]) {
        isSoundPlaying[cur] = false
        self.pauseTrack(cur)
        d.getElementById('start-' + num).classList.remove('on')
        self.buttonIcon[cur].classList.remove('pause')
      } else {
        isSoundPlaying[cur] = true;
        self.$parent.initAudio(songData[cur], cur);
        d.getElementById('start-' + num).classList.add('on');
        self.buttonIcon[cur].classList.add('pause');
      }
    },
    dragOver (e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },
    dropEvent (e) {
      e.stopPropagation()
      e.preventDefault()
      // Get drop event target number
      console.log(e.dataTransfer.files)
      // var num = this.className.substring(11, 14)
      // var cur = num == 'one' ? 0 : 1
      // var droppedFiles = e.dataTransfer.files
      // var reader = new FileReader()
      // e.stopPropagation()
      // e.preventDefault()
      // reader.onload = function (fileEvent) {
      //   songData[cur] = fileEvent.target.result
      //   var str = droppedFiles[0].name
      //   document.querySelector('.artistinfo.' + num).innerHTML = 'Song:<br />' + str
      //   // document.querySelector('.button-reg.invisible.drop').style.border = 'none'
      // }
      // reader.readAsArrayBuffer(droppedFiles[0])
      // playBox[cur].classList.remove('invisible')
      // playBox[cur].classList.add('visible')
      // var playButton = 'start-' + num
      // // document.getElementById(playButton).removeChild(document.getElementById('drag-instr'));
      // document.getElementById('upload-button-' + num).style.zIndex = -10
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
