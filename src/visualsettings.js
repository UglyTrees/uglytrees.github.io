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


function initVisualSettings(){
	SIDENAV_WIDTH = 300;
	GENE_TREE_COLOURS = ["#50b2db",  "#50db79", "#db506d", "#7950DB", "#b2db50", "#db7950"];
	

	SUBTREE_SPACER = 0.2
	GENE_NODE_SIZE = 4;
	

	$("#SUBTREE_SPACER").val(SUBTREE_SPACER);
	$("#GENE_NODE_SIZE").val(GENE_NODE_SIZE);
	
	
	
	renderParameterValues();
	
}


function openNav(id) {
	
	

	if (parseFloat($("#" + id).width()) > 0){
		closeNav();
		return true;
	}
	
	
	
	$("#" + id).width(SIDENAV_WIDTH + "px");
	$("#" + id).attr("opened", "yes");
	$("#innerBody").css("marginLeft", SIDENAV_WIDTH + "px");
	return false;

}


function closeNav(id = null) {
	

	if (id == null) {
		$(".sidenav").width(0);
		$(".sidenav").attr("opened", "no");
		$("#innerBody").css("marginLeft", 0);
		
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



function closeAllNavsExcept(id) {
	

	var sideNavEles = $(".sideNav");
	for (var i = 0; i < sideNavEles.length; i ++){
		var eleID = $(sideNavEles[i]).attr("id");
		if (eleID != id) closeNav(eleID);
	}

	
};



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




function getGeneTreeColour(geneTreeNumber){

	var index = geneTreeNumber % GENE_TREE_COLOURS.length;
	return GENE_TREE_COLOURS[index];

}



// Load in all visual parameters from sidenav menus and redraw the tree
function setVisualParams(){
	
	SUBTREE_SPACER = parseFloat($("#SUBTREE_SPACER").val());
	SUBTREE_SPACER = Math.max(SUBTREE_SPACER, 0);
	
	GENE_NODE_SIZE = parseFloat($("#GENE_NODE_SIZE").val());
	GENE_NODE_SIZE = Math.max(GENE_NODE_SIZE, 0);
	
	

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
	
	$("#geneTreeColours").html("");
	for (var i = 0; i < GENE_TREES_ALL.length; i ++){
	
		var html = `
		<div class="sideNavSetting">
			<span class="colourbox" onchange="setVisualParams();" style="background-color:` + getGeneTreeColour(i) + `"></span>
			` + GENE_TREES_ALL[i].name + `
		</div>`;
		$("#geneTreeColours").append(html);
		
		
	
	}
	
	
}





