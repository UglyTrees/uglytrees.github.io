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

function initTemplates(){


	TEMPLATE_SCRAPE_URL = null;
	ANNOTATIONS_UPLOADED_FROM_XML = false;

	// Attempt to load in a script from web (w) or GitHub (g)
	var urlParams = window.location.search.substr(1);
	
	if (urlParams.length > 0){

		var JSONurl = JSON.parse('{"' + decodeURI(urlParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
		if (JSONurl.w != null || JSONurl.g != null) {
			console.log("JSONurl", JSONurl);

			var URL, isHTTP;
			if (JSONurl.g == null) {
				URL = JSONurl.w;
				isHTTP = true;
			}else{
				URL = JSONurl.g;
				isHTTP = false;
			}
			
			var util_file = {id: -2, filename: URL, message: "", uploadedAs: "template"};
			removeFile(util_file.id);
			var tem = getFileUploadTemplate(util_file.id, "<b>" + (isHTTP ? "Web scrape" : "GitHub content") + ":</b> " + URL);
			$("#sessionUploadTable").append(tem);
			
			
			var callback = function(returnValue){
				console.log("returnValue", returnValue);
				var session = returnValue["session"];
				if (session.err != null) {
					errorFn(session.err);
				}
				else {
					var content = session.content.content;
					TEMPLATE_SCRAPE_URL = {url: URL, isHTTP: isHTTP};
					parseTemplateFile({target: {result: content}}, util_file);
				}
			}
		
			var errorFn = function(err){
				removeFile(util_file.id);
				console.log("Unable to access scripts", err);
				closeDialogs();
				$("#innerBody").css("opacity", 0.5);
				$("body").append(getdialogTemplate("Error: cannot access template", err.message));
				openDialog();
				//removeOverlayLoader();
			}


			var urls = [{name: "session", url: URL, isHTTP: isHTTP}];

			requestFromGitHub(urls, callback, errorFn);
		
		}
		

	}

}



// Accesses a file on GitHub and returns it in the callback
// Parse the GitHub url in the format: owner/repo/path/to/file.txt
// Returns a JSON containing the 'url' of the page and the 'contant' 
function requestFromGitHub(githubURLs, callback = function(response) {}, errorFn = function(errorMsg) {} ){


	var scriptUrl = "https://script.google.com/macros/s/AKfycbyGQQja01ho2Rm2vrNzX8F-NcgG5uEaFDA4Z_sFOcdpyur1YTQ/exec";
	var url = scriptUrl + "?urls=" + JSON.stringify(githubURLs) + "&callback=?";
	console.log("Requesting", url);

	$.ajax({
		url: url,
		dataType: 'json',
		success: callback,
		error:errorFn
	});

}





// Save the session to an xml file
// Using classes from XMLWriter.js   https://github.com/flesler/XMLWriter
function saveSession(){
	

	const monthNames = ["Jan", "Feb", "March", "April", "May", "June",
  		"July", "Aug", "Sep", "Oct", "Nov", "Dec"
		];


	var currentdate = new Date(); 
	var datetime = 
			currentdate.getDate() +
			monthNames[currentdate.getMonth()]  + 
			currentdate.getFullYear() + "-"
		    + currentdate.getHours() + ":"  
		    + currentdate.getMinutes() + ":" 
		    + currentdate.getSeconds();

	var toCall = () => new Promise((resolve) => getXMLstringOfSession(datetime, resolve));
	toCall().then((str) => {

		console.log("datetime", datetime);
		download("UglyTrees-" + datetime + ".xml", str);


	});
	


}


function getXMLstringOfSession(datetime = "", callback = function(str) { }){


	//console.log(result);

	var saveXML = new XMLWriter('UTF-8');
	saveXML.formatting = 'indented';
	saveXML.writeStartDocument();

	
	saveXML.writeStartElement('uglytrees');
	if (datetime != "") saveXML.writeAttributeString('datetime', datetime);
	saveXML.writeAttributeString('TREE_NUM', TREE_NUM);



		// Tree files
		saveXML.writeStartElement('trees');

		saveXML.writeComment(`The file names below may be edited to point to a url. If the UglyTrees session is uploaded from GitHub, these files will
		be read relative to the template directory on GitHub. Otherwise, the files will not be read at all.`);

			// Species tree
			if (SPECIES_UPLOADED_FILE != null) {
				saveXML.writeStartElement('species');
				saveXML.writeAttributeString('filename', SPECIES_UPLOADED_FILE.filename);
				saveXML.writeEndElement();
			}

			// Gene tree
			for (var i = 0; i < GENE_UPLOADED_FILES.length; i ++){
				if (GENE_UPLOADED_FILES[i] != null){
					saveXML.writeStartElement('gene');
					saveXML.writeAttributeString('filename', GENE_UPLOADED_FILES[i].filename);
					saveXML.writeEndElement();
				}
			}

		saveXML.writeEndElement();
		// End tree files





		// User message
		saveXML.writeComment(`By setting 'display' below to 'true', the following introductory message will appear in a dialog when the template is first loaded.`);
		saveXML.writeStartElement('intro');
		saveXML.writeAttributeString('display', false);

		saveXML.writeStartElement('main');
		saveXML.writeAttributeString('string', `Welcome to UglyTrees`);
		saveXML.writeEndElement();

		saveXML.writeStartElement('body');
		saveXML.writeAttributeString('string', `This text may be edited in the .xml template to customise messages presented to the user when the template is loaded. &lt;br>&lt;br>
							This &lt;b style='color:#DB5079'>message&lt;/b> can be rendered using inline HTML stylings if escape characters are used in the .xml string &lt;h2>Heading 2 &lt;/h2> &lt;h3>Heading 3 &lt;/h3>`);
		saveXML.writeEndElement();

		// End user message
		saveXML.writeEndElement();



		// View
		saveXML.writeStartElement('view');
		saveXML.writeAttributeString('SHOW_X_AXIS', SHOW_X_AXIS);
		saveXML.writeAttributeString('SHOW_Y_AXIS', SHOW_Y_AXIS);
		
			// Annotations
			for (var i = 0; i < TREE_ANNOTATIONS.length; i ++){
				var annotation = TREE_ANNOTATIONS[i];
				saveXML.writeStartElement('annotation');
				saveXML.writeAttributeString('name', annotation.name);
				saveXML.writeAttributeString('format', annotation.format);
				saveXML.writeAttributeString('gradientMin', annotation.gradientMin);
				saveXML.writeAttributeString('gradientMax', annotation.gradientMax);
				saveXML.writeAttributeString('ncols', annotation.ncols);

					// Legend
					saveXML.writeStartElement('legend');
					saveXML.writeAttributeString('showLegend', annotation.legend.showLegend);
					saveXML.writeAttributeString('width', annotation.legend.width);
					saveXML.writeAttributeString('height', annotation.legend.height);
					saveXML.writeAttributeString('x', annotation.legend.x);
					saveXML.writeAttributeString('y', annotation.legend.y);
					saveXML.writeEndElement();


					// Discrete values
					for (var val in annotation.discreteCols){
						saveXML.writeStartElement('class');
						saveXML.writeAttributeString('value', val);
						saveXML.writeAttributeString('col', annotation.discreteCols[val]);
						saveXML.writeEndElement();
					}




				saveXML.writeEndElement();
			}


		// End view
		saveXML.writeEndElement();
		



		// Species tree settings
		saveXML.writeStartElement('speciestree');

		saveXML.writeAttributeString('SPECIES_TREE_OPACITY', SPECIES_TREE_OPACITY);
		saveXML.writeAttributeString('SPECIES_LABEL_FONT_SIZE', SPECIES_LABEL_FONT_SIZE);
		
		saveXML.writeAttributeString('SPECIES_WIDTH_ANNOTATION_TOP', SPECIES_WIDTH_ANNOTATION_TOP);
		saveXML.writeAttributeString('SPECIES_WIDTH_ANNOTATION_BOTTOM', SPECIES_WIDTH_ANNOTATION_BOTTOM);
		saveXML.writeAttributeString('SUBTREE_SPACER', SUBTREE_SPACER);

		saveXML.writeAttributeString('SPECIES_BRANCH_MULTIPLIER', SPECIES_BRANCH_MULTIPLIER);
		saveXML.writeAttributeString('SPECIES_BRANCH_WIDTH', SPECIES_BRANCH_WIDTH);

		saveXML.writeAttributeString('SPECIES_BRANCH_BORDER_ANNOTATION', SPECIES_BRANCH_BORDER_ANNOTATION);
		saveXML.writeAttributeString('SPECIES_TREE_BORDER_COL', SPECIES_TREE_BORDER_COL);

		saveXML.writeAttributeString('SPECIES_BRANCH_BGCOL_ANNOTATION', SPECIES_BRANCH_BGCOL_ANNOTATION);
		saveXML.writeAttributeString('SPECIES_TREE_BG_COL', SPECIES_TREE_BG_COL);

		// End species tree settings
		saveXML.writeEndElement();




		// Gene tree settings
		saveXML.writeStartElement('genetrees');

		saveXML.writeAttributeString('GENE_TREE_OPACITY', GENE_TREE_OPACITY);

		saveXML.writeAttributeString('GROUP_GENES_BY_TAXA', GROUP_GENES_BY_TAXA);

		saveXML.writeAttributeString('GENE_NODE_MULTIPLIER', GENE_NODE_MULTIPLIER);
		saveXML.writeAttributeString('GENE_NODE_SIZE', GENE_NODE_SIZE);

		saveXML.writeAttributeString('GENE_BRANCH_MULTIPLIER', GENE_BRANCH_MULTIPLIER);
		saveXML.writeAttributeString('GENE_BRANCH_WIDTH', GENE_BRANCH_WIDTH);

		saveXML.writeAttributeString('GENE_BRANCH_BGCOL_ANNOTATION', GENE_BRANCH_BGCOL_ANNOTATION);


			// Individual tree settings
			for (var g = 0;  g < GENE_TREES.length; g ++){
				if (GENE_TREES[g] == null) continue;
				saveXML.writeStartElement('gene');
				saveXML.writeAttributeString('display', GENE_TREE_DISPLAYS[g] == null ? "true" : GENE_TREE_DISPLAYS[g]);
				saveXML.writeAttributeString('col', getGeneTreeColour(g));
				saveXML.writeEndElement();
			}



		// End gene tree settings
		saveXML.writeEndElement();
		





	saveXML.writeEndElement();
	saveXML.writeEndDocument();
	callback(saveXML.flush());

		

}




// Upload template from string
function loadSessionFromString(text, resolve = function() { }) {


	var parser = new DOMParser();

	try {
		var xmlDoc = parser.parseFromString(text, "text/xml");
	

		console.log(xmlDoc);
		var uglytrees = xmlDoc.getElementsByTagName("uglytrees")[0];
		TREE_NUM = getValFloat(uglytrees.getAttribute("TREE_NUM"), TREE_NUM);
		if (TREE_NUM != null) {
			$("#treeNum").val(TREE_NUM);
			resizeInput($("#treeNum"));
		}

		
		// View
		var view = uglytrees.getElementsByTagName("view");
		if (view.length > 0) {

			view = view[0];
			SHOW_X_AXIS = view.getAttribute("SHOW_X_AXIS") === "true";
			SHOW_Y_AXIS = view.getAttribute("SHOW_Y_AXIS") === "true";

			var annotations = view.getElementsByTagName("annotation");
			for (var i = 0; i < annotations.length; i ++){

				ANNOTATIONS_UPLOADED_FROM_XML = true;
		
				var ann_name = getVal(annotations[i].getAttribute("name"), "", "Cannot find name for annotation " + (i+1));
				var format = getVal(annotations[i].getAttribute("format"), "nominal")
				var gradientMin = getVal(annotations[i].getAttribute("gradientMin"), "#ffff1a");
				var gradientMax = getVal(annotations[i].getAttribute("gradientMax"), "#7950DB");;
				var ncols = getValFloat(annotations[i].getAttribute("ncols"), 20);
				var legend = annotations[i].getElementsByTagName("legend")[0];
				var showLegend = legend.getAttribute("showLegend") === "true";
				var w = getValFloat(legend.getAttribute("width"), 20);
				var h = getValFloat(legend.getAttribute("height"), 20);
				var x = getValFloat(legend.getAttribute("x"), 0.95);
				var y = getValFloat(legend.getAttribute("y"), 0.95);


				// DiscreteCols
				var discreteCols = {};
				var classes = annotations[i].getElementsByTagName("class");
				for (var j = 0; j < classes.length; j ++){
					var value = getVal(classes[j].getAttribute("value"), "", "Cannot find value for a class under annotation " + ann_name);
					var col = getVal(classes[j].getAttribute("col"), "", "Cannot find colour for a class under annotation " + ann_name);		
					discreteCols[value] = col;
				}
				
		
				var annotation = {name: ann_name, complete: true, format: format, mustBeNumerical: false, mustBeNominal: false, gradientMin: gradientMin, gradientMax: gradientMax, ncols: ncols, discreteCols: discreteCols, speciesTree: false, minVal: 0, maxVal: 0, legend: {showLegend: showLegend, width: w, height: h, x: x, y: y}};

				renderAnnotations([annotation]);

			}

		}


		// Species tree
		var speciestree = uglytrees.getElementsByTagName("speciestree");
		if (speciestree.length > 0) {
			speciestree = speciestree[0];
			SPECIES_TREE_OPACITY = getValFloat(speciestree.getAttribute("SPECIES_TREE_OPACITY"), SPECIES_TREE_OPACITY);
			SPECIES_LABEL_FONT_SIZE = getValFloat(speciestree.getAttribute("SPECIES_LABEL_FONT_SIZE"), SPECIES_LABEL_FONT_SIZE);
			SUBTREE_SPACER = getValFloat(speciestree.getAttribute("SUBTREE_SPACER"), SUBTREE_SPACER);
			SPECIES_BRANCH_WIDTH = getValFloat(speciestree.getAttribute("SPECIES_BRANCH_WIDTH"), SPECIES_BRANCH_WIDTH);
			SPECIES_TREE_BORDER_COL = getVal(speciestree.getAttribute("SPECIES_TREE_BORDER_COL"), SPECIES_TREE_BORDER_COL);
			SPECIES_TREE_BG_COL = getVal(speciestree.getAttribute("SPECIES_TREE_BG_COL"), SPECIES_TREE_BG_COL);
			SPECIES_BRANCH_BORDER_ANNOTATION = getVal(speciestree.getAttribute("SPECIES_BRANCH_BORDER_ANNOTATION"), "_none");
			SPECIES_BRANCH_MULTIPLIER = getVal(speciestree.getAttribute("SPECIES_BRANCH_MULTIPLIER"), "_none");
			SPECIES_WIDTH_ANNOTATION_TOP = getVal(speciestree.getAttribute("SPECIES_WIDTH_ANNOTATION_TOP"), "_none");
			SPECIES_WIDTH_ANNOTATION_BOTTOM = getVal(speciestree.getAttribute("SPECIES_WIDTH_ANNOTATION_BOTTOM"), "_none");
			SPECIES_BRANCH_BGCOL_ANNOTATION = getVal(speciestree.getAttribute("SPECIES_BRANCH_BGCOL_ANNOTATION"), "_none");
		}



		// Gene tree
		var genetree = uglytrees.getElementsByTagName("genetrees");
		if (genetree.length > 0) {
			genetree = genetree[0];

			
			var genes = genetree.getElementsByTagName("gene");
			for (var g = 0; g < genes.length; g ++){

				var col = getVal(genes[g].getAttribute("col"), null);
				if (col != null) setGeneTreeColours(g, col, false);

				var show = genes[g].getAttribute("display") === "true";
				GENE_TREE_DISPLAYS[g] = show;

			}



			GENE_TREE_OPACITY = getValFloat(speciestree.getAttribute("v"), GENE_TREE_OPACITY);
			GROUP_GENES_BY_TAXA = genetree.getAttribute("GROUP_GENES_BY_TAXA") === "true";
			GENE_NODE_MULTIPLIER = getVal(genetree.getAttribute("GENE_NODE_MULTIPLIER"), "_none");
			GENE_BRANCH_BGCOL_ANNOTATION = getVal(genetree.getAttribute("GENE_BRANCH_BGCOL_ANNOTATION"), "_none");
			GENE_BRANCH_MULTIPLIER = getVal(genetree.getAttribute("GENE_BRANCH_MULTIPLIER"), "_none");		
			GENE_NODE_SIZE = getValFloat(genetree.getAttribute("GENE_NODE_SIZE"), GENE_NODE_SIZE);
			GENE_BRANCH_WIDTH = getValFloat(genetree.getAttribute("GENE_BRANCH_WIDTH"), GENE_BRANCH_WIDTH);


			
		}


		// Intro dialog
		var intro = uglytrees.getElementsByTagName("intro");
		if (intro.length > 0) {
			intro = intro[0];
			var display = intro.getAttribute("display") === "true";
			
			var main = getVal(intro.getElementsByTagName("main")[0].getAttribute("string"), "");
			var body = getVal(intro.getElementsByTagName("body")[0].getAttribute("string"), "");

			console.log("display", intro.getAttribute("display"), display, main, body)

			if (display) {
				closeDialogs();
				$("#innerBody").css("opacity", 0.5);
				$("body").append(getdialogTemplate(main, body, "The views expressed in the above message are not affiliated with and are not endorsed by UglyTrees."));
				openDialog();
			}

		}


		// Trees
		var treesXML = uglytrees.getElementsByTagName("trees");
		if (treesXML.length > 0) {
			treesXML = treesXML[0];


			var species = treesXML.getElementsByTagName("species");
			

			// Get directory of the template session parsed in the url
			// Example:
			// 	uglytrees/uglytrees.github.io/trees/session.xml -> uglytrees/uglytrees.github.io/trees/
			// or
			//	http://www.uglytrees.nz/trees/session.xml -> http://www.uglytrees.nz/trees/
			var relativeDir = "";
			if (TEMPLATE_SCRAPE_URL != null){
				var strsplit = TEMPLATE_SCRAPE_URL.url.split("/");
				for (var b = 0; b < strsplit.length - 1; b ++){
					relativeDir += strsplit[b] + "/";
				}
			}

			console.log("relativeDir", relativeDir);


			// Parse trees if a) the tree is a http, or b) the session was loaded though the backend
			var genes = treesXML.getElementsByTagName("gene");
			for (var g = -1; g < genes.length; g ++){

				
				var isSpeciesTree = g == -1;
				if (isSpeciesTree) {
					if (species.length == 0) continue;
					else filename = getVal(species[0].getAttribute("filename"), null);
				}
				else filename = getVal(genes[g].getAttribute("filename"), null);

				if (filename != null) {



					var requestName = isSpeciesTree ? "species" : "gene" + g;
					var URLobj = {name: requestName, url: "", isHTTP: false};

					// Case 1: the tree has a url. Load the URL directly.
					if (isUrl(filename)) {
						URLobj.url = filename;
						URLobj.isHTTP = true;

					// Case 2: the tree is relative to the template xml and a template xml was parsed through the URL bar.
					// could be website or could be github, depending on the location of template file
					}else if (TEMPLATE_SCRAPE_URL != null){
						URLobj.url = relativeDir + filename;
						URLobj.isHTTP = TEMPLATE_SCRAPE_URL.isHTTP;
					}

					// Case 3: the tree is a file path and the template was uploaded manually. Do not attempt to locate the file. 
					else continue;



					// Activate file upload GUI 
					var util_file = {id: g, filename: URLobj.url, message: "", uploadedAs: g == -1 ? "species" : "gene"};

					removeFile(util_file.id);
					var tem = getFileUploadTemplate(util_file.id, "<b>GitHub content:</b> " + util_file.filename);
					if (isSpeciesTree) $("#speciesTreeUploadTable").append(tem);
					else $("#geneTreeUploadTable").append(tem);


					if (isSpeciesTree) SPECIES_UPLOADED_FILE = util_file;
					else GENE_UPLOADED_FILES[g] = util_file;

					// Download each tree one at a time
					treeDownloadFromExternalSource(URLobj, util_file, isSpeciesTree);


					
				}

			}


		}

		

		setInterfaceFromVisualParams();


	} catch(err){
		console.log(err);
		throw err;
		
	}

}



// Access the backend to download a tree, and then parse its contents on the frontend
function treeDownloadFromExternalSource(URLobj, util_file, isSpeciesTree){

	
	var callback = function(returnValue){
		

		console.log(URLobj.name, "returnValue", returnValue);

		var trees = returnValue[URLobj.name];
		if (trees.err != null) {
			errorFn(trees.err);
		}
		else {
			var content = trees.content.content;
			if (isSpeciesTree) parseSpeciesTree({target: {result: content}}, util_file);
			else parseGeneTree({target: {result: content}}, util_file);
		}
	}

	var errorFn = function(err){
		removeFile(util_file.id);
		console.log("Unable to access scripts", err);
		closeDialogs();
		$("#innerBody").css("opacity", 0.5);
		$("body").append(getdialogTemplate("Error: cannot access template", err.message));
		openDialog();
	}


	requestFromGitHub([URLobj], callback, errorFn);


}




function getVal(val, _default, throwError = false){
	if (val == null || val == "") {
		if (throwError == false) return _default;
		throw {message: throwError};
	}
	return val;
}




function getValFloat(val, _default, throwError = false){
	var valNum = parseFloat(val);
	if (val == null || val == "" || isNaN(valNum)) {
		if (throwError == false) return _default;
		throw {message: throwError};
	}
	return valNum;

}









