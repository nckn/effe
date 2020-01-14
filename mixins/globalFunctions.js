export default {
  methods: {
    convertRange: function (value, r1, r2) {
      return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0]
    },
    isFileSound (file) {
      // const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']
      const acceptedImageTypes = ['audio/mp3', 'audio/wav']
      return file && acceptedImageTypes.includes(file['type'])
    },
    getMillis() {
      var d = new Date()
      return d.getTime()
    },
    isSmall: function (val) {
      var self = this
      var breakp = val
      var scrW = window.innerWidth
      self.lgScreen = scrW < breakp
      return self.lgScreen
    },
    log: function (msg) {
      // return
      // console.log(msg)
    },
    pauseEvent (e) {
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
      e.cancelBubble = true
      e.returnValue = false
      return false
    },
    assignRightSize (elemString) {
      // Make sure always square
      // TODO: Make sure they are from beginning
      console.log('should resize')
      if (!elemString) {
        return
      }
      var idol = document.getElementsByClassName(elemString)
      if (!self.isSmScreen) {
        if (idol.length > 0) {
          var idolStyle = document.defaultView.getComputedStyle(idol[0], null)
          var idolWidth = parseInt(idolStyle.width, 10)
          for (var i = 0; i < idol.length; i++) {
            // console.log('here they are:' + idol[i])
            idol[i].style.height = '' + idolWidth + 'px'
            // idol[i].classList.add('revealed')
          }
        }
      }
      if (idolWidth === undefined) {
        setTimeout(() => {
          self.assignRightSize()
        }, 100)
      }
    },
    logObject (obj) {
      var output = ''
      var object = obj
      for (var property in object) {
        output += property + ': ' + object[property] + '; '
      }
      return output
    }
  }
}
