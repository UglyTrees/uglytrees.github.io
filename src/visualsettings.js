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


	IS_MOBILE = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		   			 || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));


	SIDENAV_WIDTH = 300;
	
	
	DEFAULT_COLOURS = [	"#50b2db",  "#50db79", "#db506d", "#7950DB", "#b2db50", "#db7950", 
				"#4e8791", "#ff1919", "#228B22", "#91584e", "#584e91", "#009fe1", "#ffff1a", "#ff8d1a", "#DB5079",
				"#000000", "#606060", "#707070", "#A0A0A0", "#BEBEBE", "#d3d3d3", "#E0E0E0", "#FFFFFF"];
	GENE_TREE_COLOURS = [];
	setInitialGeneTreeColours();


	// Only 1 of the below two display settings used at a time
	ONLY_ONE_GENE_TREE = false;
	CURRENT_GENE_TREE_DISPLAY = 0;
	GENE_TREE_DISPLAYS = {};


	START_PLAYING = false;
	
	DONT_HOVER = false;
	TREE_ANNOTATIONS = [];
	CURRENTLY_SELECTED_SPECIES_ANNOTATION = {};
	SPECIES_BRANCH_BGCOL_ANNOTATION = "_none";
	SPECIES_BRANCH_BORDER_ANNOTATION = "_none";
	SPECIES_BRANCH_MULTIPLIER = "_none";
	SPECIES_WIDTH_ANNOTATION_TOP = "_none";
	SPECIES_WIDTH_ANNOTATION_BOTTOM = "_none";
	GENE_BRANCH_MULTIPLIER = "_none";
	GENE_NODE_MULTIPLIER = "_none";
	GENE_BRANCH_BGCOL_ANNOTATION = "_none";
	SPECIES_TIP_LABEL = "Label";
	SPECIES_INTERNAL_LABEL = "_none";
	GENE_TIP_LABEL = "_none";

	

	SPECIES_TREE_BG_COL = "#FFFFFF";
	SPECIES_TREE_BORDER_COL = "#000000";
	$("#colourboxspeciesBG").css("background-color", SPECIES_TREE_BG_COL);
	$("#colourboxspeciesBorder").css("background-color", SPECIES_TREE_BORDER_COL);

	
	EASYPZ = null;

	ZOOM_SCALE = 1;
	SPECIES_LABEL_FONT_SIZE = !IS_MOBILE ? 17 : 20;
	GENE_LABEL_FONT_SIZE = !IS_MOBILE ? 11 : 14;
	SUBTREE_SPACER = 0.2
	GENE_NODE_SIZE = 4;
	GENE_NODE_OUTLINE = 1;
	GENE_ROOT_SIZE = 4;
	GENE_BRANCH_WIDTH = 1;
	SPECIES_BRANCH_WIDTH = 1;
	SPECIES_TREE_OPACITY = 100;
	GENE_TREE_OPACITY = 100;
	GROUP_GENES_BY_TAXA = false;
	LABEL_ROUNDING_SF = 2;


	LATIN_BINOMIAL_SPECIES_TREE = false;
	LATIN_BINOMIAL_GENE_TREE = false;

	
	
	FADE_TIME = 500;
	ANIMATION_TIME = 500; // Remember to also update CSS sheet: path { transition: fill 0.5s ease;}
	PLAY_TIME = 1200;

	CURRENT_ANIMATION_TIME = ANIMATION_TIME;
	CURRENT_FADE_TIME = FADE_TIME;
	ZOOM_ON_FONT = false;
	SHOW_X_AXIS = false;
	SHOW_Y_AXIS = true;
	X_RANGE = "treemax";
	Y_RANGE = "treemax";


	FIRST_ANNOTATION_PASS = true;


	setInterfaceFromVisualParams();
	


	initialiseZoom();
	resetAnnotations();


}


