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



function initUtil(){


	
	SPECIES_UPLOADED_FILE = null;
	TEMPLATE_UPLOADED_FILE = null;
	GENE_UPLOADED_FILES = [];
	NUMBER_OF_GENE_TREES = 0;

	// Species tree upload
	var speciesTreeDropzone = new Dropzone("div#species_tree_upload", { url: "/file/post"});
	speciesTreeDropzone.on("addedfile", function(file) {
		

		removeFile(-1);
		var util_file = {id: -1, filename: file.name, message: "", uploadedAs: "species"};
		SPECIES_UPLOADED_FILE = util_file;
		$("#speciesTreeUploadTable").append(getFileUploadTemplate(util_file.id, util_file.filename));

		//addLoader("#species_tree_upload", "treeLoader");
		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {

				if (e == null || e.target.result == "") return;
				try {
					SPECIES_TREES_ALL = getTreesFromString(e.target.result);
					var speciesLeaves = getLeaves(SPECIES_TREES_ALL[0]);
					for (var i = 0; i < speciesLeaves.length; i ++){
						var species_leaf = speciesLeaves[i];
						species_leaf.branchToGeneNodeMap = [];
						species_leaf.nodeToGeneBranchMap = [];
					}
					SPECIES_TREES_ALL[0].successfullyMapped = true;

					// Attempts to map to any pre-existing gene trees
					if (NUMBER_OF_GENE_TREES > 0) {		
						var geneTrees = [];
						for (var i = 0; i < GENE_TREES_ALL.length; i ++){
							if (GENE_TREES_ALL[i] == null) geneTrees.push(null);
							else geneTrees.push(GENE_TREES_ALL[i][0]);
						}
						SPECIES_TREES_ALL[0].successfullyMapped = mapAllGeneTreesToSpeciesTree(speciesLeaves, geneTrees)
					}

				} 
				catch(err){
					$("#fileUpload_" + util_file.id + " .userMsg").html("<b>Error parsing file:</b>  " + err.message);
					$("#fileUpload_" + util_file.id + " .loader").remove();
					return;
				}
				
				NTREES = SPECIES_TREES_ALL.length;
				TREE_NUM = TREE_NUM == null ? 0 : TREE_NUM;
				console.log(theFile);
				$("#fileUpload_" + util_file.id + " .userMsg").html("File successfully parsed");
				if (SPECIES_TREES_ALL.length > 0 && SPECIES_TREES_ALL[0].successfullyMapped) $("#renderTreesBtn").removeClass("disabled");
				$("#fileUpload_" + util_file.id + " .loader").remove();
				FIRST_ANNOTATION_PASS = true;
				TREE_ANNOTATIONS = [];



			};

		})(file);

		reader.readAsText(file);

	});



	// Gene tree upload
	var geneTreeDropzone = new Dropzone("div#gene_tree_upload", { url: "/file/post"});
	geneTreeDropzone.on("addedfile", function(file) {
		
		var util_file = {id: GENE_UPLOADED_FILES.length, filename: file.name, message: "", uploadedAs: "gene"};
		var g = util_file.id;
		GENE_UPLOADED_FILES[g] = util_file;
		getFileUploadTemplate(g, util_file.filename);


		$("#geneTreeUploadTable").append(getFileUploadTemplate(g, util_file.filename));
		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {

				if (e == null || e.target.result == "") return;

				try{
					var trees = getTreesFromString(e.target.result);
					trees.name = theFile.name;
					
					GENE_TREES_ALL[g] = trees;
					

					// Mapping
					if (SPECIES_TREES_ALL != null && SPECIES_TREES_ALL.length > 0) {
						var speciesLeaves = getLeaves(SPECIES_TREES_ALL[0]);
						var mappingErrorMessage = mapGeneTreeToSpeciesTree(g, getLeaves(trees[0]), speciesLeaves);
						if (mappingErrorMessage != ""){
							$("#renderTreesBtn").addClass("disabled");
							$("#fileUpload_" + g + " .userMsg").html("<b>Error:</b> " + mappingErrorMessage);
							$("#fileUpload_" + g + " .userMsg").addClass("noMapError");
							$("#fileUpload_" + g + " .loader").remove();
							return;
						}
					}
					

					
				} 
				catch(err){
					$("#fileUpload_" + g + " .userMsg").html("<b>Error parsing file:</b>  " + err.message);
					$("#fileUpload_" + g + " .loader").remove();
					return;
				}
				

				NUMBER_OF_GENE_TREES++;
				$("#fileUpload_" + g + " .userMsg").html("File successfully parsed");
				$("#fileUpload_" + g + " .loader").remove();
				
				renderGeneTreeColourSettings();
				

			};

		})(file);

		reader.readAsText(file);

	});


	// Template upload
	var templateDropzone = new Dropzone("div#template_upload", { url: "/file/post"});
	templateDropzone.on("addedfile", function(file) {

		var util_file = {id: -2, filename: file.name, message: "", uploadedAs: "template"};
		
		removeFile(util_file.id);

		$("#sessionUploadTable").append(getFileUploadTemplate(util_file.id, util_file.filename));
		var reader = new FileReader();


		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {

				if (e == null || e.target.result == "") return;

				try{
					loadSessionFromString(e.target.result);
				} 
				catch(err){
					$("#fileUpload_" + util_file.id + " .userMsg").html("<b>Error parsing file:</b>  " + err.message);
					$("#fileUpload_" + util_file.id + " .loader").remove();
					return;
				}
				
				$("#fileUpload_" + util_file.id + " .userMsg").html("File successfully parsed");
				$("#fileUpload_" + util_file.id + " .loader").remove();
				

			};

		})(file);

		reader.readAsText(file);


	});



}






