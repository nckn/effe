<template lang="pug">
  .node.player(@drop="dropEvent" @dragover="dragOver" v-show="node.isOn" v-bind:id="player_id" v-bind:class="{ ishovering: isHovering && !fileIsLoading }" @dragleave="turnOffHoverState")
    .gui-wrapper
      h2 {{ node.name }}
      .button.square.top-right(@click="loadDemo" v-if="!isDemoPlaying")
        p Load demo
      .play-btn.invisible.drop(for='file-upload' @click="togglePlay" ref="start_box" v-bind:class="{ on: node.isPlaying}")
        div#upload-button-one(for='file-upload' ref="upload_btn")
        .play-icon(ref="buttonicon")
      output#infolist.artistinfo.one(ref="artist_info")
      input(
        style="display: none;"
        type="file"
        @change="dropEvent"
        ref="fileInput"
      )
      input.progress-slider(type='range' name='progress' min='0' max='1' step='0.001' v-model="progress" @input="scrubAndStop" @change="scrubStopPlay" v-bind:class="{ issleeping: !fileIsLoaded }")
    button.upload-btn(@click="$refs.fileInput.click()" v-show="!fileIsLoaded") {{ dragText }}
    .gui-wrapper(v-bind:class="{ issleeping: !fileIsLoaded }")
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

import { mapGetters, mapMutations } from 'vuex';

import globalFunctions from '~/mixins/globalFunctions'

// import Logo from '~/components/Logo.vue'
// https://freesound.org/data/previews/320/320801_2626519-lq.mp3

export default {
  name: `PlayerNode${1}`,
  mixins: [globalFunctions],
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
      playerID: this.player_id,
      isHovering: false,
      droppedFile: null,
      fileIsLoaded: false,
      fileIsLoading: false,
      demoLoaded: false,
      id: this.player_id,
      dragText: 'Click or drag an mp3 or wav file here',
      progress: 0,
      scrubbing: false
    }
  },
  mounted () {
    var self = this
    self.startBox = self.$refs.start_box
    self.buttonIcon = self.$refs.buttonicon
    self.artistInfo = self.$refs.artist_info
    self.uploadBtn = self.$refs.upload_btn
    // Here we are listening for the Space key, for toggling play
    document.body.onkeyup = function (e) {
      e.stopPropagation()
      e.preventDefault()
      if (!self.fileIsLoaded) {
        return
      }
      if (e.keyCode === 32) {
        // self.$store.dispatch('updatePlaybackState', self.playing ? false : true)
        self.togglePlay()
      }
    }
    // console.log('here we go: ' + this.$store.isDemoPlaying)
  },
  computed: {
    ...mapGetters({ isDemoPlaying:  "store/getPlayingState" })
  },
  methods: {
    ...mapMutations({ toggleDemo:  "store/toggleDemo" }),
    updateProgress (val) {
      var self = this
      // console.log('play progress is: ' + val)
      self.progress = val
    },
    scrubTimeline () {
      // var self = this
      // if (!self.scrubbing) {
      //   self.scrubAndStop()
      //   self.scrubbing = true
      // }
      // var target = this.target
      // console.log('hi there: ' + target.value)
      // console.log('hi there: ' + this)
      // self.progress = target.value
    },
    scrubAndStop () {
      // console.log('scrub and stop')
      var self = this
      // var target = this.target
      // console.log('val is: ' + self.progress)
      if (!self.isSoundPlaying) {
        return
      }
      self.$parent.pauseTrack(self.playerID)
      self.startBox.classList.remove('on')
      self.buttonIcon.classList.remove('pause')
      self.isSoundPlaying = false
      // if (!self.scrubbing) {
      //   self.scrubAndStop()
      //   self.scrubbing = true
      // } else {
      //   if (self.isSoundPlaying) {
      //     self.isSoundPlaying = false
      //     self.$parent.pauseTrack(self.playerID)
      //     self.startBox.classList.remove('on')
      //     self.buttonIcon.classList.remove('pause')
      //   } else {
      //     console.log('heyahhh')
      //   }
      // }
    },
    scrubStopPlay () {
      var self = this
      self.isSoundPlaying = true
      // self.$parent.playTrack(self.playerID, progress);
      self.$parent.playTrack(self.playerID, self.progress);
      self.startBox.classList.add('on')
      self.buttonIcon.classList.add('pause');
      // console.log('stopped: ' + self.playerID)
    },
    loadDemo () {
      var self = this
      self.$parent.fetchDemo(self.playerID)
      // Send to global bool
      self.toggleDemo()
      // self.passSongToParent(self.songData, self.playerID)
      // Pass audio buffer to parent
      // self.$parent.loadAudio(self.songData, self.playerID)
      // self.togglePlay()
      // self.$parent.frameLooper()
      // self.changeAppearance()
      // var playButton = 'start-' + num
      // document.getElementById(playButton).removeChild(document.getElementById('drag-instr'));
      // Not very dry - end
    },
    onFileSelected (e) {
      var self = this
      // console.log(e)
      self.droppedFile = e.target.files[0]
    },
    ctlVol (e) {
      var target = e.target || e.srcElement
      this.$parent.controlVolume(target.value, this.playerID)
    },
    togglePlay () {
      var self = this
      // self.playToggle = click.target.id
      // Get drop event target number
      // if (self.songData === null) {
      //   console.log('songdata is null')
      //   return
      // }
      if (self.isSoundPlaying) {
        // console.log('pause from player')
        self.isSoundPlaying = false
        self.$parent.pauseTrack(self.playerID)
        self.startBox.classList.remove('on')
        self.buttonIcon.classList.remove('pause')
      } else {
        // console.log('play from player')
        self.isSoundPlaying = true
        self.$parent.playAudio(self.songData, self.playerID)
        self.startBox.classList.add('on')
        self.buttonIcon.classList.add('pause')
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
    passSongToParent (data, id) {
      var self = this
      self.windowIsOpen = true
      self.fileIsLoading = true
      self.toggleHoverState()
      // self.$parent.frameLooper()
      // Pass audio buffer to parent
      self.$parent.loadAudio(data, id)
    },
    dropEvent (e) {
      var self = this
      // var target = e.target || e.srcElement
      e.stopPropagation()
      e.preventDefault()
      // console.log('event is: ')
      // console.log(e.target.files)
      // // console.log(self.logObject(e))
      // return
      self.isHovering = false
      if (e.dataTransfer) {
        console.log(e.dataTransfer.files)
        self.droppedFile = e.dataTransfer.files[0]
        // Check if file is sound
        var isSoundOkay = self.isFileSound(e.dataTransfer.files[0] || e.target.files[0])
        // console.log('file: ' + isSoundOkay)
        if (!isSoundOkay) {
          self.toggleHoverState()
          self.dragText = 'You need a good old mp3 or wav file. Try again!'
          return
        }
      } else if (e.target.files) {
        self.droppedFile = e.target.files[0]
      }
      // File reader
      var reader = new FileReader()
      reader.onload = function (fileEvent) {
        var str = self.droppedFile.name
        self.artistInfo.innerHTML = str
        self.songData = fileEvent.target.result
        self.passSongToParent(self.songData, self.playerID)
      }
      reader.readAsArrayBuffer(self.droppedFile)
      // var playButton = 'start-' + num
      // document.getElementById(playButton).removeChild(document.getElementById('drag-instr'));
    },
    allowPlayer () {
      var self = this
      self.startBox.classList.remove('invisible')
      self.startBox.classList.add('visible')
      self.uploadBtn.style.zIndex = -10
      // Load the audio
      self.fileIsLoaded = true
      // Hide the click load gui
      self.demoLoaded = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
