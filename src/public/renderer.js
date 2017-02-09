'use strict';

const renderer = (() => {
	
	const canvas = document.getElementById("worldMapCanvas");	
	const ctx = canvas.getContext("2d");
	const events = [];
	
	const renderEvents = () => {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		for(let i = 0; i < events.length; ++i) {
			let event = events[i];
			ctx.beginPath();
			let radius = Math.sqrt(10000 - event.z*event.z)/3;
			ctx.arc(event.x, event.y, radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = `rgba(0, 0, 0, ${event.z/100})`;
			ctx.fill();
			if(!(--event.z)) {
				events.splice(i, 1);
				--i;
			}
		}
	};
	
	const createEvent = (latitude, longitude) => {
		let width = canvas.width;
		let x = (longitude+180.0)*((width-80)/360.0)+40;
		let latRad = latitude * Math.PI / 180.0;
		let mercN = Math.log(Math.tan(Math.PI/4 + latRad/2));
		let y = (canvas.height/2)-(canvas.width*mercN/(2*Math.PI)) + 115; // magic fudge
		return {x, y, z: 100};
	}
	
	
	window.setInterval(renderEvents, 20);
	
	return {
		addEvent(latitude, longitude) {
			events.push(createEvent(latitude, longitude));
		}
	}
})();






