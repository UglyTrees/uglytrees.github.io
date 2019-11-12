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










// Stores the coordinates (in case of rejection)
function storeTree(node){
	
	if (node.children.length == 2){
		storeTree(node.children[0]);
		storeTree(node.children[1]);
	}
	
	node.coordsStored = JSON.parse(JSON.stringify(node.coords));
	node.heightStored = node.height;
	node.rateStored = node.rate;
	node.populationsizeStored = node.populationsize;
	
	
}


// Restores the coordinates (in case of rejection)
function restoreTree(node){
	
	if (node.children.length == 2){
		restoreTree(node.children[0]);
		restoreTree(node.children[1]);
	}
	
	node.coords = JSON.parse(JSON.stringify(node.coordsStored));
	node.height = node.heightStored;
	node.rate = node.rateStored;
	node.populationsize = node.populationsizeStored;
}


// Stores the proposed coordinates (in case of user reverting animation)
function storeProposedTree(node){
	
	if (node.children.length == 2){
		storeProposedTree(node.children[0]);
		storeProposedTree(node.children[1]);
	}
	
	node.coordsProposed = JSON.parse(JSON.stringify(node.coords));
	node.heightProposed = node.height;
	node.rateProposed = node.rate;
	node.populationsizeProposed = node.populationsize;		
}



// Restores the coordinates (in case of user reverting animation)
function restoreProposedTree(node){
	
	if (node.children.length == 2){
		restoreProposedTree(node.children[0]);
		restoreProposedTree(node.children[1]);
	}
	
	node.coords = JSON.parse(JSON.stringify(node.coordsProposed));
	node.height = node.heightProposed;
	node.rate = node.rateProposed;
	node.populationsize = node.populationsizeProposed;
	
}




// Move the whole tree by (dx,dy)
function translateTree(node, dx, dy, anchorTop = false) {
	
	
	if (node.children.length == 2){
		translateTree(node.children[0], dx, dy);
		translateTree(node.children[1], dx, dy);
	}
	
	node.coords.bottomRight.x += dx;
	node.coords.bottomLeft.x += dx;
	node.coords.bottomRight.y += dy;
	node.coords.bottomLeft.y += dy;
	node.coords.xrange.left += dx;
	node.coords.xrange.right += dx;
	
	if (!anchorTop) {
		node.coords.topRight.x += dx;
		node.coords.topLeft.x += dx;
		node.coords.topRight.y += dy;
		node.coords.topLeft.y += dy;
	}
	
	if (node.coords.dashed != null){
		node.coords.dashed.left += dx;
		node.coords.dashed.right += dx;
	}

	
}


// Scales from the current (c) into the target (t) interval
function scaleTreeRanges(tree, t_minX, t_minY, t_maxX, t_maxY) {
	
	var node = tree.root;
	storeTree(node)
	
	var c_minX = node.coords.xrange.left;
	var c_minY = 0;
	var c_maxX = node.coords.xrange.right;
	var c_maxY = node.coords.topLeft.y;
	
	var scaleX = function(x, relative = false) {
		//console.log("scaleX", x, c_minX, c_maxX, t_maxX, t_minX, (x - c_minX) / (c_maxX - c_minX) * (t_maxX - t_minX) + t_minX);
		return (x - c_minX) / (c_maxX - c_minX) * (t_maxX - t_minX) + (relative ? 0 : t_minX);
	}
	
	var scaleY = function(y, relative = false) {
		//console.log("scaleY", y, c_minY, c_maxY, t_maxY, t_minY);
		return (y - c_minY) / (c_maxY - c_minY) * (t_maxY - t_minY) + (relative ? 0 : t_minY);
	}
	
	tree.scaleX_fn = scaleX;
	tree.scaleY_fn = scaleY;
	
	//scaleTreeMultiplier(node, scaleX, scaleY);
	
}

// Returns a function for calculating the line width of a branch
function planLineWidths(tree, annotation_name, baseLineWidth, isGeneTree = false, isRadius = false){
	
	var linewidth_fn;
	
	if (annotation_name == "_none") linewidth_fn = function(node) { return baseLineWidth + "px"; };
	
	else {
		

		// If this is a gene tree and the annotation is for a species tree, then the value corresponds to the species node this gene node is mapped to
		var annotation = getAnnotation(annotation_name);
		var annotationBelongsToSpeciesNode = isGeneTree && annotation.speciesTree;

		// Normalise values into range [1, 4]
		linewidth_fn = function(node, speciesNodeMappedTo = null) {

			if (baseLineWidth == 0) return 0 + "px";

			var val = !annotationBelongsToSpeciesNode ? parseFloat(node.annotation[annotation_name]) : parseFloat(speciesNodeMappedTo.annotation[annotation_name]);

			//if (isGeneTree) console.log(annotationBelongsToSpeciesNode, node, speciesNodeMappedTo, val, max, min, baseLineWidth);

			//console.log("val", val);
			
			// Missing value
			if (isNaN(val) || val == null) return baseLineWidth + "px";
			
			val = 1 + (isRadius ? 1.5 : 3) * (val - annotation.minVal)/(annotation.maxVal - annotation.minVal) ;
			return val * baseLineWidth + "px";
		};
		
	}
	
	return linewidth_fn;
	
}

