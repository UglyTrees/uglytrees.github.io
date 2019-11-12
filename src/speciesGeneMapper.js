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




function initMapper(){




	var splitBy = function(speciesLabel, geneLabel, index, delimiter) {

		if (index < 0) return null;
		var geneBits = geneLabel.split(delimiter);
		if (index >=  geneBits.length) return null;
		return geneBits[index] == speciesLabel;

	}


	var strContains = function(speciesLabel, geneLabel, index) {
		if (index != 0) return null;
		return geneLabel.includes(speciesLabel);

	}


	// A list of functions to determine whether species label s can be mapped to g, for some parameter i
	MAPPING_STRATEGIES = [	function(s, g, i) { return strContains(s, g, i); }, 
				function(s, g, i) { return strContains(s.toLowerCase(), g.toLowerCase(), i); }, 
				function(s, g, i) { return splitBy(s, g, i, "_"); }, 
				function(s, g, i) { return splitBy(s, g, i, "-"); },
				function(s, g, i) { return splitBy(s, g, i, "."); },
				function(s, g, i) { return splitBy(s.toLowerCase(), g.toLowerCase(), i, "_"); },
				function(s, g, i) { return splitBy(s.toLowerCase(), g.toLowerCase(), i, "-"); },
				function(s, g, i) { return splitBy(s.toLowerCase(), g.toLowerCase(), i, "."); }
			];



}




// Attempts to map a gene tree to a species tree, or returns an error message
function mapGeneTreeToSpeciesTree(g, geneLeaves, speciesLeaves){
	


	// Reset mappings
	for (var i = 0; i < speciesLeaves.length; i ++){
		var species_leaf = speciesLeaves[i];
		species_leaf.branchToGeneNodeMap[g] = {};
		species_leaf.nodeToGeneBranchMap[g] = {};
	}
	for (var j = 0; j < geneLeaves.length; j ++) {
		var gene_leaf = geneLeaves[j];
		gene_leaf.speciesNodeMap = null;
	}



	// For each mapping strategy
	var mappedSuccessfully = false;
	for (var st = 0; st < MAPPING_STRATEGIES.length; st ++){

		var strategy = MAPPING_STRATEGIES[st];
		var strategyWorks = false;
		

		// Parameters
		var strategyParameter = 0;
		var parameterInRange = true;
		while (parameterInRange) {

			var parameterStrategyWorks = true;

			// For each gene taxa
			for (var j = 0; j < geneLeaves.length; j ++) {
				var gene_leaf = geneLeaves[j];
				var geneMappedTo = [];

				// Try to map this gene taxon to a species taxon
				for (var i = 0; i < speciesLeaves.length; i ++){
					var species_leaf = speciesLeaves[i];

					var mappingAttempt = strategy(species_leaf.label, gene_leaf.label, strategyParameter);
					if (mappingAttempt == null) {

						// Parameter out of range
						parameterInRange = false;
						break;

					}

					if (mappingAttempt) {

						// Mapped
						geneMappedTo.push(species_leaf);
						if (geneMappedTo.length > 1) break;


					}



				}


				if (!parameterInRange) {
					parameterStrategyWorks = false;
					break;
				}


				// Check that this gene taxon can be mapped to 1 and only 1 species taxon
				if (geneMappedTo.length == 1){

					//console.log(gene_leaf.label, "mapped to", species_leaf.label);
					var species_leaf = geneMappedTo[0];
					species_leaf.branchToGeneNodeMap[g][gene_leaf.id] = gene_leaf;
					species_leaf.nodeToGeneBranchMap[g][gene_leaf.id] = gene_leaf;
					gene_leaf.speciesNodeMap = species_leaf;


				}else{

					// Strategy did not work for this parameter
					parameterStrategyWorks = false;
					console.log("Strategy", st, strategyParameter, "did not work for", gene_leaf.label, "|", geneMappedTo.length );
					break;
				}



			}


			if (parameterStrategyWorks) {
				strategyWorks = true;
				break;
			}
			


			// Try again with the next parameter value
			strategyParameter++;
			
			
			
		}



		if (strategyWorks) {
			console.log("Strategy", st, strategyParameter, "works");
			mappedSuccessfully = true;
			break;
		}


	}


	if (mappedSuccessfully) {
		return "";

	}else{
		return `<b>Unable to automatically map tree to the species tree.</b>  Please ensure that the species labels substrings of the gene labels, (perhaps also delimited by '_', '-', or '.'), and ensure that each gene taxon maps to only one species taxon.`;
		
	}


}





// Find all of the node annotations, and determine whether they have missing values,
// and if they are nominal or numerical
function getTreeAnnotations(tree, speciesTree = true){
	
	
	var annotation_names = ["Label"];
	
	
	// Get a unique list of annotations
	for (var i = 0; i < tree.nodeList.length; i ++){
		
		var ann = tree.nodeList[i].annotation;
		for (var a in ann) {
			if (!annotation_names.includes(a)) annotation_names.push(a);
		}
		
	}
	
	
	
	// Verify completeness and data format
	// Assumed to be nominal if there is a single non-numeric character or integer only
	// User can revise this assumption 
	var annotations = [];
	for (var j = 0; j < annotation_names.length; j ++){
		
		var ann_name = annotation_names[j];
		var annotation = {name: ann_name, complete: true, format: "numerical", mustBeNumerical: false, mustBeNominal: false, gradientMin: "#ffff1a", gradientMax: "#7950DB", ncols: 20, discreteCols: {}, speciesTree: speciesTree, minVal: 0, maxVal: 0, legend: {showLegend: false, width: 20, height: 100, x: 0.95, y: 0.05}};
		var isComplete = true;
		var isNumerical = true;
		var allInteger = true;
		
		console.log(ann_name);
		
		for (var i = 0; i < tree.nodeList.length; i ++){
			
			
			var value = ann_name == "Label" ? tree.nodeList[i].label : tree.nodeList[i].annotation[ann_name];
			var float = parseFloat(value);  

			// Missing data
			if (value == null){
				isComplete = false;
				continue;
			}
			
			
			if (!isNumerical && !isComplete) break;
			
			if (!isNumerical) continue;
			
			// Contains non-numerical character
			if (isNaN(float) || value != float) {
				isNumerical = false;
			}
			
			
			// Check if is integer 
			if (isNaN(float) || Math.round(value) != value) {
				allInteger = false;
			}

			
		}
		

		if (isNumerical && !allInteger) annotation.mustBeNumerical = true;
		if (isNumerical && allInteger) isNumerical = false;
		if (!isNumerical && !allInteger) annotation.mustBeNominal = true;

		annotation.complete = isComplete;
		annotation.format = isNumerical ? "numerical" : "nominal";
		
		// Get discrete values and assign colours
		if (!isNumerical) {
			
			var vals = [];
			for (var i = 0; i < tree.nodeList.length; i ++){
				var value = ann_name == "Label" ? tree.nodeList[i].label : tree.nodeList[i].annotation[ann_name];
				if (value == null) continue;
				if (!vals.includes(value)) vals.push(value);
			}
			
			
			for (var i = 0; i < vals.length; i ++){
				var value = vals[i];
				var col = getDefaultColour(i);
				annotation.discreteCols[value] = col;
			}
			
			
		}
		
		annotations.push(annotation);
		
	}
	
	
	console.log(annotations);
	return annotations;
	
	
}

















