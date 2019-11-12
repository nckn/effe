<template lang="pug">
  .node.player(@drop="dropEvent" @dragover="dragOver" v-show="node.isOn" v-bind:id="player_id" v-bind:class="{ ishovering: isHovering }" @dragleave="turnOffHoverState")
    .gui-wrapper
      #start-one.button-reg-one.invisible.drop(for='file-upload' @click="togglePlay" ref="start_box" name="player-one" v-bind:class="{ on: node.isPlaying}")
        div#upload-button-one(for='file-upload' ref="upload_btn")
        #buttonicon.buttonicon(ref="buttonicon")
        // <h4 id="drag-instr"><p>drag song here</p></h4>
      output#infolist.artistinfo.one(ref="artist_info")
    .gui-wrapper
      input.volume-slider-one(type='range' name='color' min='0' max='1' step='0.01' @input="ctlVol")
    //- .songsearch
    //-   form
    //-     input#query(type='text' placeholder='Type the name of a song')
    //-     input(type='submit' value='Find')
    //-   #result(style="display:none;")
    //-     #text
    //-     div
    //-       svg#svg(width='100%' height='40')
    //-       button#play Play track
    //-     audio#audio
</template>

<script>

// import Logo from '~/components/Logo.vue'

export default {
  name: 'Node',
  props: ['node', 'player_id'],
  components: {
    //
  },
  data () {
    return {
      playToggle: null,
      isSoundPlaying: false,
      songData: null,
      windowIsOpen: false,
      zero: this.player_id,
      isHovering: false
    }
  },
  mounted () {
    var self = this
    self.startBox = self.$refs.start_box
    self.buttonIcon = self.$refs.buttonicon
    self.artistInfo = self.$refs.artist_info
    self.uploadBtn = self.$refs.upload_btn
  },
  methods: {
    ctlVol (e) {
      var target = e.target || e.srcElement
      this.$parent.controlVolume(target.value, this.zero)
    },
    togglePlay () {
      var self = this
      // self.playToggle = click.target.id
      // Get drop event target number
      if (self.songData === null) {
        return
      }
      if (self.isSoundPlaying) {
        self.isSoundPlaying = false
        self.$parent.pauseTrack(self.zero)
        self.startBox.classList.remove('on')
        self.buttonIcon.classList.remove('pause')
      } else {
        self.isSoundPlaying = true
        self.$parent.playAudio(self.songData, self.zero);
        self.startBox.classList.add('on')
        self.buttonIcon.classList.add('pause');
      }
    },
    dragOver (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.isHovering) {
        return
      }
      this.toggleHoverState()
      return false
    },
    toggleHoverState () {
      this.isHovering = !this.isHovering
    },
    turnOffHoverState () {
      console.log('leaving')
      this.isHovering = false
    },
    dropEvent (e) {
      var self = this
      e.stopPropagation()
      e.preventDefault()
      // Get drop event target number
      console.log(e.dataTransfer.files)
      // var num = this.className.substring(11, 14)
      // var cur = num == 'one' ? 0 : 1
      var droppedFiles = e.dataTransfer.files
      var reader = new FileReader()
      console.log('this is it: ' + this);
      console.log(typeof this);
      e.stopPropagation()
      e.preventDefault()
      reader.onload = function (fileEvent) {
        self.songData = fileEvent.target.result
        var str = droppedFiles[0].name
        // self.artistInfo.innerHTML = 'Song:<br />' + str
        self.artistInfo.innerHTML = str
        // Succesful load, allow window for playing
        self.windowIsOpen = true
        self.toggleHoverState()
        // document.querySelector('.button-reg.invisible.drop').style.border = 'none'
      }
      reader.readAsArrayBuffer(droppedFiles[0])
      self.startBox.classList.remove('invisible')
      self.startBox.classList.add('visible')
      // var playButton = 'start-' + num
      // document.getElementById(playButton).removeChild(document.getElementById('drag-instr'));
      self.uploadBtn.style.zIndex = -10
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