// Returns a function to compute a colour from an annotation
function planColour(tree, annotation_name, backgroundCol, isGeneTree = false){
	
	var colour_fn;
	if (annotation_name == "_none") colour_fn = function(node) { return rgbToHex(backgroundCol); };
	
	else {
		
		
		// Get annotation from name
		var annotation = getAnnotation(annotation_name);

		// If this is a gene tree and the annotation is for a species tree, then the value corresponds to the species node this gene node is mapped to
		var annotationBelongsToSpeciesNode = annotation_name != "Label" && isGeneTree && annotation.speciesTree;
		
		var discrete = annotation.format == "nominal";
		
		// Discrete parameter
		if (discrete){
			
			colour_fn = function(node, speciesNodeMappedTo = null) {
				
				var val = annotation_name == "Label" ?  node.label : 
									!annotationBelongsToSpeciesNode ? node.annotation[annotation_name] : 
									speciesNodeMappedTo.annotation[annotation_name];
				
				// Missing data
				if (val == null || annotation.discreteCols[val] == null) return rgbToHex(backgroundCol); 
				
				return rgbToHex(annotation.discreteCols[val]);
				
				
			}
			
		}
		
		// Numerical
		else{
			

			if (isGeneTree) console.log("annotation", annotation, tree);
					

			
			// Get colour list
			var ncols = annotation.ncols;
			var colours = chroma.scale([annotation.gradientMin, annotation.gradientMax]).mode('lch').colors(ncols);
								
			colour_fn = function(node, speciesNodeMappedTo = null) {
				
				var val = !annotationBelongsToSpeciesNode ? parseFloat(node.annotation[annotation_name]) : parseFloat(speciesNodeMappedTo.annotation[annotation_name]);
				
				
				// Missing data
				if (isNaN(val) || val == null) return rgbToHex(backgroundCol); 
				
				val = (val - annotation.minVal)/(annotation.maxVal - annotation.minVal);
				var col_index = Math.floor(val * (ncols-1));
				//console.log(val, col_index, ncols, colours[col_index]);
				return colours[col_index];
				
				
			}
			
			
			
		}

		
	}
	
	return colour_fn;
	
}



// Iterates through a tree and gets the maximum size of a label, given the font 
function getMaximumLabelTextSizeOfTree(node, fontSize){

	
	if (node.children.length == 0){
		return getSizeOfText(node.label, fontSize);
	}

	var maxTextSize = getSizeOfText(node.label, fontSize);
	maxTextSize = Math.max(maxTextSize,  getMaximumLabelTextSizeOfTree(node.children[0], fontSize));
	maxTextSize = Math.max(maxTextSize,  getMaximumLabelTextSizeOfTree(node.children[1], fontSize));
	return maxTextSize;



}


function getSizeOfText(text, fontSize){

	if (text == "" || text == null) return 0;

	$("#measureText").html(text);
	$("#measureText").css("font-size", fontSize);
	var width = parseFloat($("#measureText").width());
	//console.log(text, width);
	return width;

}




// Generates the initial coordinated, later to be linearly transformed onto the svg
function planSpeciesTree(node, maxTreeHeight) {



	// Leaf node. Draw branch and return x,y values of parent node
	if (node.children.length == 0){

		var cx = 0;
		var cy = 0;
		var N = node.populationsize;
		var parentcy = node.parent.height;

		node.coords = { bottomLeft: {x: cx - 0.5*N, y: cy}, bottomRight: {x: cx + 0.5*N, y: cy}, topLeft: {x: cx - 0.5*N, y: parentcy}, topRight: {x: cx + 0.5*N, y: parentcy},
					    dashed: null, xrange: {left: cx - 0.5*N, right: cx + 0.5*N} };



		return;

	}


	// Get initial coordinates of children
	var left = node.children[0];
	var right = node.children[1];
	planSpeciesTree(left, maxTreeHeight);
	planSpeciesTree(right, maxTreeHeight);


	// Position this node centered between the left child's right and the right child's left
	var cy = node.height;
	var cx = (left.coords.bottomRight.x + right.coords.bottomLeft.x) / 2;
	var parentcy = node.parent == null ? maxTreeHeight : node.parent.height;
	var N = node.populationsize;
	
	
	// Update the top x coordinates of children
	left.coords.topRight.x = cx;
	left.coords.topLeft.x = cx - left.populationsize;
	right.coords.topLeft.x = cx;
	right.coords.topRight.x = cx + right.populationsize;
	
	
	// Translate the child subtrees so that the shortest horizontal distance between the two is GAP_BETWEEN_SUBTREES
	//translateTree(left,  0.5*GAP_BETWEEN_SUBTREES + left.coords.xrange.right - cx, 0, true);
	//translateTree(right, 0.5*GAP_BETWEEN_SUBTREES - right.coords.xrange.left + cx, 0, true);
	
	
	translateTree(left,  cx - 0.5*GAP_BETWEEN_SUBTREES - left.coords.xrange.right, 0, true);
	translateTree(right, cx + 0.5*GAP_BETWEEN_SUBTREES - right.coords.xrange.left, 0, true);
	
	//translateTree(left,  -10, 0, true);
	//translateTree(right, +10, 0, true);
	
	node.coords = { bottomLeft: {x: cx - 0.5*N, y: cy}, bottomRight: {x: cx + 0.5*N, y: cy}, topLeft: {x: cx - 0.5*N, y: parentcy}, topRight: {x: cx + 0.5*N, y: parentcy}, 
					dashed: {left: cx - Math.max(left.populationsize, 0.5*N), right: cx + Math.max(right.populationsize, 0.5*N)} };
	node.coords.xrange = {left: Math.min(left.coords.xrange.left, node.coords.dashed.left), right: Math.max(right.coords.xrange.right, node.coords.dashed.right)};

	

	// If root then shift everything so that the leftmost position is at x=0
	if (node.parent == null){
		//console.log("Translating" node, "by",  -left.coords.xrange.left);
		translateTree(node, -left.coords.xrange.left, 0);
		
	}
	

}



