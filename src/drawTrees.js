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

/*
function scaleTreeMultiplier(node, scaleX_fn, scaleY_fn) {
	
	if (node.children.length == 2){
		scaleTreeMultiplier(node.children[0], scaleX_fn, scaleY_fn);
		scaleTreeMultiplier(node.children[1], scaleX_fn, scaleY_fn);
	}
	
	
	node.coords.bottomRight.x = scaleX_fn(node.coords.bottomRight.x);
	node.coords.bottomLeft.x = scaleX_fn(node.coords.bottomLeft.x);
	node.coords.bottomRight.y = scaleY_fn(node.coords.bottomRight.y);
	node.coords.bottomLeft.y = scaleY_fn(node.coords.bottomLeft.y);
	
	node.coords.topRight.x = scaleX_fn(node.coords.topRight.x);
	node.coords.topLeft.x = scaleX_fn(node.coords.topLeft.x);
	node.coords.topRight.y = scaleY_fn(node.coords.topRight.y);
	node.coords.topLeft.y = scaleY_fn(node.coords.topLeft.y);
	
	node.coords.xrange.left = scaleX_fn(node.coords.xrange.left);
	node.coords.xrange.right = scaleX_fn(node.coords.xrange.right);
	
	
	if (node.dashed != null){
		node.dashed.left = scaleX_fn(node.dashed.left);
		node.dashed.right = scaleX_fn(node.dashed.right);
	}
	
	
}
*/



// Generates the initial coordinated, later to be linearly transformed onto the svg
function planSpeciesTree(node) {



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
	planSpeciesTree(left);
	planSpeciesTree(right);


	// Position this node centered between the left child's right and the right child's left
	var cy = node.height;
	var cx = (left.coords.bottomRight.x + right.coords.bottomLeft.x) / 2;
	var parentcy = node.parent == null ? MAX_TREE_HEIGHT : node.parent.height;
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

	

	//console.log(node.id, node)
	//alert(5);
	

}



