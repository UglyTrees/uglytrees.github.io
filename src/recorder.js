


/*
* Initialise the recorder
*/
function initRecorder(startBtnID, stopBtnID, cancelBtnID, progressID) {


	//ANIMTATION_TIME_RECORDER = 1000;
	//FADE_TIME_RECORDER = 1000;
	RECORDER_COUNTDOWN_EVERY = 750;
	RECORDER_FPS = 50;  	// Fames per second when recording 
	RECORDER_DELAY = 50;    // ms between frames when combining into gif
	RECORDING = false;
	ENCODING = false;
	RECORDER_START_BTN = startBtnID;
	RECORDER_STOP_BTN = stopBtnID;
	RECORDER_CANCEL_BTN = cancelBtnID;
	RECORDER_PROGRESS_ID = progressID;
	//recorder = null;


	$("#" + RECORDER_START_BTN).show();
	$("#" + RECORDER_STOP_BTN).hide();
	$("#" + RECORDER_CANCEL_BTN).hide();
	$("#" + RECORDER_PROGRESS_ID).hide();``

}




/*
* Initialise the recorder and record until stop is called
*/
function startRecording(svgID = "tree"){



	// Start recording the svg
	RECORDING = true;
	ENCODING = false;
	$("#" + RECORDER_START_BTN).hide();
	$("#" + RECORDER_STOP_BTN).show();
	$("#" + RECORDER_CANCEL_BTN).hide();
	$("#" + RECORDER_PROGRESS_ID).hide();




	// Create a div to store the pngs
	$("#recorderPngBox").remove();
	let pngBox = $("<div style='display:none' id='recorderPngBox'>Hello</div>");
	$("#treeDIV").prepend(pngBox);


	

	// Start the countdown
	let countdownEle = $("<div style='position:absolute; z-index:100; top:40%; left: 50%; font-size:10em; color:white'>HELLO</div>");
	countdownEle.css("textShadow", "1px -1px 5px #000000, 1px 1px 5px #000000, -1px -1px 5px #000000, -1px 1px 5px #000000");
	$("body").append(countdownEle);
	startCountdown(countdownEle, 5, function(){
		recordRecursive($("#" + svgID), pngBox);
	});
	


}


/*
* Start the timer recording countdown
*/
function startCountdown(countdownEle, timerVal = 4, resolve = function() { }){

	console.log(timerVal);

	countdownEle.html(timerVal);

	setTimeout(function() {

		

		if (timerVal <= 1){
			countdownEle.fadeOut(0, function(){
				countdownEle.remove();
			});
			resolve();
			return;
		}

		startCountdown(countdownEle, timerVal-1, resolve);

	}, RECORDER_COUNTDOWN_EVERY); 

}


/*
* Recursively record until told to stop
*/
function recordRecursive(svg, pngBox){



	// Every 1/FPS seconds, sample a png
	setTimeout(function() {


		// Finish the recording and make a gif
		if (!RECORDING) {
			makeGif(pngBox);
			return;
		}

		console.log("recording...");


		// Pause the animation
		//svg.velocity("pause");

		// Draw the png
		makePng(svg, pngBox, function(){


			// Resume the animation
			//svg.velocity("resume");
			recordRecursive(svg, pngBox);

		});




	}, 1000.0/RECORDER_FPS);

}


/*
* Stop recoding the animation
*/
function stopRecording(){

	// Stop recording the svg
	RECORDING = false;
	ENCODING = false;
	$("#" + RECORDER_START_BTN).show();
	$("#" + RECORDER_STOP_BTN).hide();
	$("#" + RECORDER_CANCEL_BTN).hide();
	$("#" + RECORDER_PROGRESS_ID).hide();
	$("#" + RECORDER_PROGRESS_ID).children("span").html("");

}



/*
* Cancel the gif encoding
*/
function stopEncoding(){

	// Stop encoding the svg
	ENCODING = false;

}