// Draws a pre-scaled species tree onto the svg
function drawASpeciesTree(svg, textGroup, tree, treename, node, styles = {fontSize: SPECIES_LABEL_FONT_SIZE,  opacity: SPECIES_TREE_OPACITY}) {

	
	var strokeWidth = tree.linewidth_fn(node); //styles.lineWidthMultiplier * Math.max(Math.min(roundToSF(node.rate), 3), 0.2);
	var fill = tree.bgcolour_fn(node);
	var stroke = tree.bordercolour_fn(node);
	var id = treename + "_" + node.id;
	node.htmlID = id;
	
	
	//console.log("node", node);




	if (node.label != null) {


		// Label
		var labelX = tree.scaleX_fn((node.coords.bottomRight.x + node.coords.bottomLeft.x) / 2);
		var labelY = tree.scaleY_fn(node.coords.bottomRight.y) + 5;
		drawSVGobj(textGroup, "text", {class: "labelText", id: id + "_L", 
					x: labelX, 
					y: labelY, 
					transform: "rotate(90, " + labelX + ", " + labelY + ")",
					style: "text-anchor:left; dominant-baseline:central; font-family:Source Sans Pro; font-size:" + styles.fontSize}, node.label);

	}
	
	// text-anchor:end; 

	// Leaf node. Draw branch and return x,y values of parent node
	if (node.children.length == 0){


				
		// Polygon
		var points = [	tree.scaleX_fn(node.coords.bottomLeft.x), tree.scaleY_fn(node.coords.bottomLeft.y),
						tree.scaleX_fn(node.coords.bottomRight.x), tree.scaleY_fn(node.coords.bottomLeft.y),
						tree.scaleX_fn(node.coords.topRight.x), tree.scaleY_fn(node.coords.topRight.y),
						tree.scaleX_fn(node.coords.topLeft.x), tree.scaleY_fn(node.coords.topRight.y)];
						
		drawSVGobj(svg, "polygon", {class: "specieshoverbranch", id: id + "_P", 
										points: points.join(" "), 
										fill: fill,
										style: "opacity: " + styles.opacity / 100 + ";stroke-linejoin:round; stroke:" + stroke + "; stroke-width:" + strokeWidth + "px"}, "", true);		
		

		
		return;

	}




	// Internal/root node. Draw children first
	drawASpeciesTree(svg, textGroup, tree, treename, node.children[0], styles);
	drawASpeciesTree(svg, textGroup, tree, treename, node.children[1], styles);
	


	
	
	// Polygon
	var points = [	tree.scaleX_fn(node.coords.bottomLeft.x), tree.scaleY_fn(node.coords.bottomLeft.y),
					tree.scaleX_fn(node.coords.bottomRight.x), tree.scaleY_fn(node.coords.bottomLeft.y),
					tree.scaleX_fn(node.coords.topRight.x), tree.scaleY_fn(node.coords.topRight.y),
					tree.scaleX_fn(node.coords.topLeft.x), tree.scaleY_fn(node.coords.topRight.y)];
					
	drawSVGobj(svg, "polygon", {class: "specieshoverbranch", id: id + "_P", 
									points: points.join(" "), 
									fill: fill,
									style: "opacity: " + styles.opacity / 100 + "; stroke-linejoin:round; stroke:" + stroke + "; stroke-width:" + strokeWidth}, "", true);		




}





// Animates a pre-rendered species tree
function animateASpeciesTree(speciesGroup, textGroup, tree, treename, node, animation_time = 1000, styles = {fontSize: SPECIES_LABEL_FONT_SIZE,  opacity: SPECIES_TREE_OPACITY}) {


	var id = treename + "_" + node.id;
	node.htmlID = id;

	animateSpeciesBranch(speciesGroup, tree, node, "P", styles, animation_time);
	animateSpeciesBranch(textGroup, tree, node, "L", styles, animation_time);
	

	
	
	// Animate children
	for (var c = 0; c < node.children.length; c++){
		animateASpeciesTree(speciesGroup, textGroup, tree, treename, node.children[c], animation_time, styles);
	}

	
}



// Animate a pre-rendered species tree branch
function animateSpeciesBranch(svg, tree, node, branchLetter = "B", styles, duration = 1000) {



	var ele = svg.find("#" + node.htmlID + "_" + branchLetter);
	
	if (ele.length == 0) return;
	

	// Move branch parallelogram
	if (branchLetter == "P"){

		//var strokeWidth = styles.lineWidthMultiplier * Math.max(Math.min(roundToSF(node.rate), 3), 0.2);
		var strokeWidth = tree.linewidth_fn(node);
		var fill = tree.bgcolour_fn(node);
		var stroke = tree.bordercolour_fn(node);
		//console.log(node.htmlID, node.rate, strokeWidth);
		
		var points = [			tree.scaleX_fn(node.coords.bottomLeft.x), tree.scaleY_fn(node.coords.bottomLeft.y),
						tree.scaleX_fn(node.coords.bottomRight.x), tree.scaleY_fn(node.coords.bottomLeft.y),
						tree.scaleX_fn(node.coords.topRight.x), tree.scaleY_fn(node.coords.topRight.y),
						tree.scaleX_fn(node.coords.topLeft.x), tree.scaleY_fn(node.coords.topRight.y)];
		
		
		//console.log("fill", fill, node, node.annotation.pop);
		
		
		ele.velocity("finish");
		
		if (parseFloat(ele.css("stroke-width")) == strokeWidth) ele.velocity( {points: points.join(" ")}, duration );
		else ele.velocity( {points: points.join(" "), strokeWidth: strokeWidth}, duration );
		
		//ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, stroke: stroke, strokeWidth: strokeWidth + "px" }, duration );
		//ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, strokeWidth: strokeWidth + "px"}, duration );
		ele.css("stroke", stroke);
		ele.css("fill", fill);
		ele.css("opacity", styles.opacity / 100);


	}

	// Move label
	else if(branchLetter == "L"){
		

		var labelX = tree.scaleX_fn((node.coords.bottomRight.x + node.coords.bottomLeft.x) / 2);
		var labelY = tree.scaleY_fn(node.coords.bottomRight.y) + 5;

		//ele.attr("transform", "rotate(90, " + labelX + ", " + labelY + ")");

		ele.velocity( {x: labelX, y: labelY, transform: "rotate(90, " + labelX + ", " + labelY + ")"}, duration );
		ele.css("font-size", styles.fontSize);

		
	}
	


}








