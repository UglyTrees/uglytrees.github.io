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


// Initialise default visual settings and render them on the page
function initVisualSettings(){
	SIDENAV_WIDTH = 300;
	
	
	DEFAULT_COLOURS = ["#50b2db",  "#50db79", "#db506d", "#7950DB", "#b2db50", "#db7950", 
						"#4e8791", "#ff1919", "#228B22", "#91584e", "#584e91", "#009fe1", "#ffff1a", "#ff8d1a", "#DB5079",
						"#000000", "#606060", "#707070", "#A0A0A0", "#BEBEBE", "#d3d3d3", "#E0E0E0", "#FFFFFF"];
	GENE_TREE_COLOURS = [];
	setInitialGeneTreeColours();
	GENE_TREE_DISPLAYS = {};
	START_PLAYING = false;
	
	
	TREE_ANNOTATIONS = [];
	CURRENTLY_SELECTED_SPECIES_ANNOTATION = {};
	SPECIES_BRANCH_BGCOL_ANNOTATION = "_none";
	SPECIES_BRANCH_BORDER_ANNOTATION = "_none";
	SPECIES_BRANCH_MULTIPLIER = "_none";
	SPECIES_WIDTH_ANNOTATION = "_none";
	GENE_BRANCH_MULTIPLIER = "_none";
	GENE_NODE_MULTIPLIER = "_none";
	GENE_BRANCH_BGCOL_ANNOTATION = "_none";


	SPECIES_TREE_BG_COL = "#FFFFFF";
	SPECIES_TREE_BORDER_COL = "#000000";
	$("#colourboxspeciesBG").css("background-color", SPECIES_TREE_BG_COL);
	$("#colourboxspeciesBorder").css("background-color", SPECIES_TREE_BORDER_COL);
	
	SUBTREE_SPACER = 0.2
	GENE_NODE_SIZE = 4;
	GENE_BRANCH_WIDTH = 1;
	SPECIES_BRANCH_WIDTH = 1;
	SPECIES_TREE_OPACITY = 100;
	GROUP_GENES_BY_TAXA = false;
	
	FADE_TIME = 500;
	ANIMATION_TIME = 500; // Remember to also update CSS sheet: path { transition: fill 0.5s ease;}
	PLAY_TIME = 800;

	CURRENT_ANIMATION_TIME = ANIMATION_TIME;
	SHOW_X_AXIS = false;
	SHOW_Y_AXIS = true;
	

	
	$("#SPECIES_TREE_OPACITY").val(SPECIES_TREE_OPACITY);
	$("#SUBTREE_SPACER").val(SUBTREE_SPACER);
	$("#GENE_NODE_SIZE").val(GENE_NODE_SIZE);
	$("#GENE_BRANCH_WIDTH").val(GENE_BRANCH_WIDTH);
	$("#SPECIES_BRANCH_WIDTH").val(SPECIES_BRANCH_WIDTH);
	$("#GROUP_GENES_BY_TAXA").prop("checked", GROUP_GENES_BY_TAXA);
	$("#SPECIES_BRANCH_MULTIPLIER").val(SPECIES_BRANCH_MULTIPLIER);
	$("#GENE_BRANCH_MULTIPLIER").val(GENE_BRANCH_MULTIPLIER);
	$("#GENE_BRANCH_BGCOL_ANNOTATION").val(GENE_BRANCH_BGCOL_ANNOTATION);
	$("#GENE_NODE_MULTIPLIER").val(GENE_NODE_MULTIPLIER);
	$("#SPECIES_WIDTH_ANNOTATION").val(SPECIES_WIDTH_ANNOTATION);
	$("#SPECIES_BRANCH_BGCOL_ANNOTATION").val(SPECIES_BRANCH_BGCOL_ANNOTATION);
	$("#SPECIES_BRANCH_BORDER_ANNOTATION").val(SPECIES_BRANCH_BORDER_ANNOTATION);
	
	
	$("#SHOW_X_AXIS").prop("checked", SHOW_X_AXIS);
	$("#SHOW_Y_AXIS").prop("checked", SHOW_Y_AXIS);
	
	

	FIRST_ANNOTATION_PASS = true;

	
	renderParameterValues();
	
}


function setInitialGeneTreeColours(){
	
	for (var i = 0; i < DEFAULT_COLOURS.length; i ++){
		GENE_TREE_COLOURS[i] = DEFAULT_COLOURS[i];
	}
	
}