// Draws a pre-scaled species tree onto the svg
function drawASpeciesTree(svg, tree, treename, node, styles = {col: SPECIES_TREE_BORDER_COL, fill: SPECIES_TREE_BG_COL, lineWidthMultiplier: SPECIES_BRANCH_WIDTH}) {

	var strokeWidth = styles.lineWidthMultiplier * Math.max(Math.min(roundToSF(node.rate), 3), 0.2);
	var id = treename + "_" + node.id;
	node.htmlID = id;
	
	
	//console.log("node", node);

	// Leaf node. Draw branch and return x,y values of parent node
	if (node.children.length == 0){


				
		// Polygon
		var points = [	tree.scaleX_fn(node.coords.bottomLeft.x), tree.scaleY_fn(node.coords.bottomLeft.y),
						tree.scaleX_fn(node.coords.bottomRight.x), tree.scaleY_fn(node.coords.bottomLeft.y),
						tree.scaleX_fn(node.coords.topRight.x), tree.scaleY_fn(node.coords.topRight.y),
						tree.scaleX_fn(node.coords.topLeft.x), tree.scaleY_fn(node.coords.topRight.y)];
						
		drawSVGobj(svg, "polygon", {class: "specieshoverbranch", id: id + "_P", 
										points: points.join(" "), 
										fill: styles.fill,
										style: "stroke-linejoin:round; stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"}, "", true);		
		
		/*


		// Mouse enter parallelogram
		drawSVGobj(svg, "path", {class:"specieshoverbranch", id: id + "_P", 
			d: "M " + tree.scaleX_fn(node.coords.bottomLeft.x) + " " + tree.scaleY_fn(node.coords.bottomLeft.y) + 
			  " H " + tree.scaleX_fn(node.coords.bottomRight.x) + 
			  " L " + tree.scaleX_fn(node.coords.topRight.x) + " " + tree.scaleY_fn(node.coords.topRight.y) +
			  " H " + tree.scaleX_fn(node.coords.topLeft.x) + " Z", 
					fill: styles.fill, stroke:"transparent", name: node.id + "," + node.label }, "", true);
		*/
/*

		// Bottom horizontal line
		drawSVGobj(svg, "line", {class: "speciesbranch", id: id + "_B", 
									x1: tree.scaleX_fn(node.coords.bottomLeft.x), 
									y1: tree.scaleY_fn(node.coords.bottomLeft.y), 
									x2: tree.scaleX_fn(node.coords.bottomRight.x),
									y2: tree.scaleY_fn(node.coords.bottomRight.y), 
									style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});
										
																	
		// Left branch
		drawSVGobj(svg, "line", {class: "speciesbranch", id: id + "_L", 
									x1: tree.scaleX_fn(node.coords.bottomLeft.x), 
									y1: tree.scaleY_fn(node.coords.bottomLeft.y), 
									x2: tree.scaleX_fn(node.coords.topLeft.x),
									y2: tree.scaleY_fn(node.coords.topLeft.y), 
									style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});			


		// Right branch
		drawSVGobj(svg, "line", {class: "speciesbranch", id: id + "_R", 
									x1: tree.scaleX_fn(node.coords.bottomRight.x), 
									y1: tree.scaleY_fn(node.coords.bottomRight.y), 
									x2: tree.scaleX_fn(node.coords.topRight.x),
									y2: tree.scaleY_fn(node.coords.topRight.y), 
									style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});	

*/
					
		return;

	}




	// Internal/root node. Draw children first
	drawASpeciesTree(svg, tree, treename, node.children[0], styles);
	drawASpeciesTree(svg, tree, treename, node.children[1], styles);
	
	
	// Mouse enter parallelogram
	/*
	drawSVGobj(svg, "path", {class:"specieshoverbranch", id: id + "_P", 
		d: "M " + tree.scaleX_fn(node.coords.bottomLeft.x) + " " + tree.scaleY_fn(node.coords.bottomLeft.y) + 
		  " H " + tree.scaleX_fn(node.coords.bottomRight.x) + 
		  " L " + tree.scaleX_fn(node.coords.topRight.x) + " " + tree.scaleY_fn(node.coords.topRight.y) +
		  " H " + tree.scaleX_fn(node.coords.topLeft.x) + " Z", 
				fill: styles.fill, name: node.id }, "", true);
	*/		

	
	
	// Polygon
	var points = [	tree.scaleX_fn(node.coords.bottomLeft.x), tree.scaleY_fn(node.coords.bottomLeft.y),
					tree.scaleX_fn(node.coords.bottomRight.x), tree.scaleY_fn(node.coords.bottomLeft.y),
					tree.scaleX_fn(node.coords.topRight.x), tree.scaleY_fn(node.coords.topRight.y),
					tree.scaleX_fn(node.coords.topLeft.x), tree.scaleY_fn(node.coords.topRight.y)];
					
	drawSVGobj(svg, "polygon", {class: "specieshoverbranch", id: id + "_P", 
									points: points.join(" "), 
									fill: styles.fill,
									style: "stroke-linejoin:round; stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"}, "", true);		
	

	
	
	// Bottom horizontal dashed line
	/*
	drawSVGobj(svg, "line", {class: "speciesbranch", id: id + "_B", 
								x1: tree.scaleX_fn(node.coords.dashed.left), 
								y1: tree.scaleY_fn(node.coords.bottomLeft.y), 
								x2: tree.scaleX_fn(node.coords.dashed.right),
								y2: tree.scaleY_fn(node.coords.bottomRight.y), 
								stroke_dasharray: 4,
								style: "stroke:" + styles.col + "; stroke-width:" + styles.lineWidthMultiplier + "px"});
						*/		
								
								
			/*					
	// Left branch
	drawSVGobj(svg, "line", {class: "speciesbranch", id: id + "_L", 
								x1: tree.scaleX_fn(node.coords.bottomLeft.x), 
								y1: tree.scaleY_fn(node.coords.bottomLeft.y), 
								x2: tree.scaleX_fn(node.coords.topLeft.x),
								y2: tree.scaleY_fn(node.coords.topLeft.y), 
								style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});		
	
	
	// Right branch
	drawSVGobj(svg, "line", {class: "speciesbranch", id: id + "_R", 
								x1: tree.scaleX_fn(node.coords.bottomRight.x), 
								y1: tree.scaleY_fn(node.coords.bottomRight.y), 
								x2: tree.scaleX_fn(node.coords.topRight.x),
								y2: tree.scaleY_fn(node.coords.topRight.y), 
								style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});		
	*/

}