function proposeMoveSpeciesTreeNode(node, alpha){
	
	var dy = alpha; 
	
	
	
	// Stores the changes in the event of the proposal being rejected
	storeTree(node);
	
	node.coords.bottomRight.y += dy;
	node.coords.bottomLeft.y += dy;
	
	node.children[0].coords.topLeft.y += dy;
	node.children[0].coords.topRight.y += dy;
	
	node.children[1].coords.topLeft.y += dy;
	node.children[1].coords.topRight.y += dy;
	
	node.height += alpha;
	
	
	// Stores the changes in the event of the user pressing UNDO to watch the asnimation again
	storeProposedTree(node);
	
	//console.log(node.height, alpha, node.height + alpha, node.parent.height, node.children[0].height, node.children[1].height);

	if (node.height >= node.parent.height || node.height <= node.children[0].height || node.height <= node.children[1].height) return false;
	

	return true
						
	
	
}











// Maps the two together
function buildGeneTreeSpeciesTreeMap(geneTreeNum, node) {

	// Leaf node. Draw branch and return x,y values of parent node
	if (node.children.length == 0){
		return;
	}


	


	// Get initial coordinates of children
	var left = node.children[0];
	var right = node.children[1];
	buildGeneTreeSpeciesTreeMap(geneTreeNum, left);
	buildGeneTreeSpeciesTreeMap(geneTreeNum, right);
	
	
	
	
	
								// SPECIES_LEAVES[i].branchToGeneNodeMap[g][leaves[j].id] = leaves[j];
								// SPECIES_LEAVES[i].nodeToGeneBranchMap[g][leaves[j].id] = leaves[j];
	
	
	
	// Map this internal/root node to a species tree node. 
	// Do this by iterating back up the species tree starting from the species node of a child
	var speciesNodeMappedTo = left.speciesNodeMap;
	while(speciesNodeMappedTo.height < node.height) {
		if (speciesNodeMappedTo.parent == null) break;
		
		if (speciesNodeMappedTo.parent.height > node.height) break;
		
		
		speciesNodeMappedTo = speciesNodeMappedTo.parent;
		//console.log(geneTreeNum, "speciesNodeMappedTo", speciesNodeMappedTo);
		if (true || left.speciesNodeMap.id != node.speciesNodeMap.id) speciesNodeMappedTo.nodeToGeneBranchMap[geneTreeNum][left.id] = left;
	}
	
	// Repeat for other child to build nodeToGeneBranchMap
	speciesNodeMappedTo = right.speciesNodeMap;
	while(speciesNodeMappedTo.height < node.height) {
		if (speciesNodeMappedTo.parent == null) break;
		
		if (speciesNodeMappedTo.parent.height > node.height) break;
		
		
		speciesNodeMappedTo = speciesNodeMappedTo.parent;
		if (true || right.speciesNodeMap.id != node.speciesNodeMap.id) speciesNodeMappedTo.nodeToGeneBranchMap[geneTreeNum][right.id] = right;
	}
	
	
	//console.log("Mapping", node.id, "to", speciesNodeMappedTo.id);
	
	node.speciesNodeMap = speciesNodeMappedTo;
	//speciesNodeMappedTo.nodeToGeneBranchMap[geneTreeNum][node.id] = node;
	speciesNodeMappedTo.branchToGeneNodeMap[geneTreeNum][node.id] = node;

}



function getPositionInMap(map, id){
	
	var n = 0;
	for (var m in map) n++;

	var i = 0;
	for (var m in map){
		if (m == id) break;
		i++;
	}
	
	return {n: n, index: i};
	
}


