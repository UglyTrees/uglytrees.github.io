/*
	
	MIT License

	Copyright (c) 2019 UglyTrees

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/


function initRecorder() {



	ANIMTATION_TIME_RECORDER = 1000;
	FADE_TIME_RECORDER = 1000;
	RECORDING = false;
	recorder = null;

}




function record(svgID = "tree"){


	


	RECORDING = true;

	$("#treeDIV").hide(0);
	CURRENT_ANIMATION_TIME = ANIMTATION_TIME_RECORDER;
	CURRENT_FADE_TIME = FADE_TIME_RECORDER;

	// The svg
	var svg = document.getElementById(svgID);
	var svg_jq = $("#" + svgID);
	var svg_width = parseFloat(svg_jq.width());
	var svg_height = parseFloat(svg_jq.height());
	var canvasSizeMultiplier = 1.5;

	// Ensure that height and width are inline and not css
	svg_jq.attr("height", svg_height);
	svg_jq.attr("width", svg_width);


	// The canvas
	var canvas = document.createElement("canvas");
	canvas.width = svg_width * canvasSizeMultiplier; 
	canvas.height = svg_height * canvasSizeMultiplier; 
	var context = canvas.getContext("2d");
	context.fillStyle = "white";

	// The recorder
	var data = [];

	
    	var stream = canvas.captureStream(0);
    	recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
	recorder.ondataavailable = function(event) {
		//console.log("data?", event);
		if (event.data && event.data.size) {
			data.push(event.data);
		}
	};



	

  	recorder.onstop = () => {

		//return;
		var blob = new Blob(data, { type: "video/webm" })
	   	var url = URL.createObjectURL(blob);
		console.log("STOP", blob);


		var downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = "UglyTrees.webm";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);

		CURRENT_ANIMATION_TIME = ANIMATION_TIME;
		CURRENT_FADE_TIME = FADE_TIME;
		$("#treeDIV").show(0);
		RECORDING = false;

		console.log("ndraws", ndraws);


  	};
	

	var ndraws = 0;

	var drawFrame = function(cb = function(a, b) { }) {
		var img = new Image();
		var serialized = new XMLSerializer().serializeToString(svg); 
		var blob = URL.createObjectURL(new Blob([serialized], {type: "image/svg+xml"}));
		img.src = blob;
		img.onload = function() {
			context.fillRect(0, 0, svg_width * canvasSizeMultiplier, svg_height * canvasSizeMultiplier); 
			context.drawImage(img, 0, 0, svg_width * canvasSizeMultiplier, svg_height * canvasSizeMultiplier);
			ndraws++;
			stream.requestFrame();
			recorder.requestData();
			cb(null, img);
			
		}
	    	
	  }





	recorder.start();
	recordRecurse(5, recorder, data, drawFrame);

	return; 
	

}


function recordRecurse(n, recorder, data, drawFrame = function(cb) { }){


	if (n == 0) {
		recorder.stop();
		return;

	}

	recorder.pause();
	drawFrame(function(a, b) {

		
		nextTree(false, function() { }, function(elements, complete, remaining, start, tweenValue) {
			recorder.resume();
			console.log((complete * 100) + "%");
        		//console.log(remaining + "ms remaining!");
        		//console.log("The current tween value is " + tweenValue)

			$(`[animatable="true"]`).velocity("pause");
			
			
			drawFrame(function(a, b) { 
				console.log("drawn");
				recorder.pause();
				setTimeout(function() { 
					
					$(`[animatable="true"]`).velocity("resume") 
				}, 10); 
			});

			if (complete == 1) {
				setTimeout(function() {
					
					recordRecurse(n-1, recorder, data, drawFrame);					
				}, 100);
			}
		});

	});


}








// Begin recording the svg 
// https://gist.github.com/veltman/ff864215009174bc5d164ec3533125c2
function recoadadrd(svgSelector = "#svgtest"){

		var svg = d3.select(svgSelector),
	    canvas = document.createElement("canvas"),
	    width = canvas.width = +svg.attr("width"),
	    height = canvas.height = +svg.attr("height"),
	    context = canvas.getContext("2d");
	var projection = d3.geoOrthographic()
	  .scale(195)
	  .translate([width / 2, height / 2])
	  .precision(0.1);
	var path = d3.geoPath().projection(projection);
	  var data = [],
	    stream = canvas.captureStream(),
	    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
	  recorder.ondataavailable = function(event) {	
		console.log("RECORD", event);
	    if (event.data && event.data.size) {
	      data.push(event.data);
	    }
	  };
	  recorder.onstop = () => {
		console.log("STOP", data);
	    var url = URL.createObjectURL(new Blob(data, { type: "video/webm" }));
	    d3.selectAll("canvas, svg").remove();
	    d3.select("body")
	      .append("video")
	      .attr("src", url)
	      .attr("controls", true)
	      .attr("autoplay", true);
	  };
	  var background = svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("fill", "#fff");
	  svg.append("path")
	    .datum({ type: "Sphere" })
	    .attr("stroke", "#222")
	    .attr("fill", "none");
	 
	  var queue = d3.queue(1);
	  d3.range(120).forEach(function(frame){
	    queue.defer(drawFrame, frame / 120);
	  });
	  queue.awaitAll(function(err, frames){
	    recorder.start();
	    drawFrame();
	    function drawFrame() {
	      if (frames.length) {
		context.drawImage(frames.shift(), 0, 0, width, height);
		requestAnimationFrame(drawFrame);
	      } else {
		recorder.stop();
	      }
	    }
	  });
	  function drawFrame(t, cb) {
	    projection.rotate([360 * t]);
	    svg.selectAll("path").attr("d", path);
	    var img = new Image(),
		serialized = new XMLSerializer().serializeToString(svg.node()),
		url = URL.createObjectURL(new Blob([serialized], {type: "image/svg+xml"}));
	    img.onload = function(){
	      cb(null, img);
	    };
	    img.src = url;
	  }


}

















