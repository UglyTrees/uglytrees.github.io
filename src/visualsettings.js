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
						"#4e8791", "#ff1919", "#228B22", "#91584e", "#584e91", "#009fe1", "#ffff1a", "#ff8d1a",
						"#000000", "#606060", "#707070", "#A0A0A0", "#BEBEBE", "#d3d3d3", "#E0E0E0", "#FFFFFF"];
	GENE_TREE_COLOURS = [];
	setInitialGeneTreeColours();
	GENE_TREE_DISPLAYS = {};
	
	SPECIES_TREE_BG_COL = "transparent";
	SPECIES_TREE_BORDER_COL = "#000000";
	$("#colourboxspeciesBG").css("background-color", SPECIES_TREE_BG_COL);
	$("#colourboxspeciesBorder").css("background-color", SPECIES_TREE_BORDER_COL);
	
	
	SUBTREE_SPACER = 0.2
	GENE_NODE_SIZE = 4;
	GENE_BRANCH_WIDTH = 1;
	SPECIES_BRANCH_WIDTH = 1;
	

	$("#SUBTREE_SPACER").val(SUBTREE_SPACER);
	$("#GENE_NODE_SIZE").val(GENE_NODE_SIZE);
	$("#GENE_BRANCH_WIDTH").val(GENE_BRANCH_WIDTH);
	$("#SPECIES_BRANCH_WIDTH").val(SPECIES_BRANCH_WIDTH);
	
	
	
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
	

	if (id == null) {
		$(".sidenav").width(0);
		$(".sidenav").attr("opened", "no");
		$("#innerBody").css("marginLeft", 0);
		//$("#footer").width(parseFloat($("#innerBody").width()) * 0.99);
		
		$("#tree").html("");
		setTimeout(function(){
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
		setTimeout(function(){
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
	
	
	
	for (var g = 0; g < GENE_TREES_ALL.length; g ++){
		GENE_TREE_DISPLAYS[g] = $("#selectGeneTree" + g).is(":checked");
	}
	
	

	renderParameterValues();
	renderTrees();
	
	
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

	
	if ($("#colourpickerrow" + geneTreeNum).length > 0) {
		$("#colourpickerrow" + geneTreeNum).hide(300, function(){
			$(this).remove();
		});
		return;
	}
		
	var colourPickHtml = `
		<tr id="colourpickerrow` + geneTreeNum + `" style="display:none" class="colourpickerrow">
			<td colspan=3>
				<ul class="flex-container thicklines" style="font-size:100%;">`;			
				
	
	var colMatch = false;
	for (var colNum = 0; colNum < DEFAULT_COLOURS.length; colNum++){
		var col = DEFAULT_COLOURS[colNum].toUpperCase();
		//console.log("col", col, currentCol);
		
		var addClass = "";
		if (col == currentCol){
			addClass = "selected";
			colMatch = true;
		}
		
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

	
	$("#visualSettingsRow" + geneTreeNum).after(colourPickHtml);
	
	// If the current colour is not in the grid, then put it in text box
	if (!colMatch){
		$("#geneColHexCode" + geneTreeNum).val(currentCol);
	}
	
	$("#colourpickerrow" + geneTreeNum).show(300);
	
	
}


function selectColour(col_ele, geneTreeNum){
	
	var col;
	if ($(col_ele).hasClass("colourbox")){
		col = $(col_ele).css("background-color");
	}else{
		col = $(col_ele).val();
	}
	
	
	
	setGeneTreeColours(geneTreeNum, col);
	
	$("#colourpickerrow" + geneTreeNum).hide(300, function(){
		$(this).remove();
	});
	

}




// Get the colour of a gene tree
function getGeneTreeColour(geneTreeNumber){

	if (geneTreeNumber == "speciesBorder") return rgbToHex(SPECIES_TREE_BORDER_COL);
	else if (geneTreeNumber == "speciesBG") return rgbToHex(SPECIES_TREE_BG_COL);
	
	var index = geneTreeNumber % GENE_TREE_COLOURS.length;
	return rgbToHex(GENE_TREE_COLOURS[index]);

}


// Set the colour a gene tree
function setGeneTreeColours(geneTreeNumber, colour){
	
	if (geneTreeNumber == "speciesBorder") SPECIES_TREE_BORDER_COL = colour;
	else if (geneTreeNumber == "speciesBG") SPECIES_TREE_BG_COL = colour;
	else GENE_TREE_COLOURS[parseFloat(geneTreeNumber)] = colour;
	
	
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
	
	return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}








