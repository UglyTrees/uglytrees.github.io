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

function openDownloadDialog(){
	

	closeDialogs();
	$("#innerBody").css("opacity", 0.5);
	
	var html = `<ul class="flex-container">
	
					<li style="text-align:left">
						<b>Download tree</b> <br><br>
						Width: <input class="numberinput" onclick="$(this).select()" id="downloadWidth" style="width:5em" value="` + SVG_WIDTH + `"> px <br><br>
						Height: <input class="numberinput" onclick="$(this).select()" id="downloadHeight"  style="width:5em" value="` + SVG_HEIGHT + `"> px <br><br>
						Format:
						 <select class="dropdown" id="downloadFormat">
							<option value="svg">.svg</option>
							<option value="png">.png</option>
						</select> <br><br>
						<span class="button" onclick="downloadTree(); closeDialogs()">Download</span> <br><br>
					</li> 
					
					<li>
						<b>Download template</b> <br><br>
						<span class="button" onclick="closeDialogs()">Download</span>
					</li>
	
				</ul>`;
	
	$("body").append(getdialogTemplate("Download settings", html));
	openDialog();
}



function uploadNewFiles(){
	
	$("#fileUploading").show(300);
	$(".showAfterTreeUpload").hide(300);
				
	var svg = $("#tree");
	svg.html("");
	svg.height(0);
	svg.width(0);
	
}



function openDialog(){

	window.setTimeout(function(){
		
	
		
		$(".dialog_inner").click(function(event){
			console.log("THE PROPAGATION HAS BEEN SEVERED");
			event.stopPropagation();
		});
		
		$("body").click(function(){
			closeDialogs();
		});
		

		
	}, 50);
	
	
}



function closeDialogs(){

	
	$("body").unbind('click');
	$(".dialog_inner").unbind('click');
	$(".dialog").remove();
	$("#innerBody").css("opacity", 1);
	
	
}



	


function getdialogTemplate(title, desc){
	return `
			<div id="operatorDialog" class="dialog">
				<div class="dialog_inner">
				<h2 class="">` + title + `</h2>

					<div id="dialogDesc" style="font-size:120%">` + desc + `</div><br>
					
					
					
				</div>
			</div>

		`;

}


function downloadTree(){
	
	var width = parseFloat($("#downloadWidth").val());
	var height = parseFloat($("#downloadHeight").val()); 
	var format = $("#downloadFormat").val();
	
	
	// Draw the svg again with specified width and height
	$("body").append(`<svg id="downloadSVG" style="display:none"></svg>`);
	renderTrees({svgSelector: "#downloadSVG", width: width, height: height});
	
	switch (format){
		
		case "svg":
			console.log("Downloading as svg with w=", width, ", h=", height);

			saveSvg(document.getElementById("downloadSVG"), "UglyTrees.svg")
		
			break;
			
			
		case "png":
			console.log("Downloading as png with w=", width, ", h=", height);

			var svg = document.getElementById("downloadSVG");
			
			break;

			svg.toBlob(function(blob) {
				saveAs(blob, "UglyTrees.png");
			}, "image/png");
		
			break;
		
		
	}
	
	
	// Delete the temporary canvas
	$("#downloadSVG").remove();
	
	
	
}





function saveSvg(svgEl, name) {
	svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	var svgData = svgEl.outerHTML;
	var preface = '<?xml version="1.0" standalone="no"?>\r\n';
	var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
	var svgUrl = URL.createObjectURL(svgBlob);
	var downloadLink = document.createElement("a");
	downloadLink.href = svgUrl;
	downloadLink.download = name;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}





