// Animates a pre-rendered species tree
function animateASpeciesTree(svg, tree, treename, node, animation_time = 1000, styles = {col: SPECIES_TREE_BORDER_COL, fill: SPECIES_TREE_BG_COL, lineWidthMultiplier: SPECIES_BRANCH_WIDTH}) {



	var id = treename + "_" + node.id;
	node.htmlID = id;

	animateSpeciesBranch(tree, node, "B", styles, animation_time);
	animateSpeciesBranch(tree, node, "L", styles, animation_time);
	animateSpeciesBranch(tree, node, "R", styles, animation_time);
	
	

	
	
	// Animate children
	for (var c = 0; c < node.children.length; c++){
		animateASpeciesTree(svg, tree, treename, node.children[c], animation_time, styles);
	}

	
}




function animateSpeciesBranch(tree, node, branchLetter = "B", styles, duration = 1000) {




	var ele = $("#" + node.htmlID + "_" + branchLetter);
	
	if (ele.length == 0) return;
	
	var stroke = rgbToHex(styles.col);
	var strokeWidth = styles.lineWidthMultiplier * Math.max(Math.min(roundToSF(node.rate), 3), 0.2);
	
	var points = [	tree.scaleX_fn(node.coords.bottomLeft.x), tree.scaleY_fn(node.coords.bottomLeft.y),
					tree.scaleX_fn(node.coords.bottomRight.x), tree.scaleY_fn(node.coords.bottomLeft.y),
					tree.scaleX_fn(node.coords.topRight.x), tree.scaleY_fn(node.coords.topRight.y),
					tree.scaleX_fn(node.coords.topLeft.x), tree.scaleY_fn(node.coords.topRight.y)];
	
	
	//console.log("stroke", stroke, strokeWidth, x1, x2, y1, y2);
	
	
	ele.velocity("finish");
	
	if (parseFloat(ele.css("stroke-width")) == strokeWidth) ele.velocity( {points: points.join(" ")}, duration );
	else ele.velocity( {points: points.join(" "), strokeWidth: strokeWidth + "px"}, duration );
	
	//ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, stroke: stroke, strokeWidth: strokeWidth + "px" }, duration );
	//ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, strokeWidth: strokeWidth + "px"}, duration );
	ele.css("stroke", stroke);
	//ele.css("stroke-width", strokeWidth + "px");
	


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
				
				//Right
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
				childNode.coords.strokeWidths.push(leftMappedToSpeciesNode.rate);
				
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
	
	node.coords = { cx: thisX, cy: thisY, x: [thisX], y: [thisY], strokeWidths: [speciesNode.rate] };
	left.coords.x.push(thisX);
	left.coords.y.push(thisY);
	left.coords.strokeWidths.push(speciesNode.rate);
	right.coords.x.push(thisX);
	right.coords.y.push(thisY);
	right.coords.strokeWidths.push(speciesNode.rate);
	
	
	//console.log(node.id, left.coords);
	

}








// Draws a gene tree onto the svg
function drawAGeneTree(svg, treename, node, speciesTree, geneTreeNum, styles = {col: "black", strokeWidthMultiplier: GENE_BRANCH_WIDTH, nodeSize: GENE_NODE_SIZE}) {
	
	
	
	var id = treename + "_" + node.id;
	node.htmlID = id;


	// Leaf node. Draw circle and branch(es) to its parent node
	if (node.children.length == 2){


		//console.log("Drawing", node.coords, speciesTree.scaleX_fn(node.coords.cx));

		// Internal/root node. Draw children first
		drawAGeneTree(svg, treename, node.children[0], speciesTree, geneTreeNum, styles)
		drawAGeneTree(svg, treename, node.children[1], speciesTree, geneTreeNum, styles)

	}



	// Branch(es) to parent
	for (var i = 0; i < node.coords.x.length-1; i ++){
		
		var x1 = node.coords.x[i];
		var x2 = node.coords.x[i+1];
		var y1 = node.coords.y[i];
		var y2 = node.coords.y[i+1];
		var strokeWidth = styles.strokeWidthMultiplier * node.coords.strokeWidths[i];
		
		drawSVGobj(svg, "line", {class: "genebranch", id: id + "_B" + i, 
									x1: speciesTree.scaleX_fn(x1), 
									y1: speciesTree.scaleY_fn(y1), 
									x2: speciesTree.scaleX_fn(x2),
									y2: speciesTree.scaleY_fn(y2), 
									gNum: geneTreeNum,
									branchfornode: id,
									style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});
		
			
			
	}
	
	
	
	// The circle
	drawSVGobj(svg, "circle", {class: "genenode", id: id, 
								cx: speciesTree.scaleX_fn(node.coords.cx), 
								cy: speciesTree.scaleY_fn(node.coords.cy), 
								r: styles.nodeSize,
								gNum: geneTreeNum,
								name: (node.children.length == 0 ? node.id + "," + node.label : node.id),
								fill: styles.col}, "", true);



	
	


}