// Generate unscaled coordinates for a gene tree
function planGeneTree(geneTreeNum, node, geneTree, groupByTaxa = false) {
	


	// Leaf node. Draw branch and return x,y values of parent node
	if (node.children.length == 0){


		// Get species tree node this leaf is mapped to
		var speciesNode = node.speciesNodeMap;
		
		// Get number of gene nodes mapped to this same species node 
		var mappedPos = getPositionInMap(speciesNode.nodeToGeneBranchMap[geneTreeNum], node.id);
		if (mappedPos.index == mappedPos.n) alert("1. i = n");
		
		
		var speciesRate = node.speciesNodeMap.rate;
		var strokeWidth = roundToSF(0.5*speciesRate);

		var widthScale = (speciesNode.coords.bottomRight.x - speciesNode.coords.bottomLeft.x);

		// Group by taxa vs group by gene tree
		if (groupByTaxa) widthScale /= mappedPos.n;
		else widthScale /= geneTree.offsetTotal;
			
		var xIndex = 0;
		if (groupByTaxa) xIndex = mappedPos.index + (geneTree.offsetIndex+1)/(geneTree.offsetTotal+1);
		else xIndex = (mappedPos.index+1)/(mappedPos.n+1) + geneTree.offsetIndex;
		
		
		var cx = xIndex * widthScale + speciesNode.coords.bottomLeft.x;
		var cy = 0;
		
		//console.log("Mapped", node.id, "to", mappedPos, widthScale, (mappedPos.index + 0.5) * widthScale);

		node.coords = { cx: cx, cy: cy, x: [cx], y: [cy], strokeWidths: [] };

		return;

	}


	// Get initial coordinates of children
	var left = node.children[0];
	var right = node.children[1];
	planGeneTree(geneTreeNum, left, geneTree, groupByTaxa);
	planGeneTree(geneTreeNum, right, geneTree, groupByTaxa);
	
	
	// Get species tree node this node is mapped to
	var speciesNode = node.speciesNodeMap;
	

	
	
	// If this is on a species tree branch above left child, then draw lines coming out of left child
	// These subbranches are called segments
	
	var leftAndRight = [left, right];
	for (var x = 0; x < 2; x ++ ){
	
		var childNode = leftAndRight[x];
		
		if (childNode.speciesNodeMap.id != speciesNode.id){
			
			
			var isActuallyLeft = childNode.speciesNodeMap.coords.xrange.left < childNode.speciesNodeMap.parent.coords.bottomLeft.x + childNode.speciesNodeMap.parent.populationsize*0.5;
			var leftMappedToSpeciesNode = childNode.speciesNodeMap.parent;
			//console.log(node.id, "Above", childNode.id, childNode.speciesNodeMap.id, leftMappedToSpeciesNode.nodeToGeneBranchMap);
			
			
			while(leftMappedToSpeciesNode.nodeToGeneBranchMap[geneTreeNum][childNode.id] != null){
				
				//console.log(node.id, "Above2", childNode.id, leftMappedToSpeciesNode.id);
				
				
				// Map this branch segement to a position on the bottom of the current species tree node
				var mappedPos = getPositionInMap(leftMappedToSpeciesNode.nodeToGeneBranchMap[geneTreeNum], childNode.id); // nodeToGeneBranchMap branchToGeneNodeMap
				if (mappedPos.index == mappedPos.n) alert("2. i = n");
			
			
				var startX, endX;
				
				// Left
				if (isActuallyLeft){
					startX = Math.max(leftMappedToSpeciesNode.coords.bottomLeft.x, leftMappedToSpeciesNode.children[0].coords.topLeft.x);
					endX  = leftMappedToSpeciesNode.coords.bottomLeft.x + 0.5*leftMappedToSpeciesNode.populationsize;
				} 
				
				// Right
				else{
					endX = Math.min(leftMappedToSpeciesNode.coords.bottomRight.x, leftMappedToSpeciesNode.children[1].coords.topRight.x);
					startX  = leftMappedToSpeciesNode.coords.bottomLeft.x + 0.5*leftMappedToSpeciesNode.populationsize;
				}

				
				// Group by taxa vs group by gene tree
				var widthScale = (endX - startX) / mappedPos.n;
				if (groupByTaxa) widthScale /= mappedPos.n;
				else widthScale /= geneTree.offsetTotal;
					
				var xIndex = 0;
				if (groupByTaxa) xIndex = mappedPos.index + (geneTree.offsetIndex+1)/(geneTree.offsetTotal+1);
				else xIndex = (mappedPos.index+1)/(mappedPos.n+1) + geneTree.offsetIndex;

				
				
				var segmentX = xIndex * widthScale + startX;
				var segmentY = leftMappedToSpeciesNode.coords.bottomLeft.y;
				
				childNode.coords.x.push(segmentX);
				childNode.coords.y.push(segmentY);
				childNode.coords.strokeWidths.push(1); 
				
				if (leftMappedToSpeciesNode.parent == null) break;
				
				isActuallyLeft = leftMappedToSpeciesNode.coords.xrange.left < leftMappedToSpeciesNode.parent.coords.bottomLeft.x + leftMappedToSpeciesNode.parent.populationsize*0.5;
				leftMappedToSpeciesNode = leftMappedToSpeciesNode.parent;
			}
			
			
			
		}
	
	}
	
	var leftX = left.coords.x[left.coords.x.length - 1];
	var leftY = left.coords.y[left.coords.y.length - 1];
	var rightX = right.coords.x[right.coords.x.length - 1];
	var rightY = right.coords.y[right.coords.y.length - 1];
	
	
	var gradient = (speciesNode.coords.topLeft.y - speciesNode.coords.bottomLeft.y) / (speciesNode.coords.topLeft.x - speciesNode.coords.bottomLeft.x);
	
	
	var leftX_intersectSpeciesNode = -(leftY - speciesNode.coords.bottomLeft.y) / gradient + leftX; // (leftX - speciesNode.coords.bottomLeft.x);
	var rightX_intersectSpeciesNode = -(rightY - speciesNode.coords.bottomLeft.y) / gradient + rightX; // (rightX - speciesNode.coords.bottomLeft.x);
	
	
	// Add the final x,y coordinate at this node
	var thisY = node.height;
	var thisX = (thisY - speciesNode.coords.bottomLeft.y) / gradient + (leftX_intersectSpeciesNode + rightX_intersectSpeciesNode) / 2; // - speciesNode.coords.bottomLeft.x; 
	
	/// (leftX + rightX) / 2 * 
	
	//console.log(thisX, thisY, gradient, speciesNode.coords.bottomLeft.y);
	
	node.coords = { cx: thisX, cy: thisY, x: [thisX], y: [thisY], strokeWidths: [1] };
	left.coords.x.push(thisX);
	left.coords.y.push(thisY);
	left.coords.strokeWidths.push(1);
	right.coords.x.push(thisX);
	right.coords.y.push(thisY);
	right.coords.strokeWidths.push(1);
	
	
	//console.log(node.id, left.coords);
	

}