function parseSpeciesTree(str){






}





// Attempts to map all gene trees to the species tree, and if it fails reverts to the file upload menu and notifies the user
function mapAllGeneTreesToSpeciesTree(speciesLeaves, geneTrees){

	
	var successful = true;
	for (var g = 0; g < geneTrees.length; g ++){
			
		var geneTree = geneTrees[g];
		if (geneTree == null) continue;
		var leaves = getLeaves(geneTree);

		// Map the leaves to species leaves
		var mappingErrorMessage = mapGeneTreeToSpeciesTree(g, leaves, speciesLeaves);
		if (mappingErrorMessage != "") {
			$("#fileUpload_" + g + " .userMsg").html("<b>Error:</b> " + mappingErrorMessage);
			$("#fileUpload_" + g + " .userMsg").addClass("noMapError");
			successful = false;
			$("#renderTreesBtn").addClass("disabled");
		}else{
			$("#fileUpload_" + g + " .noMapError").html("File successfully parsed");
			$("#fileUpload_" + g + " .noMapError").removeClass("noMapError");
		}

	}


	if (successful) $("#renderTreesBtn").removeClass("disabled");
	else uploadNewFiles();

	return successful;

}




// Removes a species or gene tree and its associated file
function removeFile(g){

	if (g == -1){
		SPECIES_UPLOADED_FILE = null;
		$("#speciesTreeUploadTable").html("");
		SPECIES_TREES_ALL = [];
		SPECIES_TREES = null;
		$("#renderTreesBtn").addClass("disabled");

		console.log("Removing", $(".noMapError"). html());
		$(".noMapError").html("File successfully parsed");
		$(".noMapError").removeClass("noMapError");

	}
	else if (g == -2){
		$("#sessionUploadTable").html("");
	}
	else if (g >= 0){
		
		// Delete the gene tree
		GENE_TREES_ALL[g] = null;
		NUMBER_OF_GENE_TREES--;
	
		// Delete the gene tree file
		GENE_UPLOADED_FILES[g] = null;

		// Update html
		$("#fileUpload_" + g).remove();
		renderGeneTreeColourSettings();
	
	}

	if (NUMBER_OF_GENE_TREES == 0 && SPECIES_TREES_ALL.length > 0) {
		$("#renderTreesBtn").removeClass("disabled");
	}


}