// Animates a pre-rendered gene tree
function animateAGeneTree(svg, treename, node, speciesTree, geneTreeNum, styles, animation_time = 1000) {


	var id = treename + "_" + node.id;
	node.htmlID = id;
	

	
	
	// Branch(es) to parent
	for (var i = 0; i < node.coords.x.length-1; i ++){
		
		
		animateGeneBranch(i, speciesTree, node, geneTreeNum, styles, animation_time);
		
		var x1 = node.coords.x[i];
		var x2 = node.coords.x[i+1];
		var y1 = node.coords.y[i];
		var y2 = node.coords.y[i+1];
		var strokeWidth = GENE_BRANCH_WIDTH * node.coords.strokeWidths[i];
		
		
		//animateSpeciesBranch(tree, node, "B" + i, animation_time, gNum);
		/*
		drawSVGobj(svg, "line", {class: "genebranch", id: id + "_B" + i, 
									x1: speciesTree.scaleX_fn(x1), 
									y1: speciesTree.scaleY_fn(y1), 
									x2: speciesTree.scaleX_fn(x2),
									y2: speciesTree.scaleY_fn(y2), 
									gNum: geneTreeNum,
									branchfornode: id,
									style: "stroke:" + styles.col + "; stroke-width:" + strokeWidth + "px"});
		*/
			
			
	}
	
	animateGeneBranch(-1, speciesTree, node, geneTreeNum, styles, animation_time);
	/*
	// The circle
	drawSVGobj(svg, "circle", {class: "genenode", id: id, 
								cx: speciesTree.scaleX_fn(node.coords.cx), 
								cy: speciesTree.scaleY_fn(node.coords.cy), 
								r: GENE_NODE_SIZE,
								gNum: geneTreeNum,
								name: (node.children.length == 0 ? node.id + "," + node.label : node.id),
								fill: styles.col}, "", true);

	*/

	
	
	
	

	
	//animateSpeciesBranch(tree, node, "L", animation_time);
	//animateSpeciesBranch(tree, node, "R", animation_time);
	
	
	// Animate children
	for (var c = 0; c < node.children.length; c++){
		animateAGeneTree(svg, treename, node.children[c], speciesTree, geneTreeNum, styles, animation_time);
	}

	
}





function animateGeneBranch(branchNumber, speciestree, node, gNum, styles, duration = 1000) {



	
	// Move the node
	if (branchNumber == -1){
		
		var ele = $("#" + node.htmlID);
		

		var cx = speciestree.scaleX_fn(node.coords.cx);
		var cy = speciestree.scaleY_fn(node.coords.cy);
		var r = styles.nodeSize;
		var fill = styles.col;
		

		
		ele.velocity("finish");
		ele.velocity( {cx: cx, cy: cy, r: r, fill: fill}, duration);
		
	}
	
	
	// Move a branch
	else {
	
		
		var ele = $("#" + node.htmlID + "_B" + branchNumber)
		var x1 = speciestree.scaleX_fn(node.coords.x[branchNumber]);
		var x2 = speciestree.scaleX_fn(node.coords.x[branchNumber + 1]);
		var y1 = speciestree.scaleY_fn(node.coords.y[branchNumber]);
		var y2 = speciestree.scaleY_fn(node.coords.y[branchNumber + 1]);
		var strokeWidth = styles.strokeWidthMultiplier * node.coords.strokeWidths[branchNumber];
		var stroke = styles.col;

		ele.velocity("finish");
		//ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, strokeWidth: strokeWidth + "px", stroke: stroke}, duration );



		if (parseFloat(ele.css("stroke-width")) == strokeWidth) ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2}, duration );
		else ele.velocity( {x1: x1, x2: x2, y1: y1, y2: y2, strokeWidth: strokeWidth + "px"}, duration );



	
	}


}






function animatePolygon(){
	
	var ele = $("#polygon1");
	var points = "50 300 100 300 180 200 130 200";
	ele.velocity( {points: points}, 1000);
}










