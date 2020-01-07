<template lang="pug">
  .node.player(@drop="dropEvent" @dragover="dragOver" v-show="node.isOn" v-bind:id="player_id" v-bind:class="{ ishovering: isHovering && !fileIsLoaded }" @dragleave="turnOffHoverState")
    .gui-wrapper
      #start-one.button-reg-one.invisible.drop(for='file-upload' @click="togglePlay" ref="start_box" name="player-one" v-bind:class="{ on: node.isPlaying}")
        div#upload-button-one(for='file-upload' ref="upload_btn")
        .play-icon(ref="buttonicon")
        // <h4 id="drag-instr"><p>drag song here</p></h4>
      output#infolist.artistinfo.one(ref="artist_info")
      input(
        style="display: none;"
        type="file"
        @change="dropEvent"
        ref="fileInput"
      )
    button.upload-btn(@click="$refs.fileInput.click()" v-show="!fileIsLoaded") Drag a file or click to open
    .gui-wrapper
      input.volume-slider-one(type='range' name='color' min='0' max='1' step='0.01' @input="ctlVol" v-model="node.vol")
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
      isHovering: false,
      droppedFile: null,
      fileIsLoaded: false
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
    onFileSelected (e) {
      var self = this
      console.log(e)
      self.droppedFile = e.target.files[0]
    },
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
      // console.log('its in')
      self.isHovering = false
      if (e.dataTransfer) {
        console.log(e.dataTransfer.files)
        self.droppedFile = e.dataTransfer.files[0]
      } else {
        self.droppedFile = e.target.files[0]
      }
      // alert(e.target.files)
      // var num = this.className.substring(11, 14)
      // var cur = num == 'one' ? 0 : 1
      var reader = new FileReader()
      // console.log('this is it: ' + this);
      // console.log(typeof this);
      e.stopPropagation()
      e.preventDefault()
      reader.onload = function (fileEvent) {
        self.songData = fileEvent.target.result
        var str = self.droppedFile.name
        // self.artistInfo.innerHTML = 'Song:<br />' + str
        self.artistInfo.innerHTML = str
        // Succesful load, allow window for playing
        self.windowIsOpen = true
        self.toggleHoverState()
        self.$parent.frameLooper()
        // A file has been loaded. Hide the upload button
        self.fileIsLoaded = true
        // document.querySelector('.button-reg.invisible.drop').style.border = 'none'
      }
      reader.readAsArrayBuffer(self.droppedFile)
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