// Draws a gene tree onto the svg
function drawAGeneTree(svg, geneTree, treename, node, speciesTree, geneTreeNum, styles = {}) {
	
	
	
	var id = treename + "_" + node.id;
	node.htmlID = id;


	// Leaf node. Draw circle and branch(es) to its parent node
	if (node.children.length == 2){


		//console.log("Drawing", node.coords, speciesTree.scaleX_fn(node.coords.cx));

		// Internal/root node. Draw children first
		drawAGeneTree(svg, geneTree, treename, node.children[0], speciesTree, geneTreeNum, styles)
		drawAGeneTree(svg, geneTree, treename, node.children[1], speciesTree, geneTreeNum, styles)

	}



	// Branch(es) to parent
	var mappedToSpeciesNode = node.speciesNodeMap;
	for (var i = 0; i < node.coords.x.length-1; i ++){
		
		var x1 = node.coords.x[i];
		var x2 = node.coords.x[i+1];
		var y1 = node.coords.y[i];
		var y2 = node.coords.y[i+1];
		
		var strokeWidth = geneTree.linewidth_fn(node, mappedToSpeciesNode);
		var col = geneTree.bgcolour_fn(node, mappedToSpeciesNode);
		
		drawSVGobj(svg, "line", {class: "genebranch", id: id + "_B" + i, 
									x1: speciesTree.scaleX_fn(x1), 
									y1: speciesTree.scaleY_fn(y1), 
									x2: speciesTree.scaleX_fn(x2),
									y2: speciesTree.scaleY_fn(y2), 
									gNum: geneTreeNum,
									branchfornode: id,
									style: "stroke:" + col + "; stroke-width:" + strokeWidth});
		
			
		mappedToSpeciesNode = mappedToSpeciesNode.parent;	
	}
	
	
	
	// The circle
	drawSVGobj(svg, "circle", {class: "genenode", id: id, 
								cx: speciesTree.scaleX_fn(node.coords.cx), 
								cy: speciesTree.scaleY_fn(node.coords.cy), 
								r: geneTree.noderadius_fn(node, node.speciesNodeMap),
								gNum: geneTreeNum,
								name: (node.children.length == 0 ? node.id + "," + node.label : node.id),
								fill: geneTree.bgcolour_fn(node, node.speciesNodeMap)}, "", true);



	
	


}



// Animates a pre-rendered gene tree
function animateAGeneTree(svg, geneTree, treename, node, speciesTree, geneTreeNum, animation_time = 1000) {


	var id = treename + "_" + node.id;
	node.htmlID = id;
	

	
	
	// Branch(es) to parent
	var mappedToSpeciesNode = node.speciesNodeMap;
	for (var i = 0; i < node.coords.x.length-1; i ++){
		

		var strokeWidth = geneTree.linewidth_fn(node, mappedToSpeciesNode);
		var col = geneTree.bgcolour_fn(node, mappedToSpeciesNode);

		animateGeneBranch(svg, i, speciesTree, node, geneTreeNum, col, strokeWidth, animation_time);
		
		
			
		mappedToSpeciesNode = mappedToSpeciesNode.parent;	
	}
	
	
	// If there are any further branch lines for this node then delete them
	var branchNumToDelete = node.coords.x.length-1;
	var branchToDelete = svg.find("#" + node.htmlID + "_B" + branchNumToDelete);
	while (branchToDelete.length > 0){
		branchToDelete.remove();
		branchNumToDelete++;
		branchToDelete = svg.find("#" + node.htmlID + "_B" + branchNumToDelete);
	}
	
	
	var radius = geneTree.noderadius_fn(node, node.speciesNodeMap);
	var col = geneTree.bgcolour_fn(node, node.speciesNodeMap);
	animateGeneBranch(svg, -1, speciesTree, node, geneTreeNum, col, radius, animation_time);
	
	
	// Animate children
	for (var c = 0; c < node.children.length; c++){
		animateAGeneTree(svg, geneTree, treename, node.children[c], speciesTree, geneTreeNum, animation_time);
	}

	
}





function animateGeneBranch(svg, branchNumber, speciestree, node, gNum, col, size, duration = 1000) {



	
	// Move the node
	if (branchNumber == -1){
		
		var ele = svg.find("#" + node.htmlID);
		

		var cx = speciestree.scaleX_fn(node.coords.cx);
		var cy = speciestree.scaleY_fn(node.coords.cy);
		var r = size;
		var fill = col;
		
		// Draw it from scratch if it does not already exist
		if (ele.length == 0) {
			
				drawSVGobj(svg, "circle", {class: "genenode", id: node.htmlID, 
								cx: cx, 
								cy: cy, 
								r: r,
								gNum: gNum,
								name: (node.children.length == 0 ? node.id + "," + node.label : node.id),
								fill: fill}, "", true);

		} 
		
		// Animate it
		else {
			ele.velocity("finish");
			ele.velocity( {cx: cx, cy: cy, r: r}, duration);
			ele.css("fill", fill);
			
		}
		
				

		
	
		
	}
	
	
	// Move a branch
	else {
	
		
		var ele = svg.find("#" + node.htmlID + "_B" + branchNumber)
		var x1 = speciestree.scaleX_fn(node.coords.x[branchNumber]);
		var x2 = speciestree.scaleX_fn(node.coords.x[branchNumber + 1]);
		var y1 = speciestree.scaleY_fn(node.coords.y[branchNumber]);
		var y2 = speciestree.scaleY_fn(node.coords.y[branchNumber + 1]);
		var stroke = col;
		var strokeWidth = size;

		// Draw it from scratch if it does not already exist
		if (ele.length == 0) {
			
			drawSVGobj(svg, "line", {class: "genebranch", id: node.htmlID + "_B" + branchNumber, 
				x1: x1, 
				y1: y1, 
				x2: x2,
				y2: y2, 
				gNum: gNum,
				branchfornode: node.htmlID,
				style: "stroke:" + stroke + "; stroke-width:" + strokeWidth});
			
		}

		// Animate it
		else {
			
			ele.velocity("finish");
			//ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, strokeWidth: strokeWidth + "px", stroke: stroke}, duration );



			if (parseFloat(ele.css("stroke-width")) == strokeWidth) ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2}, duration );
			else ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, strokeWidth: strokeWidth}, duration );
			
			ele.css("stroke", stroke);

		}

	
	}


}