// Gets an HTML template for file uploading
function getFileUploadTemplate(fileID, fileName){

	//console.log("Uploading", fileID, fileName);
	return ` <tr style="height:2em" id="fileUpload_` + fileID + `">
			<td style="min-width:20px"> <div title="Loading file..." class="loader" style="margin:auto"></div> </td>
			<td style="width:30%; text-align:right"><i>` + fileName + `</i>:</td>
			<td style="min-width:20px;"></td>
			<td class="userMsg" style="width:60%; text-align:justified"">Uploading</td>
			<td style="cursor:pointer; min-width:20px; font-size:200%;" title="Remove file" onclick="removeFile(` + fileID + `)">&times;</td>
		 </tr>`;

}



function addLoader(eleAddTo, id = "loader"){
	$(eleAddTo).append(`<div id="` + id + `" title="Loading file..." class="loader" style="margin:auto"></div>`);
}


function addOverlayLoader(){
	$("#innerBody").css("opacity", 0.5);
	$("body").append(`<div id="overlayLoader" class="overlay"><div title="Loading session..." class="loader"></div>Loading template from GitHub</div>`)
}

function removeOverlayLoader(){
	$("#innerBody").css("opacity", 1);
	$("#overlayLoader").remove();
}


// Get the leaves of the tree
function getLeaves(tree) {
	var leaves = [];
	for (var i = 0; i < tree.nodeList.length; i ++) {
		var node = tree.nodeList[i];
		if (node.children.length == 0) {
			leaves.push(node);
		}
	}
	return leaves;
}



function openDownloadDialog(){
	
	
	closeDialogs();
	$("#innerBody").css("opacity", 0.5);
	
	var html = `<ul class="flex-container center">
	
					<li style="text-align:left">
						<b>Download tree</b> <br><br>
						Width: <input class="numberinput cranberry" onclick="$(this).select()" id="downloadWidth" style="width:5em" value="` + SVG_WIDTH + `"> px <br><br>
						Height: <input class="numberinput cranberry" onclick="$(this).select()" id="downloadHeight"  style="width:5em" value="` + SVG_HEIGHT + `"> px <br><br>
						Format:
						 <select class="dropdown" id="downloadFormat">
							<option value="svg">.svg</option>
							<!--<option value="png">.png</option>-->
						</select> <br><br>
						<span class="button" onclick="downloadTree(); closeDialogs()">Download</span> <br><br>
					</li> 
					
					<li style="float:right">
						<b>Download template</b> <br><br>

						<div style="font-size:80%; width:20em; text-align:justify"> 
						By downloading an UglyTrees template, the current visual settings can be restored by
						uploading the xml template next time. UglyTree can also access the template from your GitHub
						page, allowing for users to visualise your trees with just one click. <a href="">More info here</a> <br> 
						</div><br><br>
						
						<span class="button" onclick="saveSession(); closeDialogs()">Download</span>
					</li>
	
				</ul>`;
	
	$("body").append(getdialogTemplate("Save As", html));
	openDialog();
}



function uploadNewFiles(){
	
	READY_TO_DRAW = false;
	
	$("#fileUploading").show(0);
	//$(".showAfterTreeUpload").hide(300);
				
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

					<div id="dialogDesc">` + desc + `</div><br>
					
					
					<span class="button" style="float:right" onclick="closeDialogs()">Close</span>
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
	//planTrees({svgSelector: "#downloadSVG", width: width, height: height});
	renderTrees({svgSelector: "#downloadSVG", width: width, height: height});
	$(".draggableLegend").css("opacity", 1);
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





function isPageHidden(){
     return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
 }



// Download a file
function download(filename, text) {


	// Open in new window
	if (filename == null || filename == ""){

		var wnd = window.open("data:text/html," + encodeURIComponent(text),  "_blank", "width=800,height=500");
		wnd.document.title = 'testing';
		wnd.focus();

	}

	// Download file
	else{

		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);


		if (document.createEvent) {
			var event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			pom.dispatchEvent(event);
		}
		else {
			pom.click();
		}
	}
}








