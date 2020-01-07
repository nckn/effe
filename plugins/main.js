/* eslint-disable */

export default ({ app }) => {
  var d = document;

  // var source = new Array(2), convolver, dry, wet = 0,
  //   duration = 0.01;

  // var fetchGain;

  // // Booleans
  // filterOn = false,
  //   effect_is_on = [false, false, false, false, false, false],
  //   newPlayer = false,
  //   tremoloIsAllowed = false;

  // var browser = 0, filterType = ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'],
  //   filterValue = 0;

  // // assign effect buttons
  // var effectButton = document.querySelectorAll('.effects'),
  //   graphicButton;

  var xhr;

  var newSetup;

  var awake = function () {
    newSetup = new Setup();
  }

  var Setup = function () {

    this.crossFader = document.querySelector('.crossfader');

    this.sourceGain = [];
    this.volumeSlider = [];
    this.allVolumeSliders = [];
    this.filterSlider = [2];

    this.volumeSlider[0] = document.querySelector('.volume-slider-one');
    this.allVolumeSliders.push(this.volumeSlider[0]);

    this.assignVolumeSlider(this.volumeSlider[0]);

    this.setupAudioNodes();
    this.instantiatePlayer('one');

    for (var i = 0; i < effectButton.length; i++) {
      effectButton[i].addEventListener('click', this.hideOrShow.bind(this), true);
    }
  }

  Setup.prototype.assignVolumeSlider = function (volSlider) {

    volSlider.addEventListener('input', this.adjustVolume.bind(this), true);

  }

  Setup.prototype.adjustVolume = function (which) {
    var target = which.target || which.srcElement;
    if (target.classList.contains('volume-slider-one')) {
      this.sourceGain[0].gain.value = target.value;
    }
    else if (target.classList.contains('volume-slider-two')) {
      this.sourceGain[1].gain.value = target.value;
    }
  }

  // Setup.prototype.setupAudioNodes = function () {

  //   var self = this;

  //   // Fix up prefixing
  //   window.AudioContext = window.AudioContext || window.webkitAudioContext;
  //   context = new AudioContext();
  //   this.feedbackGain = context.createGain ? context.createGain() : context.createmasterGain();
  //   fetchGain = context.createGain ? context.createGain() : context.createmasterGain();
  //   this.delay = context.createDelay ? context.createDelay() : context.createDelayNode();
  //   this.compressor = context.createDynamicsCompressor();
  //   this.analyser = context.createAnalyser();
  //   this.filter = context.createBiquadFilter();
  //   this.masterGain = context.createGain();
  //   this.preGain = context.createGain();
  //   this.sourceGain[0] = context.createGain();
  //   this.sourceGain[1] = context.createGain();
  //   convolver = context.createConvolver();
  //   dry = context.createGain();
  //   wet = context.createGain();

  //   this.routeAudioNodes();
  // }

  // Setup.prototype.routeAudioNodes = function () {

  //   for (var i = 0; i < source.length; i++) {
  //     source[i] = context.createBufferSource();
  //     source[i].connect(this.sourceGain[i]);
  //     this.sourceGain[i].connect(convolver);
  //     this.sourceGain[i].connect(dry);
  //   }

  //   convolver.connect(wet);

  //   dry.connect(this.preGain);
  //   wet.connect(this.preGain);

  //   dry.gain.value = 1.0;
  //   wet.gain.value = 0.0;

  //   this.preGain.connect(this.delay);
  //   this.delay.connect(this.feedbackGain);
  //   this.feedbackGain.connect(this.delay);

  //   fetchGain.connect(this.masterGain);

  //   this.delay.connect(this.compressor);
  //   this.filter.connect(this.compressor);

  //   this.compressor.connect(this.masterGain);
  //   this.masterGain.connect(this.analyser);
  //   this.analyser.connect(context.destination);

  //   for (var i = 0; i < this.sourceGain.length; i++) { this.sourceGain[i].gain.value = 6; }

  //   this.feedbackGain.gain.value = 0;
  //   this.masterGain.gain.value = 1;
  //   this.filter.type = filterType[browser];
  //   this.filter.frequency.value = 4000;

  // }



  var current, panel = document.querySelector('.panel');

  Setup.prototype.getDataValue = function (sliderVal, magnitude, suffix) {
    return parseFloat(Math.round(sliderVal * magnitude) / magnitude).toFixed(1) + " " + suffix;
  }

  Setup.prototype.updateValues = function (feed) {

    var self = this,
      value = feed.target.value;

    this.drawSineWave(value);

  }

  // var isTremoloOn = false, ms = 0, round = 14, step = 0, period = 0;

  Setup.prototype.toggleTremolo = function () {
    if (isTremoloOn) {
      isTremoloOn = false;
      document.getElementById('tremolo-toggle').innerHTML = 'off';
    } else {
      isTremoloOn = true;
      document.getElementById('tremolo-toggle').innerHTML = 'on';
    }
  }

  function millis() {
    var d = new Date();
    return d.getTime();
  }

  // Setup.prototype.frameLooper = function () {

  //   var fbc_array, bar_x, bar_width, bar_height, graphFill = '#ececec';

  //   var canvasWidth = document.getElementById('analyser').width;
  //   var canvasHeight = document.getElementById('analyser').height;
  //   this.analyser.fftSize = 64;

  //   var bufferLength = this.analyser.frequencyBinCount,
  //     dataArray = new Uint8Array(bufferLength);

  //   this.analyser.minDecibels = -90;
  //   this.analyser.maxDecibels = -10;
  //   this.analyser.smoothingTimeConstant = 0.90;

  //   window.requestAnimationFrame(this.frameLooper.bind(this));

  //   this.analyser.getByteFrequencyData(dataArray);

  //   this.ctx.fillStyle = 'hsla(0, 0%, 100%, .10)';
  //   this.ctx.fillStyle = graphFill;
  //   this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //   var barWidth = (canvasWidth / bufferLength);
  //   var barHeight;
  //   var x = 0;

  //   for (var i = 0; i < bufferLength; i++) { // used to be bufferLength
  //     barHeight = dataArray[i];

  //     this.ctx.fillStyle = '#000'; // 'rgb(' + (barHeight+100) + ',50,50)'
  //     this.ctx.fillRect(x, canvasHeight - barHeight / 2, barWidth, barHeight / 2);

  //     x += barWidth + 2;
  //   }
  // }

  function changeGraphics() {
    if (graphFill == '#FFF')
      graphFill = 'hsla(0, 0%, 100%, .10)';
    else
      graphFill = '#FFF';
  }

  // function convertRange(value, r1, r2) {
  //   return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
  // }

  Setup.prototype.drawSineWave = function (val) {

    var self = this;

    var canvasWidth = document.getElementById('wavetable').width;
    var canvasHeight = document.getElementById('wavetable').height;

    // this.w_ctx.fillStyle = '#E1E1E1';
    this.w_ctx.fillStyle = '#214549';
    this.w_ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    var remappedAmplitude = convertRange(val, [1, 20], [1, 20]);

    function fun1(x) { return Math.sin(remappedAmplitude * x); }
    function fun2(x) { return Math.cos(3 * x); }

    var axes = {};
    axes.x0 = .5 + .5 * self.w_canvas.width;  // x0 pixels from left to x=0
    axes.y0 = .5 + .5 * self.w_canvas.height; // y0 pixels from top to y=0
    axes.scale = 40;                 // 40 pixels from x=0 to x=1
    axes.doNegativeX = true;

    // funGraph(this.w_ctx, axes, fun1, "#214549", 3);
    funGraph(this.w_ctx, axes, fun1, "#ececec", 3);

    function funGraph(waveTable, axes, func, color, thick) {
      var xx, yy, dx = 4, x0 = axes.x0, y0 = axes.y0, scale = axes.scale;
      var iMax = Math.round((self.w_canvas.width - x0) / dx);
      var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
      waveTable.beginPath();
      waveTable.lineWidth = thick;
      waveTable.strokeStyle = color;

      for (var i = iMin; i <= iMax; i++) {
        xx = dx * i; yy = scale * func(xx / scale);
        if (i == iMin) waveTable.moveTo(x0 + xx, y0 - yy);
        else waveTable.lineTo(x0 + xx, y0 - yy);
      }
      waveTable.stroke();
    }
  }

  /* ///////////////////////////////////////////////////////////////// */





  var Values = function () { };

  Values.prototype.changeValues = function () {

    switch (this.className) {
      case 'graph':
        console.log("reverb");
        break;
      case 'speed':
        d.getElementById('speed-output').innerHTML = "x " + parseFloat(Math.round(this.value * 10) / 10).toFixed(1);
        source[0].playbackRate.value = this.value;
        source[1].playbackRate.value = this.value;
        break;
      case 'reverb':
        changeValue(this.value, 'mix');
        console.log("reverb");
        break;
      case 'delayslide':
        newSetup.delay.delayTime.value = this.value;
        d.querySelector('.delay-output').innerHTML = newSetup.getDataValue(this.value, 10, "ms");
        break;
      case 'feedback':
        newSetup.feedbackGain.gain.value = this.value;
        d.querySelector('.feedback-output').innerHTML = newSetup.getDataValue(this.value, 100, "%");
        break;
      default:
        console.log("Nothing happens");
    }

  }

  var valueTweak = new Values();

  /* ///////////////////////////////////////////////////////////////// */

  /* ///////////// */
  /* Instantiation */

  Setup.prototype.hideOrShow = function (effect) {

    var self = this,
      effectName = effect.target.childNodes[0].innerHTML;

    effect.target.style.opacity = '1';

    if (effectName == 'graph' && !effect_is_on[0]) {
      panel.insertAdjacentHTML('beforeend',
        '<div class="node" id="graph">' +
        '<h2>Graph</h2>' +
        // '<div class="toggle-effect slur one" id="onoroffslur"></div>' +
        // '<div class="toggle-effect slur two" id="onoroffslur"></div>' +
        // '<div class="toggle-effect slur three" id="onoroffslur"></div>' +
        '<canvas id="analyser"></canvas>' +
        '</div>');
      this.canvas = document.getElementById('analyser');
      this.ctx = this.canvas.getContext('2d');
      this.frameLooper();
      // graphicButton = document.querySelectorAll('.toggle-effect');
      // for (var i = 0; i < effectButton.length; i++) {
      //     graphicButton[i].addEventListener('click', changeGraphics, false);
      // }
    }
    else if (effectName == 'speed' && !effect_is_on[1]) {
      panel.insertAdjacentHTML('beforeend',
        '<div class="node">' +
        '<h2>Speed</h2>' +
        '<input class="speed" type="range" min="0.1" max="1.9" step="0.01" value="x 1.00" />' +
        '<output id="speed-output" for="filter">x 1.0</output>' +
        '</div>');
      document.querySelector('.speed').addEventListener('input', valueTweak.changeValues, true);
    }
    else if (effectName == 'reverb' && !effect_is_on[2]) {
      panel.insertAdjacentHTML('beforeend',
        '<div class="node">' +
        '<h2>Reverb</h2>' +
        '<input class="reverb" type="range" value="0" step="1" min="0" max="200"/>' +
        '<select id="impulse" size="1" onchange="loadImpulse(this.value);">' +
        '<option value="GraffitiHallway.wav">Factory Hall</option>' +
        '</select>' +
        '</div>');
      effect_is_on[2] = true;
      document.querySelector('.reverb').addEventListener('input', valueTweak.changeValues, true);
    }
    else if (effectName == 'filter' && !effect_is_on[3]) {
      panel.insertAdjacentHTML('beforeend',
        '<div class="node">' +
        '<h2 id="filter-title">Filter</h2>' +
        '<div class="alter-filter toggle-effect" id="onoroff"></div>' +
        '<div class="alter-filter info filter-choice">low pass</div>' +
        '<input id="filter-range" type="range" name="color" min="1" value="2000" max="4000" />' +
        '<output id="filter-output" for="filter"></output>' +
        '<div class="gui-group">' +
        '<h3>Tremolo</h3>' +
        '<input id="tremolo-amount" type="range" name="color" min="1" max="20" />' +
        '<div class="alter-filter button-reg tremolo" id="tremolo-toggle">O</div>' +
        '<canvas id="wavetable"></canvas>' +
        '</div>' +
        '</div>');
      current = 'filter';
      effect_is_on[3] = true;
      this.w_canvas = document.getElementById('wavetable');
      this.w_ctx = this.w_canvas.getContext('2d');
      this.filterSlider[0] = document.querySelector('#filter-range');
      this.filterSlider[1] = document.querySelector('#tremolo-amount');
      this.filterSlider.forEach(function (slider) {
        slider.addEventListener('input', function () {
          self.changeFilterValues();
        }.bind(self));
      });
      filterOn = true;

      this.alterFilterButtons = document.querySelectorAll('.alter-filter');
      // console.log(this.alterFilterButtons);

      this.alterFilterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          self.alterFilter(button);
        }.bind(self));
      });
      // document.getElementById('filter-output').innerHTML = ;
    }
    else if (effectName == 'delay' && !effect_is_on[4]) {
      panel.insertAdjacentHTML('beforeend',
        '<div class="node" id="delaysliders">' +
        '<h2>Delay</h2>' +
        '<div class="info">delay time</div>' +
        '<input class="delayslide" type="range" min="0" max="4.9" step="0.001" value="0" />' +
        '<output class="delay-output"></output>' +
        '<div class="info">feedback gain</div>' +
        '<input class="feedback" type="range" min="0" max="0.9" step="0.01" value="0" />' +
        '<output class="feedback-output"></output>' +
        '</div>');
      effect_is_on[4] = true;
      document.querySelector('.delayslide').addEventListener('input', valueTweak.changeValues, true);
      document.querySelector('.feedback').addEventListener('input', valueTweak.changeValues, true);
    }
    else if (effectName == 'player' && !effect_is_on[5]) {
      panel.insertAdjacentHTML('beforeend',
        '<div class="node player">' +
        '<div class="button-reg-two invisible drop" id="start-two" for="file-upload-two">' +
        '<label for="file-upload-two" id="upload-button-two"></label>' +
        '<div class="buttonicon" id="buttonicon"></div>' +
        '</div>' +
        '<output class="artistinfo two"></output>' +
        '<input class="volume-slider-two" type="range" name="color" min="0" max="5" step="0.1" />' +
        '</div>');
      effect_is_on[5] = true;
      this.instantiatePlayer('two');
      this.crossFader.addEventListener('input', function () {
        self.crossFade();
      }.bind(self));
      this.volumeSlider[1] = document.querySelector('.volume-slider-two');
      this.allVolumeSliders.push(this.volumeSlider[1]);
      this.assignVolumeSlider(this.volumeSlider[1]);
    }
  }

  Setup.prototype.alterFilter = function (button) {

    if (button.classList.contains('toggle-effect')) {
      if (this.alterFilterButtons[0].classList.contains('active')) {
        this.alterFilterButtons[0].classList.remove('active');
        this.delay.disconnect(this.filter);
        this.delay.connect(this.compressor);
      } else {
        this.alterFilterButtons[0].classList.add('active');
        this.delay.disconnect(this.compressor);
        this.delay.connect(this.filter);
      }
    }
    else if (button.classList.contains('filter-choice')) {
      if (browser > 6) {
        browser = 0;
      } else {
        browser++;
      }
      this.filter.type = filterType[browser];
      this.alterFilterButtons[1].innerHTML = filterType[browser];
    }
    else if (button.classList.contains('tremolo')) {
      if (this.alterFilterButtons[2].classList.contains('active')) {
        this.alterFilterButtons[2].classList.remove('active');
        tremoloIsAllowed = false;
        this.alterFilterButtons[2].innerHTML = "O";
      } else {
        this.alterFilterButtons[2].classList.add('active');
        tremoloIsAllowed = true;
        this.alterFilterButtons[2].innerHTML = "I";
        if (tremoloIsAllowed)
          this.updateTremolo();
      }
    }

    // document.querySelector('#filter-output').innerHTML = filterValue + " Hz";
    // document.querySelector('.alter-filter').innerHTML = filterType[browser];

  }



  /* ///////////////////////////////////////////////////////////////// */

  Setup.prototype.crossFade = function () {
    var gainOne = 1.8 - this.crossFader.value;
    var gainTwo = this.crossFader.value;
    this.sourceGain[0].gain.value = (gainOne > 0.2) ? gainOne : 0;
    this.sourceGain[1].gain.value = (gainTwo > 0.2) ? gainTwo : 0;
  }

  Setup.prototype.changeFilterValues = function () {

    // console.log(this.filterSlider[0].value);

    filterValue = this.filterSlider[0].value;
    d.getElementById('filter-output').innerHTML = filterValue + " Hz";

    if (filterOn) {
      this.filter.frequency.value = filterValue;
    }

  }

  Setup.prototype.updateTremolo = function () {

    var now = millis(),
      dT = now - ms;

    step++;
    if (step > round) { step = 0; }
    var r = (step / round) * 2.0 * Math.PI;
    ms = now;
    period = 300 - 150 * Math.sin(r);
    var remappedPeriod = convertRange(period, [150, 450], [0, filterValue]);

    this.filter.frequency.value = filterValue + remappedPeriod;

    if (tremoloIsAllowed)
      window.requestAnimationFrame(this.updateTremolo.bind(this));

  }




  /* ///////////////////////////////////////////////////////////////// */

  /* ///////////// */
  /* handleTracks */

  var dropArea = [], playBox = [], loadBox = [],
    isSoundPlaying = [false, false];

  var startOffset = [0, 0], startTime = [0, 0];

  var songData = [];

  Setup.prototype.instantiatePlayer = function (current) {

    console.log(current);

    var cur = current == 'one' ? 0 : 1;

    loadBox[cur] = document.getElementById('upload-button-' + current);
    dropArea[cur] = document.getElementById('start-' + current);
    playBox[cur] = document.getElementById('start-' + current);

    loadBox[cur].addEventListener('change', this.dropEvent, true);
    dropArea[cur].addEventListener('drop', this.dropEvent, true);
    dropArea[cur].addEventListener('dragover', this.dragOver, true);
    playBox[cur].addEventListener('click', this.playSong.bind(this), false);

  }

  // Setup.prototype.dragOver = function (evt) {
  //   evt.stopPropagation();
  //   evt.preventDefault();
  //   return false;
  // }

  // Setup.prototype.playSong = function (click) {

  //   var self = this,
  //     d = document,
  //     playToggle = click.target.id,
  //     theSpecElem = d.getElementsByClassName('buttonicon');

  //   // Get drop event target number
  //   var num = playToggle.substring(6, 9);
  //   var cur = num == 'one' ? 0 : 1;

  //   console.log(num);

  //   if (isSoundPlaying[cur]) {
  //     isSoundPlaying[cur] = false;
  //     self.pauseTrack(cur);
  //     d.getElementById('start-' + num).classList.remove('on');
  //     theSpecElem[cur].classList.remove('pause');
  //   } else {
  //     isSoundPlaying[cur] = true;
  //     self.initAudio(songData[cur], cur);
  //     d.getElementById('start-' + num).classList.add('on');
  //     theSpecElem[cur].classList.add('pause');
  //   }

  // }

  // Setup.prototype.initAudio = function (data, num) {

  //   var self = this;

  //   console.log(this);

  //   if (context.decodeAudioData) {
  //     context.decodeAudioData(data, function (buffer) {
  //       source[num] = context.createBufferSource();
  //       source[num].connect(self.sourceGain[num]);
  //       source[num].buffer = buffer;
  //       self.startAudio(buffer, num);
  //     }, function (e) {
  //       // console.log(e);
  //     });
  //   } else {
  //     source[num].buffer = context.createBuffer(data, false /* mixToMono */);
  //     self.startAudio();
  //   }

  // }

  // Setup.prototype.startAudio = function (buffer, num) {
  //   startTime[num] = context.currentTime;
  //   source[num].loop = true;
  //   // Start playback, but make sure we stay in bound of the buffer.
  //   source[num].start(0, startOffset[num] % buffer.duration);
  // }

  Setup.prototype.pauseTrack = function (song) {
    // Measure how much time passed since the last pause.
    startOffset[song] += context.currentTime - startTime[song];
    source[song].stop(0);
  }

  // Setup.prototype.dropEvent = function (evt) {

  //   // Get drop event target number
  //   var num = this.className.substring(11, 14);
  //   var cur = num == 'one' ? 0 : 1;

  //   var droppedFiles = evt.dataTransfer.files;

  //   console.log(evt.dataTransfer.files);

  //   var reader = new FileReader();

  //   evt.stopPropagation();
  //   evt.preventDefault();

  //   reader.onload = function (fileEvent) {
  //     songData[cur] = fileEvent.target.result;
  //     var str = droppedFiles[0].name;
  //     document.querySelector('.artistinfo.' + num).innerHTML = "Song:<br />" + str;
  //     // document.querySelector('.button-reg.invisible.drop').style.border = 'none';
  //   }

  //   reader.readAsArrayBuffer(droppedFiles[0]);

  //   playBox[cur].classList.remove('invisible');
  //   playBox[cur].classList.add('visible');

  //   var playButton = 'start-' + num;

  //   // document.getElementById(playButton).removeChild(document.getElementById('drag-instr'));
  //   document.getElementById('upload-button-' + num).style.zIndex = -10;

  // }

  setTimeout(function () {

    var loadImpulse = function (fileName) {
      var url = "snd/GraffitiHallway.wav";
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";
      request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
          convolver.buffer = buffer;
        }, function (e) { console.log(e); });
      };
      request.onerror = function (e) {
        console.log(e);
      };
      request.send();
    };

    loadImpulse(0);
    mix(0);

  }, 100);

  function changeValue(string, type) {
    var value = parseFloat(string);

    switch (type) {
      case 'mix':
        mix(value);
        break;
    }
  }

  // REVERB 
  var mix = function (value) {
    var reverb = value / 80.0;
    dry.gain.value = (1.0 - reverb);
    wet.gain.value = reverb;
  }

  /* ///////////////////////////////////////////////////////////////// */




  window.addEventListener("DOMContentLoaded", awake, true);


}