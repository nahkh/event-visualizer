'use strict';

var es = new EventSource('/stream');
 
es.onmessage = function (event) {
  let coordinates = JSON.parse(event.data);
  // Only process events that are not stale. SSE (at least on Chrome) queues up events when the tab is not active.
  if (moment(event.timestamp).add(30, 'seconds').isAfter(moment())) {
	renderer.addEvent(parseFloat(coordinates.latitude), parseFloat(coordinates.longitude));
  }
};