// Open a side navigation menu, or close if it is already open
function openNav(id) {
	
	

	if (parseFloat($("#" + id).width()) > 0){
		closeNav();
		return true;
	}
	
	
	
	$("#" + id).width(SIDENAV_WIDTH + "px");
	$("#" + id).attr("opened", "yes");
	$("#innerBody").css("marginLeft", SIDENAV_WIDTH + "px");
	//$("#footer").width(parseFloat($("#innerBody").width()) * 0.99);
	return false;

}


// Close a side navigation menu, or close all side navigation menus if is is not specified
function closeNav(id = null) {
	
	$('#hoverAnnotationDiv').hide(0);
	if (id == null) {
		$(".sidenav").width(0);
		$(".sidenav").attr("opened", "no");
		$("#innerBody").css("marginLeft", 0);
		//$("#footer").width(parseFloat($("#innerBody").width()) * 0.99);
		
		$("#tree").html("");
		stop();
		setTimeout(function(){
			planTrees();
			renderTrees();
		}, 500);
		
	}
	else {
		$("#" + id).width(0);
		$("#" + id).attr("opened", "no");
	}

	
};


// Close all side navigation menus except for the one specified
function closeAllNavsExcept(id) {
	

	var sideNavEles = $(".sideNav");
	for (var i = 0; i < sideNavEles.length; i ++){
		var eleID = $(sideNavEles[i]).attr("id");
		if (eleID != id) closeNav(eleID);
	}

	
};


// Open/close the specified side navigation menu. Close other menus as applicable
function openSettings(id){
	
	var alreadyOpen = $(`.sideNav[opened="yes"]`).length > 0;
	console.log(alreadyOpen, $(`.sideNav[opened="yes"]`));
	openNav(id);
	closeAllNavsExcept(id);
	if (!alreadyOpen) {
		$("#tree").html("");
		$('#hoverAnnotationDiv').hide(0);
		stop();
		$('#hoverAnnotationDiv').hide(0);
		setTimeout(function(){
			planTrees();
			renderTrees();
		}, 500);
	}

}




// Load in all visual parameters from sidenav menus and redraw the tree
function setVisualParams(){
	
	SUBTREE_SPACER = parseFloat($("#SUBTREE_SPACER").val());
	SUBTREE_SPACER = Math.max(SUBTREE_SPACER, 0);
	
	GENE_NODE_SIZE = parseFloat($("#GENE_NODE_SIZE").val());
	GENE_NODE_SIZE = Math.max(GENE_NODE_SIZE, 0);
	
	GENE_BRANCH_WIDTH = parseFloat($("#GENE_BRANCH_WIDTH").val());
	GENE_BRANCH_WIDTH = Math.max(GENE_BRANCH_WIDTH, 0);
	
	SPECIES_BRANCH_WIDTH = parseFloat($("#SPECIES_BRANCH_WIDTH").val());
	SPECIES_BRANCH_WIDTH = Math.max(SPECIES_BRANCH_WIDTH, 0);	
	
	SPECIES_TREE_OPACITY = parseFloat($("#SPECIES_TREE_OPACITY").val());
	SPECIES_TREE_OPACITY = Math.min(Math.max(SPECIES_TREE_OPACITY, 0), 100);	
	
	
	GROUP_GENES_BY_TAXA = $("#GROUP_GENES_BY_TAXA").is(":checked");
	SPECIES_BRANCH_MULTIPLIER = $("#SPECIES_BRANCH_MULTIPLIER").val();
	GENE_BRANCH_MULTIPLIER = $("#GENE_BRANCH_MULTIPLIER").val();
	GENE_BRANCH_BGCOL_ANNOTATION = $("#GENE_BRANCH_BGCOL_ANNOTATION").val();
	GENE_NODE_MULTIPLIER = $("#GENE_NODE_MULTIPLIER").val();
	SPECIES_BRANCH_BGCOL_ANNOTATION = $("#SPECIES_BRANCH_BGCOL_ANNOTATION").val();
	SPECIES_BRANCH_BORDER_ANNOTATION = $("#SPECIES_BRANCH_BORDER_ANNOTATION").val();
	
	var newSpeciesWidthAnnotation = $("#SPECIES_WIDTH_ANNOTATION").val();
	if (false && SPECIES_WIDTH_ANNOTATION != newSpeciesWidthAnnotation) {
		if (newSpeciesWidthAnnotation != "_none") SHOW_X_AXIS = true;
		$("#SHOW_X_AXIS").prop("checked", SHOW_X_AXIS);
		
	}
	SPECIES_WIDTH_ANNOTATION = newSpeciesWidthAnnotation;
	
	SHOW_X_AXIS = $("#SHOW_X_AXIS").is(":checked");
	SHOW_Y_AXIS = $("#SHOW_Y_AXIS").is(":checked");
	
	for (var g = 0; g < GENE_TREES_ALL.length; g ++){
		if (GENE_TREES_ALL[g] == null) continue;
		GENE_TREE_DISPLAYS[g] = $("#selectGeneTree" + g).is(":checked");
	}
	

	
	
	//if (SPECIES_TREE_BG_COL.toLowerCase() == "TRANSPARENT") $("#speciesOpacityDiv").hide(300);
	//else $("#speciesOpacityDiv").show(300);

	renderParameterValues();
	planTrees();
	renderTrees(null, true);
	
	
	console.log("CURRENTLY_SELECTED_SPECIES_ANNOTATION", CURRENTLY_SELECTED_SPECIES_ANNOTATION);
	
	
}