function setInterfaceFromVisualParams(){


	$("#MODEL_ANNOTATIONS_SPECIES").val("_none");
	$("#SPECIES_TREE_OPACITY").val(SPECIES_TREE_OPACITY);
	$("#GENE_TREE_OPACITY").val(GENE_TREE_OPACITY);

	$("#SUBTREE_SPACER").val(SUBTREE_SPACER);
	$("#GENE_NODE_SIZE").val(GENE_NODE_SIZE);
	$("#GENE_NODE_OUTLINE").val(GENE_NODE_OUTLINE);
	$("#GENE_ROOT_SIZE").val(GENE_ROOT_SIZE)
	$("#GENE_BRANCH_WIDTH").val(GENE_BRANCH_WIDTH);
	$("#SPECIES_BRANCH_WIDTH").val(SPECIES_BRANCH_WIDTH);
	$("#GROUP_GENES_BY_TAXA").prop("checked", GROUP_GENES_BY_TAXA);
	$("#SPECIES_BRANCH_MULTIPLIER").val(SPECIES_BRANCH_MULTIPLIER);
	$("#GENE_BRANCH_MULTIPLIER").val(GENE_BRANCH_MULTIPLIER);
	$("#GENE_BRANCH_BGCOL_ANNOTATION").val(GENE_BRANCH_BGCOL_ANNOTATION);
	$("#GENE_NODE_MULTIPLIER").val(GENE_NODE_MULTIPLIER);
	$("#SPECIES_WIDTH_ANNOTATION_TOP").val(SPECIES_WIDTH_ANNOTATION_TOP);
	$("#SPECIES_WIDTH_ANNOTATION_BOTTOM").val(SPECIES_WIDTH_ANNOTATION_BOTTOM);
	$("#SPECIES_TIP_LABEL").val(SPECIES_TIP_LABEL);
	$("#SPECIES_INTERNAL_LABEL").val(SPECIES_INTERNAL_LABEL);
	$("#GENE_TIP_LABEL").val(GENE_TIP_LABEL);
	


	$("#LATIN_BINOMIAL_SPECIES_TREE").prop("checked", LATIN_BINOMIAL_SPECIES_TREE);
	$("#LATIN_BINOMIAL_GENE_TREE").prop("checked", LATIN_BINOMIAL_GENE_TREE);


	$("#ZOOM_ON_FONT").prop("checked", ZOOM_ON_FONT);

	$("#SPECIES_BRANCH_BGCOL_ANNOTATION").val(SPECIES_BRANCH_BGCOL_ANNOTATION);
	$("#SPECIES_BRANCH_BORDER_ANNOTATION").val(SPECIES_BRANCH_BORDER_ANNOTATION);
	$("#SPECIES_LABEL_FONT_SIZE").val(SPECIES_LABEL_FONT_SIZE);
	$("#GENE_LABEL_FONT_SIZE").val(GENE_LABEL_FONT_SIZE);

	
	$("#LABEL_ROUNDING_SF").val(LABEL_ROUNDING_SF);
	
	
	$("#SHOW_X_AXIS").prop("checked", SHOW_X_AXIS);
	$("#SHOW_Y_AXIS").prop("checked", SHOW_Y_AXIS);

	$('[name="X_RANGE"][value="' + X_RANGE + '"]').prop("checked", true);
	if (X_RANGE != "input") $("#X_RANGE_INPUT").prop("disabled", true);	
	else $("#X_RANGE_INPUT").prop("disabled", false);

	$('[name="Y_RANGE"][value="' + Y_RANGE + '"]').prop("checked", true);
	if (Y_RANGE != "input") $("#Y_RANGE_INPUT").prop("disabled", true);
	else $("#Y_RANGE_INPUT").prop("disabled", false);

	if (parseFloat($("#Y_RANGE_INPUT").val()) <= 0)  $("#Y_RANGE_INPUT").val(0.01);
	if (parseFloat($("#X_RANGE_INPUT").val()) <= 0)  $("#X_RANGE_INPUT").val(0.01);


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
	
	unhover();
	if (id == null) {
		$(".sidenav").width(0);
		$(".sidenav").attr("opened", "no");
		$("#innerBody").css("marginLeft", 0);
		//$("#footer").width(parseFloat($("#innerBody").width()) * 0.99);
		
		$("#tree").html("");
		stop();
		setTimeout(function(){

			resetZoom();
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
		unhover();
		stop();
		setTimeout(function(){
			resetZoom();
			planTrees();
			renderTrees();
		}, 500);
	}

}




// Load in all visual parameters from sidenav menus and redraw the tree
function setVisualParams(){

	stop();
	
	SUBTREE_SPACER = parseFloat($("#SUBTREE_SPACER").val());
	SUBTREE_SPACER = Math.max(SUBTREE_SPACER, 0);
	
	GENE_NODE_SIZE = parseFloat($("#GENE_NODE_SIZE").val());
	GENE_NODE_SIZE = Math.max(GENE_NODE_SIZE, 0);

	GENE_NODE_OUTLINE = parseFloat($("#GENE_NODE_OUTLINE").val());
	GENE_NODE_OUTLINE = Math.max(GENE_NODE_OUTLINE, 0);



	GENE_ROOT_SIZE = parseFloat($("#GENE_ROOT_SIZE").val());
	GENE_ROOT_SIZE = Math.max(GENE_ROOT_SIZE, 0);
	
	
	GENE_BRANCH_WIDTH = parseFloat($("#GENE_BRANCH_WIDTH").val());
	GENE_BRANCH_WIDTH = Math.max(GENE_BRANCH_WIDTH, 0);
	
	SPECIES_BRANCH_WIDTH = parseFloat($("#SPECIES_BRANCH_WIDTH").val());
	SPECIES_BRANCH_WIDTH = Math.max(SPECIES_BRANCH_WIDTH, 0);	
	
	SPECIES_TREE_OPACITY = parseFloat($("#SPECIES_TREE_OPACITY").val());
	SPECIES_TREE_OPACITY = Math.min(Math.max(SPECIES_TREE_OPACITY, 0), 100);

	GENE_TREE_OPACITY = parseFloat($("#GENE_TREE_OPACITY").val());
	GENE_TREE_OPACITY = Math.min(Math.max(GENE_TREE_OPACITY, 0), 100);


	SPECIES_LABEL_FONT_SIZE = $("#SPECIES_LABEL_FONT_SIZE").val();	
	SPECIES_LABEL_FONT_SIZE = Math.max(SPECIES_LABEL_FONT_SIZE, 0);

	GENE_LABEL_FONT_SIZE = $("#GENE_LABEL_FONT_SIZE").val();	
	GENE_LABEL_FONT_SIZE = Math.max(GENE_LABEL_FONT_SIZE, 0);
	
	
	LABEL_ROUNDING_SF = Math.round(parseFloat($("#LABEL_ROUNDING_SF").val()));
	if (LABEL_ROUNDING_SF < 1) LABEL_ROUNDING_SF = 1;

	
	GROUP_GENES_BY_TAXA = $("#GROUP_GENES_BY_TAXA").is(":checked");
	SPECIES_BRANCH_MULTIPLIER = $("#SPECIES_BRANCH_MULTIPLIER").val();
	GENE_BRANCH_MULTIPLIER = $("#GENE_BRANCH_MULTIPLIER").val();
	GENE_BRANCH_BGCOL_ANNOTATION = $("#GENE_BRANCH_BGCOL_ANNOTATION").val();
	GENE_NODE_MULTIPLIER = $("#GENE_NODE_MULTIPLIER").val();
	SPECIES_BRANCH_BGCOL_ANNOTATION = $("#SPECIES_BRANCH_BGCOL_ANNOTATION").val();
	SPECIES_BRANCH_BORDER_ANNOTATION = $("#SPECIES_BRANCH_BORDER_ANNOTATION").val();
	SPECIES_TIP_LABEL = $("#SPECIES_TIP_LABEL").val();
	SPECIES_INTERNAL_LABEL = $("#SPECIES_INTERNAL_LABEL").val();
	GENE_TIP_LABEL = $("#GENE_TIP_LABEL").val();



	LATIN_BINOMIAL_SPECIES_TREE = $("#LATIN_BINOMIAL_SPECIES_TREE").is(":checked");
	LATIN_BINOMIAL_GENE_TREE = $("#LATIN_BINOMIAL_GENE_TREE").is(":checked");

	

	SPECIES_WIDTH_ANNOTATION_TOP = $("#SPECIES_WIDTH_ANNOTATION_TOP").val();
	SPECIES_WIDTH_ANNOTATION_BOTTOM = $("#SPECIES_WIDTH_ANNOTATION_BOTTOM").val();
	
	ZOOM_ON_FONT = $("#ZOOM_ON_FONT").is(":checked");
	SHOW_X_AXIS = $("#SHOW_X_AXIS").is(":checked");
	SHOW_Y_AXIS = $("#SHOW_Y_AXIS").is(":checked");
	

	if (ONLY_ONE_GENE_TREE){

		for (var g = 0; g < GENE_TREES_ALL.length; g ++){
			var toRender = toRenderGeneTree(g);
			GENE_TREE_DISPLAYS[g] = toRender;
			if (toRender) $("#selectGeneTree" + g).prop('checked', true);
			else $("#selectGeneTree" + g).prop('checked', false);
		}

	}

	else {
		for (var g = 0; g < GENE_TREES_ALL.length; g ++){
			if (GENE_TREES_ALL[g] == null) continue;
			GENE_TREE_DISPLAYS[g] = $("#selectGeneTree" + g).is(":checked");
		}
	}


	if (parseFloat($("#Y_RANGE_INPUT").val()) <= 0)  $("#Y_RANGE_INPUT").val(0.01);
	if (parseFloat($("#X_RANGE_INPUT").val()) <= 0)  $("#X_RANGE_INPUT").val(0.01);

	// Axis maxes
	X_RANGE = $('[name="X_RANGE"]:checked').val();
	if (X_RANGE != "input") $("#X_RANGE_INPUT").prop("disabled", true);	
	else $("#X_RANGE_INPUT").prop("disabled", false);

	Y_RANGE = $('[name="Y_RANGE"]:checked').val();
	if (Y_RANGE != "input") $("#Y_RANGE_INPUT").prop("disabled", true);
	else $("#Y_RANGE_INPUT").prop("disabled", false)




	
	
	//if (SPECIES_TREE_BG_COL.toLowerCase() == "TRANSPARENT") $("#speciesOpacityDiv").hide(300);
	//else $("#speciesOpacityDiv").show(300);

	renderParameterValues();
	var animate = resetZoom();
	planTrees();
	renderTrees(null, animate);
	
	
	console.log("CURRENTLY_SELECTED_SPECIES_ANNOTATION", CURRENTLY_SELECTED_SPECIES_ANNOTATION);
	
	
}




// Print the value of each parameter below its html input
function renderParameterValues(){
		
	var settingEles = $(".sideNavSetting");
	for (var i = 0; i < settingEles.length; i ++){
		var ele = $(settingEles[i]);
		var child = ele.children("input");
		//console.log(child.val());
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
			
			<td colspan=2>
				<div class="bigSessionWarning" style="display:none; font-size:80%">Display fewer trees to improve performance</div>
			</td>
		</tr>`;
	$("#geneTreeColours").html(headerHTML);
	
	

	
	for (var i = 0; i < GENE_TREES_ALL.length; i ++){
		if (GENE_TREES_ALL[i] == null) continue;
		var html = `
		<tr id="visualSettingsRow` + i + `" class="sideNavSetting">
			<td>
				<label title="Toggle gene tree display" class="checkbox-container small">
					<input class="genetreecheckbox" onchange="useGeneTreeList(); setVisualParams();" id="selectGeneTree` + i + `" type="checkbox" checked="checked">
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

		$("#selectGeneTree" + i).prop("checked", GENE_TREE_DISPLAYS[i]);
		
		
	
	}
	
	
}



// Togge to using all of the gene trees specified instead of just the one down the bottom of the screen
function useGeneTreeList() {
	ONLY_ONE_GENE_TREE = false;
	$("#currentGeneTreeNameContainer").hide(300);
	setVisualParams();
}

// Togge to using just the one gene tree at the bottom of the screen instead of what the list says
function useJustOneGeneTree() {
	ONLY_ONE_GENE_TREE = true;
	$(".genetreecheckbox").prop('checked', false);
	$("#currentGeneTreeNameContainer").show(0);
	console.log(GENE_UPLOADED_FILES, CURRENT_GENE_TREE_DISPLAY, GENE_UPLOADED_FILES[CURRENT_GENE_TREE_DISPLAY])
	$("#currentGeneTreeName").html(GENE_UPLOADED_FILES[CURRENT_GENE_TREE_DISPLAY].filename);
	setVisualParams();
}



// Returns true or false to determine whether or not this gene tree should be rendered
function toRenderGeneTree(g) {

	if (ONLY_ONE_GENE_TREE){
		return g == CURRENT_GENE_TREE_DISPLAY;
	}else{
		return GENE_TREE_DISPLAYS[g] == null || GENE_TREE_DISPLAYS[g] == true;
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

	useGeneTreeList();
	
}


// Open the colour picker container under a gene tree setting
function openColourPicker(geneTreeNum, annot = null){
	if (annot == "null") annot = null;

	var currentCol = getGeneTreeColour(geneTreeNum, annot).toUpperCase();
	console.log("currentCol", currentCol);

	
	if ($(`.colourpickerrow[g="` + (annot == null ? geneTreeNum : annot) + `"]`).length > 0) {
		$(`.colourpickerrow[g="` + (annot == null ? geneTreeNum : annot) + `"]`).hide(300, function(){
			$(this).remove();
		});
		return;
	}
		
	var colourPickHtml = `
		<tr g="` + (annot == null ? geneTreeNum : annot) + `" style="display:none" class="colourpickerrow">
			<td colspan=3>
				<ul class="flex-container thicklines" style="font-size:100%;">`;			
				
	
	var colMatch = false;
	for (var colNum = 0; colNum < DEFAULT_COLOURS.length; colNum++){
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
					<span class="colourbox ` + addClass + `" title="` + col + `" onclick="selectColour(this, '` + geneTreeNum + `', '` + annot + `');" style="background-color:` + col + `"></span>
				</li>`;
		
	}		
	
	// Custom hex codes
	colourPickHtml += `
				<li class="flex-item" style="margin-left:10px" title="Enter hex code">
					Hex code: <input id="geneColHexCode` + geneTreeNum + `" class="numberinput" onchange="selectColour(this, '` + geneTreeNum + `', '` + annot + ` ');" style="width:6em" value="#">
				</li>`;
	
	colourPickHtml += `</ul></td></tr>`;


	console.log("XXX", geneTreeNum, annot, colourPickHtml)

	
	if (geneTreeNum == parseFloat(geneTreeNum)) {
		$("#visualSettingsRow" + geneTreeNum).after(colourPickHtml);
	}
	else if (annot == null){
		$("#" + geneTreeNum).after(colourPickHtml);
	}
	else {
		//console.log(geneTreeNum, $("#" + geneTreeNum));
		//$("#" + geneTreeNum).after(colourPickHtml);
		$(`.colourboxDiscrete[annotation="` + annot + `"]`).after(colourPickHtml);
	}
	
	// If the current colour is not in the grid, then put it in text box
	if (!colMatch){
		$("#geneColHexCode" + geneTreeNum).val(currentCol);
	}
	
	$(`.colourpickerrow[g="` + (annot == null ? geneTreeNum : annot) + `"]`).show(300);
	
	
}


function selectColour(col_ele, geneTreeNum, annot = null){
	
	
	if (annot == "null") annot = null;
	
	var col;
	if ($(col_ele).hasClass("colourbox")){
		col = $(col_ele).attr("title");
	}else{
		col = $(col_ele).val();
	}
	
	
	
	setGeneTreeColours(geneTreeNum, annot, col);
	
	
	
	$(`.colourpickerrow[g="` + (annot == null ? geneTreeNum : annot) + `"]`).hide(300, function(){
		$(this).remove();
	});
	

}


function getDefaultColour(index){
	
	var index2 = index % DEFAULT_COLOURS.length;
	return rgbToHex(DEFAULT_COLOURS[index2]);
	
}



// Get the colour of a gene tree
function getGeneTreeColour(geneTreeNumber, annot = null){
	
	if (geneTreeNumber == parseFloat(geneTreeNumber)) {
		var index = geneTreeNumber % GENE_TREE_COLOURS.length;
		
		return rgbToHex(GENE_TREE_COLOURS[index]);
	}

	if (geneTreeNumber == "speciesBorder") return rgbToHex(SPECIES_TREE_BORDER_COL);
	else if (geneTreeNumber == "speciesBG") return rgbToHex(SPECIES_TREE_BG_COL);
	else if (geneTreeNumber == "speciesTreeAnnotationMinCol") return rgbToHex(CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMin);
	else if (geneTreeNumber == "speciesTreeAnnotationMaxCol") return rgbToHex(CURRENTLY_SELECTED_SPECIES_ANNOTATION.gradientMax);
	else if (geneTreeNumber == "speciesAnnotationDiscreteRow") {
		return rgbToHex(CURRENTLY_SELECTED_SPECIES_ANNOTATION.discreteCols[annot]);
	}

	return null;

}


// Set the colour a gene tree
function setGeneTreeColours(geneTreeNumber, annot, colour, updateAfter = true){
	
	
	
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
	
	else if (geneTreeNumber == "speciesAnnotationDiscreteRow") {
		
		if (annot != null) {
			CURRENTLY_SELECTED_SPECIES_ANNOTATION.discreteCols[annot] = colour;
			$(`.colourboxDiscrete[annotation="` + annot + `"]`).css("background-color", colour);
		}
	}
	
	$("#colourbox" + geneTreeNumber).css("background-color", colour);
	if (updateAfter) setVisualParams();

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



// Reset the list of annotations
function resetAnnotations() {

	var all_dropdown_elements = $(".geneAnnotationsDropdown,.speciesAnnotationsDropdown");
	all_dropdown_elements.html("");
	all_dropdown_elements.append(`<option value="_none">Select annotation...</option>`);
	$(".dropdownWithLabel").append(`<option value="Label">Label</option>`);


	$("#SPECIES_TIP_LABEL").val("Label");	

}

// Populate the annotation lists (but do not replace if the elements already exist)
function renderAnnotations(newAnnotations = []) {
	
	var newVals = false
	var oldAnnotation = null;
	for (var i = 0; i < newAnnotations.length; i ++){
		var newAnnotation = newAnnotations[i];
		var isNew = true;
		for (var j = 0; j < TREE_ANNOTATIONS.length; j ++){
			oldAnnotation = TREE_ANNOTATIONS[j];
			if (newAnnotation.name == oldAnnotation.name){
				isNew = false;
				oldAnnotation.complete = newAnnotation.complete;
				//oldAnnotation.format = newAnnotation.format;
				oldAnnotation.mustBeNumerical = newAnnotation.mustBeNumerical;
				oldAnnotation.mustBeNominal = newAnnotation.mustBeNominal;
				for (var ele in newAnnotation.discreteCols){
					if (oldAnnotation.discreteCols[ele] == null) {
						newVals = true;
						oldAnnotation.discreteCols[ele] = "black";
					}
				}
				break;
			}
		}
		
		if (isNew) TREE_ANNOTATIONS.push(newAnnotations[i]);


		// Update colours
		if (newVals) {
			var colNum = 0;
			for (var value in newAnnotation.discreteCols){
				var col = getDefaultColour(colNum);
				oldAnnotation.discreteCols[value] = col;
				colNum++;
			}
		}

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
		var patternsTop = ["pop", "dmv[1]"];
		for (var i = 0; i < TREE_ANNOTATIONS.length; i ++){

			for (var j = 0; j < patternsTop.length; j ++){
				if (TREE_ANNOTATIONS[i].name.includes(patternsTop[j])) {
					SPECIES_WIDTH_ANNOTATION_TOP = TREE_ANNOTATIONS[i].name;
					$("#SPECIES_WIDTH_ANNOTATION_TOP").val(SPECIES_WIDTH_ANNOTATION_TOP);
					break;
				}


			}

		}

		var patternsBottom = ["pop", "dmv[0]"];
		for (var i = 0; i < TREE_ANNOTATIONS.length; i ++){

			for (var j = 0; j < patternsBottom.length; j ++){
				if (TREE_ANNOTATIONS[i].name.includes(patternsBottom[j])) {
					SPECIES_WIDTH_ANNOTATION_BOTTOM = TREE_ANNOTATIONS[i].name;
					$("#SPECIES_WIDTH_ANNOTATION_BOTTOM").val(SPECIES_WIDTH_ANNOTATION_BOTTOM);
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


		annotation.legend.showLegend = false;
		$(".speciesAnnotationNumerical").hide(0);
		$(".speciesAnnotationDiscrete").show(300);
		$("#speciesAnnotationDiscreteTable").html("");
		
		// Render all nominal values
		for (var val in annotation.discreteCols){
			var col = rgbToHex(annotation.discreteCols[val]);
			var html = `<tr annotation="` + val + `" class="speciesAnnotationDiscreteRow sideNavSetting">
							<td style="width:2em">
							</td>
						
							<td>
								<span annotation="` + val + `" class="colourboxDiscrete colourbox" title="Select colour" onclick='openColourPicker("speciesAnnotationDiscreteRow", "` + val + `");' style="background-color:` + col + `"></span>
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

		$("#showLegendBtn").prop("checked", annotation.legend.showLegend);


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
	var animate = resetZoom();
	planTrees();
	renderTrees(null, animate);

}


function resetZoom(){
	if (ZOOM_SCALE != 1){
		ZOOM_SCALE = 1;
		EASYPZ.reset();
		return false;
	}
	return true;		

}



function initialiseZoom(){

	var svg = $("#tree");
	svg.find("g").attr("transform", "scale(1,1)");


	EASYPZ = new EasyPZ(document.getElementById("tree"), function(transform) {

		if (START_PLAYING) {
			EASYPZ.reset();
			return;
		}

		//console.log(transform);	

		
		unhover();
		ZOOM_SCALE = transform.scale;

		// Zoom in on labels?
		if (!ZOOM_ON_FONT){ 
			$(".speciesText.labelText").css("font-size", SPECIES_LABEL_FONT_SIZE / ZOOM_SCALE);
			$(".geneText.labelText").css("font-size", GENE_LABEL_FONT_SIZE / ZOOM_SCALE);
		} else {
			$(".speciesText.labelText").css("font-size", SPECIES_LABEL_FONT_SIZE);
			$(".geneText.labelText").css("font-size", GENE_LABEL_FONT_SIZE);
		}



		if (ZOOM_SCALE != 1) svg.addClass("candrag");
		else svg.removeClass("candrag");


		// Zoom in on species nodes
		var speciesnodes = svg.find(".specieshoverbranch");
		for (var i = 0; i < speciesnodes.length; i ++) {
			var element = $(speciesnodes[i]);
			var baseWidth = parseFloat(element.attr("w0"));
			element.css("stroke-width", baseWidth / ZOOM_SCALE + "px");

		}

		// Zoom in on gene branches
		var geneBranches = svg.find(".genebranch");
		for (var i = 0; i < geneBranches.length; i ++) {
			var element = $(geneBranches[i]);
			var baseWidth = parseFloat(element.attr("w0"));
			element.css("stroke-width", baseWidth / ZOOM_SCALE + "px");

		}

		// Zoom in on gene nodes
		var geneNodes = svg.find(".genenode");
		for (var i = 0; i < geneNodes.length; i ++) {
			var element = $(geneNodes[i]);
			var baseRadius = parseFloat(element.attr("r0"));
			element.attr("r", baseRadius / ZOOM_SCALE + "px");
		}



		// Hack: avoid svg blurring by clicking on an svg element 
		setTimeout(function() {
			DONT_HOVER = true;
			$(svg.find("polygon")[0]).click();
			DONT_HOVER = false;
		}, 50);


	}, { "minScale": 1, "maxScale": 100, "bounds": { "top": 0, "right": 0, "bottom": 0, "left": 0 }},
		["SIMPLE_PAN", "HOLD_ZOOM_IN", "CLICK_HOLD_ZOOM_OUT", "WHEEL_ZOOM", "PINCH_ZOOM"],
		function() {}, function() {}, function() {}, function() {}, ".svgG");



}




// Hide or show the legend for the currently selected numerical annotation
function toggleLegend(){
	CURRENTLY_SELECTED_SPECIES_ANNOTATION.legend.showLegend = !CURRENTLY_SELECTED_SPECIES_ANNOTATION.legend.showLegend;
	setVisualParams();
}




// Calculates and stores the current min and max for all numerical annotations, with respect to the currently displayed trees
function getAnnotationMinAndMax(trees){


	for (var treeAnnotNum = 0; treeAnnotNum < TREE_ANNOTATIONS.length; treeAnnotNum ++){

		var annotation = TREE_ANNOTATIONS[treeAnnotNum];
		if (!annotation.format == "numerical") continue;



		// Get min and max value
		var min = Infinity;
		var max = -Infinity;

		for (var t = 0; t < trees.length; t++){

			var tree = trees[t];
			for (var i = 0; i < tree.nodeList.length; i ++){
				
				var value = tree.nodeList[i].annotation[annotation.name];

				// Missing data
				if (isNaN(value) || value == null) continue;
				min = Math.min(min, value);
				max = Math.max(max, value);
				
			}

		}


		annotation.minVal = min;
		annotation.maxVal = max;


	}
		

}

















