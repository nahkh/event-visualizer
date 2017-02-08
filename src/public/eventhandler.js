'use strict';

var es = new EventSource('/stream');
 
es.onmessage = function (event) {
  let coordinates = JSON.parse(event.data);
  renderer.addEvent(parseFloat(coordinates.latitude), parseFloat(coordinates.longitude));
};