// Print the value of each parameter below its html input
function renderParameterValues(){
		
	var settingEles = $(".sideNavSetting");
	for (var i = 0; i < settingEles.length; i ++){
		var ele = $(settingEles[i]);
		var child = ele.children("input");
		console.log(child.val());
		//ele.attr("title", roundToSF(parseFloat(child.val())));
		child.next("span").html(roundToSF(parseFloat(child.val())));
		
	}
	
	
}


// Generate gene tree colouring html
function renderGeneTreeColourSettings(){
	

	var headerHTML = `
		<tr class="sideNavSetting">
			<td style="text-align:right">
				<label title="Toggle all" class="checkbox-container">
					<input id="selectAllGeneTrees" onchange="selectAllGeneTrees()" type="checkbox" checked="checked">
					<span class="checkmark"></span>
				</label>
			</td>
			<td>
				
			</td>
			<td>
				
			</td>
		</tr>`;
	$("#geneTreeColours").html(headerHTML);
	
	

	
	for (var i = 0; i < GENE_TREES_ALL.length; i ++){
		if (GENE_TREES_ALL[i] == null) continue;
		var html = `
		<tr id="visualSettingsRow` + i + `" class="sideNavSetting">
			<td>
				<label title="Toggle gene tree display" class="checkbox-container small">
					<input class="genetreecheckbox" onchange="setVisualParams();" id="selectGeneTree` + i + `" type="checkbox" checked="checked">
					<span class="checkmark"></span>
				</label>
			</td>
			<td>
				<span id="colourbox` + i + `" class="colourbox" title="Select colour" onclick="openColourPicker(` + i + `);" style="background-color:` + getGeneTreeColour(i) + `"></span>
			</td>
			<td>
				` + GENE_TREES_ALL[i].name + `
			</td>
		</tr>`;
		$("#geneTreeColours").append(html);
		
		
	
	}
	
	
}




// Tick / untick all gene tree visualisation boxes
function selectAllGeneTrees(){
	
	if ($("#selectAllGeneTrees").is(":checked")){
		$(".genetreecheckbox").prop('checked', true);
	}
	else{
		$(".genetreecheckbox").prop('checked', false);
	}
	
	
	setVisualParams();
	
}