// Plan axes
function planAxis(label, min, max, minAtZero = min == 0, zeroLabel = true, niceBinSizes = [1, 2, 5]){

	if (min > max) max = min+1;

	var maxNumLabels = 8;
	var nLabels = maxNumLabels;

	var niceBinSizeID = niceBinSizes.length - 1;
	var basePower = Math.floor(log(max, base = 10));
	
	var binSize = niceBinSizes[niceBinSizeID] * Math.pow(10, basePower);


	if (minAtZero) min = 0;

	var numLoops = 0;	
	if (min != max) {
		while(true){


			if (numLoops > 50 || (max - min) / binSize - nLabels > 0) break;
			niceBinSizeID --;
			if (niceBinSizeID < 0) {
				niceBinSizeID = niceBinSizes.length - 1;
				basePower --;
			}
			binSize = niceBinSizes[niceBinSizeID] * Math.pow(10, basePower);
			numLoops++;

		}



		if (!minAtZero){
			if (min > 0) min = min - min % binSize;
			else		 min = min - (binSize + min % binSize);
		}

		if (max > 0) max = max + binSize - max % binSize;
		else		 max = max + binSize - (binSize + max % binSize);


		nLabels = Math.ceil((max - min) / binSize);

		


	}else{
		binSize = 1;
		if (!minAtZero) min--;
		max++;
		nLabels = Math.ceil((max - min) / binSize);
	}
	


	var vals = [];
	var tooBigByFactorOf =  Math.max(Math.ceil(nLabels / maxNumLabels), 1)
	for(var labelID = 0; labelID < nLabels; labelID ++){
		if (labelID == 0 && !zeroLabel) continue;
		if (labelID % tooBigByFactorOf == 0 && labelID * binSize / (max - min) < 0.95) vals.push(roundToSF(labelID * binSize + min));
	}




	return {label: label, min: min, max: max, vals: vals};
	


}






// Draw an axis. Sides: 1, 2, 3, 4 correspond to top, right, bottom, left
function drawAxis(svg, axisGroup, axis, side, scaleFn_x, scaleFn_y, axisMargin = 10, tickSize = 5){



	axisGroup.find(".axis_" + side).remove();
	
	
	if (axis == null) return;

	var stroke = "black";
	
	
	// Draw the ticks
	var tx1, tx2, ty1, ty2;

	for (var i = 0; i < axis.vals.length; i++){
		var val = axis.vals[i];

		if (side == 1 || side == 3){
			ty2 = side == 1 ? svg.height() - axisMargin : axisMargin;
			ty1 = side == 3 ? svg.height() - axisMargin : axisMargin;
			tx1 = scaleFn_x(val);
			tx2 = tx1;

		}
		else {
			tx1 = side == 4 ? axisMargin : svg.width() - axisMargin;
			tx2 = side == 2 ? axisMargin : svg.width() - axisMargin;
			ty1 = scaleFn_y(val);
			ty2 = ty1;

		} 

		
		drawSVGobj(axisGroup, "line", {class: "axis axis_" + side ,id: "axis_" + side + "_" + i, 
				x1: tx1, 
				y1: ty1, 
				x2: tx2,
				y2: ty2, 
				axis_val: val,
				style: "stroke:" + stroke + "; stroke-width:0.3px;" });


		drawSVGobj(axisGroup, "text", {class: "axis axis_" + side ,id: "axisText_" + side + "_" + i, 
				x: tx1, 
				y: ty1, 
				axis_val: val,
				style: ""}, val);



		


	}


}