/*
* Combine a series of pngs into a gif and download it, using the jsgif library
* https://github.com/antimatter15/jsgif
*/
function makeGif(pngBox){


	$("#" + RECORDER_START_BTN).hide();
	$("#" + RECORDER_CANCEL_BTN).show();
	$("#" + RECORDER_PROGRESS_ID).show();
	ENCODING = true;



	// Provide some feedback to the user about how long it is taking
	let dialog = $("#" + RECORDER_PROGRESS_ID).children("span");
	//$("")



	// Initialise the encoder
	let encoder = new GIFEncoder();
	encoder.setRepeat(0);
  	encoder.setDelay(RECORDER_DELAY);
  	encoder.start();


  	console.log("initialised");
  	//return;


	 // Iterate through all the canvases
	 let canvases = pngBox.children("canvas");

	 encodeFrame(0, encoder, dialog, canvases, function(){

	 	// Finalise
		dialog.html( "100%");
	 	console.log("finalising");


		// Finalise animation
	    encoder.finish();
	  	//let binary_gif = encoder.stream().getData() 
	  	//let data_url = 'data:image/gif;base64,'+encode64(binary_gif);


	  	encoder.download("animation.gif");
	  	stopRecording();

	  	$(pngBox).remove();

	 });

	


}



/*
* Prepare one frame with the encoder	
*/
function encodeFrame(frameNum, encoder, dialog, canvases, resolve = function() { }){

	// Cancel
 	if (!ENCODING){
 		stopRecording();
 		return;
 	}

 	// Finalise
 	if (frameNum >= canvases.length){

 		resolve();
	  	return;

 	}


 	// Give feedback to user
 	dialog.html( Math.round(100.0 * frameNum/canvases.length) + "%");
 	let context = $(canvases[frameNum])[0].getContext('2d');


 


 	// Async recurse
 	setTimeout(function(){

		// Add frame
 		encoder.addFrame(context);
 		encodeFrame(frameNum+1, encoder, dialog, canvases, resolve);
 	}, 1);

}


/*
	Make a canvas from an svg
*/
function makePng(inputSvg, outputDiv, resolve = function() { }){
	
	
	const SCALE_BY = 1;
	inputSvg = $(inputSvg);
	

	// Clone svg
	let cloneSVG = $(inputSvg).clone();
	outputDiv.append(cloneSVG);

	// Scale width and height. Apsect ratio will be preserved by viewBox
	cloneSVG.attr("xmlns", "http://www.w3.org/2000/svg");
	const w = parseFloat(cloneSVG.css("width"))*SCALE_BY;
	const h = parseFloat(cloneSVG.css("height"))*SCALE_BY;
	cloneSVG.attr("width", w);
	cloneSVG.attr("height", h);
	//cloneSVG.width(w);
	//cloneSVG.height(h);
	cloneSVG.removeClass("width");
	cloneSVG.removeClass("height");


	
	
	if (w*h > 2e8){
		//inputSvg.parentNode.removeChild(elem);
		alert("Maximum png size exceeded!");
		return;
	}
	
	// Generate blob for png
	let svgStr = $(cloneSVG).prop('outerHTML');


	
	// Create a blank canvas
	let canvas = document.createElement("canvas"); // create <canvas> element
	$(outputDiv).append(canvas);
    canvas.width = w;
    canvas.height = h;
	
    let context = canvas.getContext("2d");
	
    let image = new Image; // create <img> element
	
	
	
	// Add canvas to page
	image.onload = function () {
		
		// White bg
		context.fillStyle = "white";
		context.fillRect(0, 0, w, h); 
		
		// Draw figure
		context.drawImage(image, 0, 0);


		cloneSVG.remove();
		
		//let url = canvas.toDataURL("image/png");
		resolve();

	  

		/*
		//console.log(url);
		let downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = name;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		*/
		
    }.bind(this);



    
    // btoa — binary string to ASCII (Base64-encoded)
    image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr))); 
	

 


	
}





function recordRecurse(n, recorder, data, drawFrame = function(cb) { }){




}

