// Open the colour picker container under a gene tree setting
function openColourPicker(geneTreeNum){
	

	var currentCol = getGeneTreeColour(geneTreeNum).toUpperCase();

	
	if ($("#colourpickerrow_" + geneTreeNum).length > 0) {
		$("#colourpickerrow_" + geneTreeNum).hide(300, function(){
			$(this).remove();
		});
		return;
	}
		
	var colourPickHtml = `
		<tr id="colourpickerrow_` + geneTreeNum + `" style="display:none" class="colourpickerrow">
			<td colspan=3>
				<ul class="flex-container thicklines" style="font-size:100%;">`;			
				
	
	var colMatch = false;
	for (var colNum = 0; colNum <= DEFAULT_COLOURS.length; colNum++){
		var col;
		if (colNum == DEFAULT_COLOURS.length) col = "TRANSPARENT";
		else col = DEFAULT_COLOURS[colNum].toUpperCase();
		//console.log("col", col, currentCol);
		
		var addClass = "";
		if (col == currentCol){
			addClass = "selected";
			colMatch = true;
		}
		
		if (col == "TRANSPARENT") addClass += " dashed";
		colourPickHtml += `
				<li class="flex-item">
					<span class="colourbox ` + addClass + `" title="` + col + `" onclick="selectColour(this, '` + geneTreeNum + `');" style="background-color:` + col + `"></span>
				</li>`;
		
	}		
	
	// Custom hex codes
	colourPickHtml += `
				<li class="flex-item" style="margin-left:10px" title="Enter hex code">
					Hex code: <input id="geneColHexCode` + geneTreeNum + `" class="numberinput" onchange="selectColour(this, '` + geneTreeNum + `');" style="width:6em" value="#">
				</li>`;
	
	colourPickHtml += `</ul></td></tr>`;

	
	if (geneTreeNum == parseFloat(geneTreeNum)) {
		$("#visualSettingsRow" + geneTreeNum).after(colourPickHtml);
	}
	else {
		console.log(geneTreeNum, $("#" + geneTreeNum));
		$("#" + geneTreeNum).after(colourPickHtml);
	}
	
	// If the current colour is not in the grid, then put it in text box
	if (!colMatch){
		$("#geneColHexCode" + geneTreeNum).val(currentCol);
	}
	
	$("#colourpickerrow_" + geneTreeNum).show(300);
	
	
}


function selectColour(col_ele, geneTreeNum){
	
	var col;
	if ($(col_ele).hasClass("colourbox")){
		col = $(col_ele).attr("title");
	}else{
		col = $(col_ele).val();
	}
	
	
	
	setGeneTreeColours(geneTreeNum, col);
	
	$("#colourpickerrow_" + geneTreeNum).hide(300, function(){
		$(this).remove();
	});
	

}


function getDefaultColour(index){
	
	var index2 = index % DEFAULT_COLOURS.length;
	return rgbToHex(DEFAULT_COLOURS[index2]);
	
}



// Get the colour of a gene tree
function getGeneTreeColour(geneTreeNumber){
	
	if (geneTreeNumber == parseFloat(geneTreeNumber)) {
		var index = geneTreeNumber % GENE_TREE_COLOURS.length;
		return rgbToHex(GENE_TREE_COLOURS[index]);
	}

	if (geneTreeNumber == "speciesBorder") return rgbToHex(SPECIES_TREE_BORDER_COL);
	else if (geneTreeNumber == "speciesBG") return rgbToHex(SPECIES_TREE_BG_COL);
	else if (geneTreeNumber == "speciesTreeAnnotationMinCol") return rgbToHex(CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMin);
	else if (geneTreeNumber == "speciesTreeAnnotationMaxCol") return rgbToHex(CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMax);
	else if (geneTreeNumber.includes("speciesAnnotationDiscreteRow_")) {
		var value = geneTreeNumber.split("_")[1];
		return rgbToHex(CURRENTLY_SELECTED_SPECIES_ANNOTATION.discreteCols[value]);
	}

	return null;

}


// Set the colour a gene tree
function setGeneTreeColours(geneTreeNumber, colour){
	
	
	if (geneTreeNumber == parseFloat(geneTreeNumber)) {
		GENE_TREE_COLOURS[parseFloat(geneTreeNumber)] = colour;
	}
	
	else if (geneTreeNumber == "speciesBorder") SPECIES_TREE_BORDER_COL = colour;
	else if (geneTreeNumber == "speciesBG") SPECIES_TREE_BG_COL = colour;
	else if (geneTreeNumber == "speciesTreeAnnotationMinCol") {
		CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMin = colour;
		$("#colourboxSpeciesMin").css("background-color", CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMin);
		updateSpeciesAnnotationPalette();
	}
	else if (geneTreeNumber == "speciesTreeAnnotationMaxCol") {
		CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMax = colour;
		$("#colourboxSpeciesMax").css("background-color", CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMax);
		updateSpeciesAnnotationPalette();
	}
	
	else if (geneTreeNumber.includes("speciesAnnotationDiscreteRow_")) {
		var value = geneTreeNumber.split("_")[1];
		if (value != null) {
			CURRENTLY_SELECTED_SPECIES_ANNOTATION.discreteCols[value] = colour;
			$("#colourboxDiscrete_" + value).css("background-color", colour);
		}
	}
	
	 
	
	
	$("#colourbox" + geneTreeNumber).css("background-color", colour);
	setVisualParams();
}