// Animates an axis
function animateAxis(svg, axisGroup, axis, side, scaleFn_x, scaleFn_y, oldScaleFn_x, oldScaleFn_y, axisMargin = 10, duration = 100){
	
	
	if (axis == null) {
		axisGroup.find(".axis_" + side).remove();
		return;
	}
	
	// Animate the ticks
	var stroke = "black";
	var strokeWidth = "0.1px";
	var tx1, tx2, ty1, ty2;

	// Mark the objects as old
	axisGroup.find(".axis_" + side).attr("old", "1");
	

	for (var i = 0; i < axis.vals.length; i++){
		

		var val = axis.vals[i];
		var ele = axisGroup.find('line.axis_' + side + '[axis_val="' + val + '"]');

		if (side == 1 || side == 3){
			ty2 = side == 1 ? svg.height() - axisMargin : axisMargin;
			ty1 = side == 3 ? svg.height() - axisMargin : axisMargin;
			tx1 = scaleFn_x(val);
			tx2 = tx1;

		}
		else {
			tx1 = side == 4 ? axisMargin : svg.width() - axisMargin;
			tx2 = side == 2 ? axisMargin : svg.width() - axisMargin;
			ty1 = scaleFn_y(val);
			ty2 = ty1;

		} 


		if (ele.length == 0) {
			
			// Draw the axis line where it would have been and then animate it to where it should be now
			if (oldScaleFn_x != null && oldScaleFn_y != null){
				
				
				var x1, x2, y1, y2;
				if (side == 1 || side == 3){
					y1 = ty1;
					y2 = ty2;
					x1 = oldScaleFn_x(val);
					x2 = x1;

				}else{
					x1 = tx1;
					x2 = tx2;
					y1 = oldScaleFn_y(val);
					y2 = y1;
				}



				drawSVGobj(axisGroup, "line", {class: "axis axis_" + side ,id: "axis_" + side + "_" + i, 
					x1: x1, 
					y1: y1, 
					x2: x2,
					y2: y2, 
					axis_val: val,
					style: "stroke:" + stroke + "; stroke-width:0.5px;" });


				drawSVGobj(axisGroup, "text", {class: "axis axis_" + side ,id: "axisText_" + side + "_" + i, 
					x: x1, 
					y: y1, 
					axis_val: val,
					style: ""}, val);


				var newEle = axisGroup.find('line.axis_' + side + '[axis_val="' + val + '"]');
				newEle.velocity({x1: tx1, x2: tx2, y1: ty1, y2: ty2}, duration);

				var textEle = axisGroup.find('text.axis_' + side + '[axis_val="' + val + '"]');
				textEle.velocity({x: tx1, y: ty1}, duration);
				textEle.html(val);
				textEle.attr("old", "0");

			}

			else {
			
				drawSVGobj(axisGroup, "line", {class: "axis axis_" + side ,id: "axis_" + side + "_" + i, 
					x1: tx1, 
					y1: ty1, 
					x2: tx2,
					y2: ty2, 
					axis_val: val,
					style: "stroke:" + stroke + "; stroke-width:0.5px;" });
						
				drawSVGobj(axisGroup, "text", {class: "axis axis_" + side ,id: "axisText_" + side + "_" + i, 
					x: tx1, 
					y: ty1, 
					axis_val: val,
					style: ""}, val);

			}

			
		}
		
		else {
			
			//ele.velocity("finish");
			//console.log(ele.attr("id"));
			ele.velocity({x1: tx1, x2: tx2, y1: ty1, y2: ty2}, duration);
			ele.attr("old", "0");


			var textEle = axisGroup.find('text.axis_' + side + '[axis_val="' + val + '"]');
			textEle.velocity({x: tx1, y: ty1}, duration);
			textEle.html(val);
			textEle.attr("old", "0");
			
			
		}




	}


	// If there are leftover ticks delete them
	axisGroup.find('.axis_' + side + '[old="1"]').remove();

	
	
	
}


// Draw a draggable legend on the svg
function drawLegend(svg, legendGroup, annotation, scaleX_fn, scaleY_fn, svgWidth, svgHeight){

	console.log("Drawing legend", annotation.name);


	var svgWidth = svg.width();
	var svgHeight = svg.height();
	var legend = annotation.legend;
	var x = svgWidth * legend.x;
	var y0 = svgHeight * legend.y;


	// Bounding box for dragging


	// Create the draggable group which contains all the legend elements
	drawSVGobj(legendGroup, "g", {class:"draggableLegend", annotation: annotation.name, origX: x, origY: y0});
	var group = legendGroup.find(`[annotation="` + annotation.name + `"]`);
	group.draggable({
		//containment : [svgWidth,0,-svgWidth,svgHeight], 
		start: function(event, ui){
			event.stopPropagation();
		},
		drag: function(event, ui){
			event.stopPropagation();
		},
        	stop: function(event, ui){
          		//console.log("stop", event);
			
			var origX = parseFloat(group.attr("origX"));
			var origY = parseFloat(group.attr("origY"));
			var dx = parseFloat(group.css("left"));
			var dy = parseFloat(group.css("top"));
			var scaleX = (origX + dx) / svgWidth;
			var scaleY = (origY + dy) / svgHeight;

			if (scaleX < 0.01) scaleX = 0.01;
			if (scaleY < 0.05) scaleY = 0.05;
			if (scaleX > 0.99) scaleX = 0.99;
			if (scaleY > 0.99) scaleY = 0.99;

			group.css("left", svgWidth*scaleX - origX);
			group.css("top", svgHeight*scaleY - origY);

			legend.x = scaleX;
			legend.y = scaleY;

     		}
	});


	// Use the chroma.js library to create a colour palette
	var colours = chroma.scale([annotation.gradientMin, annotation.gradientMax]).mode('lch').colors(annotation.ncols);
	var w = legend.width;
	var h = legend.height / colours.length;


	// Draw the colour ladder
	for (var i = 0; i < colours.length; i ++) {

	
		// Create the first rectangle
		var col = colours[i];
		var y = y0 + (colours.length - i - 1)*h;
		drawSVGobj(group, "rect", {class: "legend", annotation: annotation.name, 
			x: x, 
			y: y, 
			width: w,
			height: h, 
			style: "stroke:black;stroke-width:0;fill:" + col });


	}

		
	
	// Min and max
	drawSVGobj(group, "text", {class: "legend", annotation: annotation.name, 
		x: x, 
		y: y0 + (colours.length)*h,
		style: "text-anchor:end; dominant-baseline:central; font-family:Source Sans Pro;font-size:14px"}, roundToSF(annotation.minVal));


	drawSVGobj(group, "text", {class: "legend", annotation: annotation.name, 
		x: x, 
		y: y0, 
		style: "text-anchor:end; dominant-baseline:auto; font-family:Source Sans Pro;font-size:14px"}, roundToSF(annotation.maxVal));


	// Annotation name
	drawSVGobj(group, "text", {class: "legend", annotation: annotation.name, 
		x: x + w + 10, 
		y: y0 + (colours.length)*h,
		transform: "rotate(270, " + (x + w + 10) + ", " + (y0 + (colours.length)*h) + ")",
		style: "text-anchor:start; dominant-baseline:central; font-family:Source Sans Pro;font-size:14px"}, annotation.name);





}


















