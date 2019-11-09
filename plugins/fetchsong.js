/* eslint-disable */

export default ({ app }) => {
  /*
  The code for finding out the BPM / tempo is taken from this post:
  http://tech.beatport.com/2014/web-audio/beat-detection-using-web-audio/
 */

  // from spotify-web-api.js
  var SpotifyWebApi = (function () {

    'use strict';
    var _baseUri = 'https://api.spotify.com/v1';

    var _promiseProvider = function (promiseFunction) {
      return new window.Promise(promiseFunction);
    };

    var _checkParamsAndPerformRequest = function (requestData, options, callback) {
      var opt = {};
      var cb = null;

      if (typeof options === 'object') {
        opt = options;
        cb = callback;
      } else if (typeof options === 'function') {
        cb = options;
      }
      _extend(requestData.params, opt);
      return _performRequest(requestData, cb);
    };

    var _performRequest = function (requestData, callback) {
      var promiseFunction = function (resolve, reject) {
        var req = new XMLHttpRequest();
        var type = requestData.type || 'GET';
        if (type === 'GET') {
          req.open(type,
            _buildUrl(requestData.url, requestData.params),
            true);
        } else {
          req.open(type, _buildUrl(requestData.url));
        }

        req.onreadystatechange = function () {
          if (req.readyState === 4) {
            var data = null;
            try {
              data = req.responseText ? JSON.parse(req.responseText) : '';
            } catch (e) { }

            if (req.status === 200 || req.status === 201) {
              if (resolve) {
                resolve(data);
              }
              if (callback) {
                callback(null, data);
              }
            } else {
              if (reject) {
                reject(req);
              }
              if (callback) {
                callback(req, null);
              }
            }
          }
        };

        if (type === 'GET') {
          req.send(null);
        } else {
          req.send(JSON.stringify(requestData.postData));
        }
      };

      if (callback) {
        promiseFunction();
        return null;
      } else {
        return _promiseProvider(promiseFunction);
      }
    };

    var _extend = function () {
      var args = Array.prototype.slice.call(arguments);
      var target = args[0];
      var objects = args.slice(1);
      target = target || {};
      for (var i = 0; i < objects.length; i++) {
        for (var j in objects[i]) {
          target[j] = objects[i][j];
        }
      }
      return target;
    };

    var _buildUrl = function (url, parameters) {
      var qs = '';
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          var value = parameters[key];
          qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
      }
      if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last '&'
        url = url + '?' + qs;
      }
      return url;
    };

    var Constr = function () { };

    Constr.prototype = {
      constructor: SpotifyWebApi
    };

    /**
     * Fetches tracks from the Spotify catalog according to a query.
     * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
     * the Spotify Developer site for more information about the endpoint.
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.searchTracks = function (query, options, callback) {
      var requestData = {
        url: _baseUri + '/search/',
        params: {
          q: query,
          type: 'track'
        }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };

    return Constr;
  })();


  // from echonest-api.js
  var EchonestApi = (function () {

    'use strict';
    var _baseUri = 'http://developer.echonest.com/api/v4';

    var _apiKey = 'NZCLQY5QPNROJCWNT';

    var _promiseProvider = function (promiseFunction) {
      return new window.Promise(promiseFunction);
    };

    var _checkParamsAndPerformRequest = function (requestData, options, callback) {
      var opt = {};
      var cb = null;

      if (typeof options === 'object') {
        opt = options;
        cb = callback;
      } else if (typeof options === 'function') {
        cb = options;
      }
      _extend(requestData.params, opt);
      return _performRequest(requestData, cb);
    };

    var _performRequest = function (requestData, callback) {
      var promiseFunction = function (resolve, reject) {
        var req = new XMLHttpRequest();
        var type = requestData.type || 'GET';
        if (type === 'GET') {
          req.open(type,
            _buildUrl(requestData.url, requestData.params),
            true);
        } else {
          req.open(type, _buildUrl(requestData.url));
        }

        req.onreadystatechange = function () {
          if (req.readyState === 4) {
            var data = null;
            try {
              data = req.responseText ? JSON.parse(req.responseText) : '';
            } catch (e) { }

            if (req.status === 200 || req.status === 201) {
              if (resolve) {
                resolve(data);
              }
              if (callback) {
                callback(null, data);
              }
            } else {
              if (reject) {
                reject(req);
              }
              if (callback) {
                callback(req, null);
              }
            }
          }
        };

        if (type === 'GET') {
          req.send(null);
        } else {
          req.send(JSON.stringify(requestData.postData));
        }
      };

      if (callback) {
        promiseFunction();
        return null;
      } else {
        return _promiseProvider(promiseFunction);
      }
    };

    var _extend = function () {
      var args = Array.prototype.slice.call(arguments);
      var target = args[0];
      var objects = args.slice(1);
      target = target || {};
      for (var i = 0; i < objects.length; i++) {
        for (var j in objects[i]) {
          target[j] = objects[i][j];
        }
      }
      return target;
    };

    var _buildUrl = function (url, parameters) {
      var qs = '';
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          var value = parameters[key];
          qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
      }
      if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last '&'
        url = url + '?' + qs;
      }
      return url;
    };

    var Constr = function () { };

    Constr.prototype = {
      constructor: EchonestApi
    };

    Constr.prototype.searchSongs = function (artist, title, callback) {
      var requestData = {
        url: _baseUri + '/song/search',
        params: {
          artist: artist,
          title: title,
          api_key: _apiKey,
          results: 1
        }
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };

    Constr.prototype.getSongAudioSummaryById = function (songId, callback) {
      var requestData = {
        url: _baseUri + '/song/profile',
        params: {
          id: songId,
          bucket: 'audio_summary',
          api_key: _apiKey
        }
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };

    Constr.prototype.getSongAudioSummaryBySpotifyUri = function (spotifyUri, callback) {
      var requestData = {
        url: _baseUri + '/song/profile',
        params: {
          track_id: spotifyUri,
          bucket: 'audio_summary',
          api_key: _apiKey
        }
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };

    return Constr;
  })();




  // from script.js
  var spotifyApi = new SpotifyWebApi();
  var echonestApi = new EchonestApi();

  var queryInput = document.querySelector('#query'),
    result = document.querySelector('#result'),
    text = document.querySelector('#text'),
    audioTag = document.querySelector('#audio'),
    playButton = document.querySelector('#play');


  audioTag.addEventListener('timeupdate', function () {
    var progressIndicator = document.querySelector('#progress');
    if (progressIndicator && audioTag.duration) {
      progressIndicator.setAttribute('x', (audioTag.currentTime * 100 / audioTag.duration) + '%');
    }
  });

  playButton.addEventListener('click', function () {
    audioTag.play();
  });

  result.style.display = 'none';

  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    result.style.display = 'none';
    spotifyApi.searchTracks(
      queryInput.value.trim(), { limit: 1 })
      .then(function (results) {
        var track = results.tracks.items[0];
        var previewUrl = track.preview_url;
        audioTag.src = track.preview_url;

        var request = new XMLHttpRequest();
        request.open('GET', previewUrl, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
          context.decodeAudioData(request.response, function (buffer) {

            console.log(previewUrl);

            // Create offline context
            // var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);

            // Create buffer source
            // var analysedSource = offlineContext.createBufferSource();
            // analysedSource.buffer = buffer;

            source[0] = context.createBufferSource();
            source[0].buffer = buffer;
            source[0].connect(fetchGain);

            // Schedule the song to start playing at time:0
            // analysedSource.start(0);
            source[0].start(0);

            // Render the song
            // offlineContext.startRendering();

            // // Act on the result
            // offlineContext.oncomplete = function(e) {
            //   // Filtered buffer!
            //   var filteredBuffer = e.renderedBuffer;

            //   var peaks,
            //       initialThresold = 0.9,
            //       thresold = initialThresold,
            //       minThresold = 0.3,
            //       minPeaks = 30;

            //   do {
            //     peaks = getPeaksAtThreshold(e.renderedBuffer.getChannelData(0), thresold);
            //     thresold -= 0.05;
            //   } while (peaks.length < minPeaks && thresold >= minThresold);

            //   var svg = document.querySelector('#svg');
            //   svg.innerHTML = '';
            //   peaks.forEach(function(peak) {
            //     svg.innerHTML += '<rect x="' + (100 * peak / e.renderedBuffer.length) + '%" y="0" width="1" height="100%"></rect>';
            //   });
            //   svg.innerHTML +='<rect id="progress" y="0" width="1" height="100%"></rect>';

            //   var intervals = countIntervalsBetweenNearbyPeaks(peaks);

            //   var groups = groupNeighborsByTempo(intervals, filteredBuffer.sampleRate);

            //   var top = groups.sort(function(intA, intB) {
            //     return intB.count - intA.count;
            //   }).splice(0,5);

            //   var printENBPM = function(tempo) {
            //     text.innerHTML += '<div class="small">Other sources: The tempo according to The Echo Nest API is ' +
            //           tempo + ' BPM</div>';
            //   };
            //   echonestApi.getSongAudioSummaryBySpotifyUri(track.uri)
            //     .then(function(result) {
            //       if (result.response.status.code === 0 && result.response.songs.length > 0) {
            //         var tempo = result.response.songs[0].audio_summary.tempo;
            //         printENBPM(tempo);
            //       } else {
            //         if (result.response.status.code === 5) {
            //           // The track couldn't be found. Fallback to search in EN
            //           echonestApi.searchSongs(track.artists[0].name, track.name)
            //             .then(function(result) {
            //               if (result.response.status.code === 0 && result.response.songs.length > 0) {
            //                 echonestApi.getSongAudioSummaryById(result.response.songs[0].id)
            //                   .then(function(result) {
            //                     if (result.response.status.code === 0 && result.response.songs.length > 0) {
            //                       var tempo = result.response.songs[0].audio_summary.tempo;
            //                       printENBPM(tempo);
            //                     }
            //                   });
            //               }
            //             });
            //         }
            //       }
            //     });

            //   result.style.display = 'block';
            // };
          }, function () { });
        };
        request.send();
      });
  });

  // Function to identify peaks
  function getPeaksAtThreshold(data, threshold) {
    var peaksArray = [];
    var length = data.length;
    for (var i = 0; i < length;) {
      if (data[i] > threshold) {
        peaksArray.push(i);
        // Skip forward ~ 1/4s to get past this peak.
        i += 10000;
      }
      i++;
    }
    return peaksArray;
  }

  // Function used to return a histogram of peak intervals
  function countIntervalsBetweenNearbyPeaks(peaks) {
    var intervalCounts = [];
    peaks.forEach(function (peak, index) {
      for (var i = 0; i < 10; i++) {
        var interval = peaks[index + i] - peak;
        var foundInterval = intervalCounts.some(function (intervalCount) {
          if (intervalCount.interval === interval)
            return intervalCount.count++;
        });
        if (!foundInterval) {
          intervalCounts.push({
            interval: interval,
            count: 1
          });
        }
      }
    });
    return intervalCounts;
  }

  // Function used to return a histogram of tempo candidates.
  function groupNeighborsByTempo(intervalCounts, sampleRate) {
    var tempoCounts = [];
    intervalCounts.forEach(function (intervalCount, i) {
      if (intervalCount.interval !== 0) {
        // Convert an interval to tempo
        var theoreticalTempo = 60 / (intervalCount.interval / sampleRate);

        // Adjust the tempo to fit within the 90-180 BPM range
        while (theoreticalTempo < 90) theoreticalTempo *= 2;
        while (theoreticalTempo > 180) theoreticalTempo /= 2;

        theoreticalTempo = Math.round(theoreticalTempo);
        var foundTempo = tempoCounts.some(function (tempoCount) {
          if (tempoCount.tempo === theoreticalTempo)
            return tempoCount.count += intervalCount.count;
        });
        if (!foundTempo) {
          tempoCounts.push({
            tempo: theoreticalTempo,
            count: intervalCount.count
          });
        }
      }
    });
    return tempoCounts;
  }
  
}