// Functions for converting rgb to hex
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
	

	if (rgb.substring(0, 3) != "rgb") return rgb;
	
	
	var bits = rgb.substring(4).split(",");
	var r = parseFloat(bits[0]);
	var g = parseFloat(bits[1]);
	var b = parseFloat(bits[2]);
	
	console.log(rgb, r, g, b);

	if (r == 0 && g == 0 && b == 0) return "TRANSPARENT";
	
	return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}



// Populate the annotation lists (but do not replace if the elements already exist)
function renderAnnotations(newAnnotations = []) {
	
	
	for (var i = 0; i < newAnnotations.length; i ++){
		
		var nameNew = newAnnotations[i].name;
		var isNew = true;
		for (var j = 0; j < TREE_ANNOTATIONS.length; j ++){
			var nameOld = TREE_ANNOTATIONS[j].name;
			if (nameNew == nameOld){
				isNew = false;
				break;
			}
		}
		
		if (isNew) TREE_ANNOTATIONS.push(newAnnotations[i]);

	}


	
	
	var gene_dropdown_elements = $(".geneAnnotationsDropdown");
	var all_dropdown_elements = $(".geneAnnotationsDropdown,.speciesAnnotationsDropdown");
	for (var i = 0; i < TREE_ANNOTATIONS.length; i ++){
		
		var annotation = TREE_ANNOTATIONS[i];
		var name = annotation.name;

		// Gene annotations for gene tree nodes only, while species annotations can be displayed on either tree
		var elements = annotation.speciesTree ? all_dropdown_elements : gene_dropdown_elements;
		
			
		for (var j = 0; j < elements.length; j ++){
			
			var ele = $(elements[j]);
			var compatible = !ele.hasClass("numericalOnly")	|| annotation.format == "numerical";


			if (compatible && ele.children(`[value="` + name + `"]`).length == 0) { 
				if (name != "Label") ele.append(`<option value="` + name + `">` + name + `</option>`);
			}else if (!compatible && ele.children(`[value="` + name + `"]`).length == 1){
				ele.children(`[value="` + name + `"]`).remove();
			}

		}

	}



	if (FIRST_ANNOTATION_PASS){
		FIRST_ANNOTATION_PASS = false;

		// Attempt to set species branch width to population size
		var patterns = ["pop", "dmv"];
		for (var i = 0; i < TREE_ANNOTATIONS.length; i ++){

			for (var j = 0; j < patterns.length; j ++){
				if (TREE_ANNOTATIONS[i].name.includes(patterns[j])) {
					SPECIES_WIDTH_ANNOTATION = TREE_ANNOTATIONS[i].name;
					$("#SPECIES_WIDTH_ANNOTATION").val(SPECIES_WIDTH_ANNOTATION);
					break;
				}


			}

		}
		
	}


	
	
}




// Updates the species annotation palette
function updateSpeciesAnnotationPalette(){
	
	if (CURRENTLY_SELECTED_SPECIES_ANNOTATION == null || CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMin == null) return;
	
	
	$("#speciesTreeAnnotationColGradient").html("");
	CURRENTLY_SELECTED_SPECIES_ANNOTATION.ncols = parseFloat($("#speciesAnnotationNumCols").val());
	if (CURRENTLY_SELECTED_SPECIES_ANNOTATION.ncols == null) CURRENTLY_SELECTED_SPECIES_ANNOTATION.ncols = 8;
	
	// Use the chroma.js library to create a colour palette
	var colours = chroma.scale([CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMin, 
								CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMax]).mode('lch').colors(CURRENTLY_SELECTED_SPECIES_ANNOTATION.ncols)
	
	// Colour gradient
	for (var c = 0; c < colours.length; c++){
		$("#speciesTreeAnnotationColGradient").append(`<td style="background-color:` + colours[c] + `"> </td>`);
	}
		
	
}



// Returns annotation object by name
function getAnnotation(name){
	
	if (name == "_none") return {};
	for (var i = 0; i < TREE_ANNOTATIONS.length; i ++){
		var annotation = TREE_ANNOTATIONS[i];
		if (annotation.name == name) {
			return annotation;
		}
	}
	return {};
	
}



// Open settings for the selected species tree annotation
function selectSpeciesAnnotationSettings() {
	
	var a = $("#MODEL_ANNOTATIONS_SPECIES").val();
	if (a == "_none") {
		CURRENTLY_SELECTED_SPECIES_ANNOTATION = {};
		$(".showOnSpeciesAnnotationSelect").hide(0);
		return;
	}
	
	
	// Get the respective annotation object
	var annotation = getAnnotation(a);
	
	if (annotation == null)  {
		CURRENTLY_SELECTED_SPECIES_ANNOTATION = {};
		$(".showOnSpeciesAnnotationSelect").hide(0);
		return;
	}
	

	$(".showOnSpeciesAnnotationSelect").show(300);
	CURRENTLY_SELECTED_SPECIES_ANNOTATION = annotation;
	var missingValues = !annotation.complete;
	if (missingValues) $("#speciesAnnotationsMissingDataWarning").show(300);
	else $("#speciesAnnotationsMissingDataWarning").hide(0);
	
	var discrete = annotation.format == "nominal";

	// Annotation is discrete
	if (discrete){

		$("#speciesAnnotationDiscreteChk").prop("checked", true);
		if (annotation.mustBeNumerical) return;
		else if (annotation.mustBeNominal) $("#speciesAnnotationDiscreteSpan").addClass("disabled");
		else $("#speciesAnnotationDiscreteSpan").removeClass("disabled");


		
		$(".speciesAnnotationNumerical").hide(0);
		$(".speciesAnnotationDiscrete").show(300);
		$("#speciesAnnotationDiscreteTable").html("");
		
		// Render all nominal values
		for (var val in annotation.discreteCols){
			var col = rgbToHex(annotation.discreteCols[val]);
			var html = `<tr id="speciesAnnotationDiscreteRow_` + val + `" class="sideNavSetting">
							<td style="width:2em">
							</td>
						
							<td>
								<span id="colourboxDiscrete_` + val + `" class="colourbox" title="Select colour" onclick='openColourPicker("speciesAnnotationDiscreteRow_` + val + `");' style="background-color:` + col + `"></span>
							</td>
							
							<td>` + val + `</td>
						</tr>`;
				
				
			$("#speciesAnnotationDiscreteTable").append(html);
			
			
			
		}
		
		
	}
	
	// Annotation is numeric
	else{

		$("#speciesAnnotationDiscreteChk").prop("checked", false);
		if (annotation.mustBeNominal) return;
		else if (annotation.mustBeNumerical) $("#speciesAnnotationDiscreteSpan").addClass("disabled");
		else $("#speciesAnnotationDiscreteSpan").removeClass("disabled");


		$("#colourboxSpeciesMin").css("background-color", annotation.gradientMin);
		$("#colourboxSpeciesMax").css("background-color", annotation.gradientMax);
		$("#speciesAnnotationNumCols").val(annotation.ncols);
		
		
		updateSpeciesAnnotationPalette();

		$(".speciesAnnotationNumerical").show(300);
		$(".speciesAnnotationDiscrete").hide(0);
		
		
	}
	
	
	
	setVisualParams();
	
	
	
}


// Toggle the current annotation between numerical and discrete
function setAnnotationDataType(){
	
	var switchTo = $("#speciesAnnotationDiscreteChk").is(":checked") ? "nominal" : "numerical";

	if (CURRENTLY_SELECTED_SPECIES_ANNOTATION != null) {

		if (switchTo == "nominal" && CURRENTLY_SELECTED_SPECIES_ANNOTATION.mustBeNumerical) {
			$("#speciesAnnotationDiscreteChk").prop("checked", false);
			return;
		}

		if (switchTo == "numerical" && CURRENTLY_SELECTED_SPECIES_ANNOTATION.mustBeNominal) {
			$("#speciesAnnotationDiscreteChk").prop("checked", true);
			return;
		}



		CURRENTLY_SELECTED_SPECIES_ANNOTATION.format = switchTo;
	}

	renderAnnotations();
	selectSpeciesAnnotationSettings();


}



// Swaps the children in a subtree
function flipSubtree(node){
	

	var temp = node.children[0];
	node.children[0] = node.children[1];
	node.children[1] = temp;
	//console.log("Flipped", node);
	planTrees();
	renderTrees(null, true);

}














