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
function mapGeneTreeToSpeciesTree(g, treename, geneLeaves, speciesLeaves){
	


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
		return true;

	}else{
		$("#geneTreeUploadMsg").append("<b>Unable to automatically map " + treename + ` to the species tree.</b>  Please ensure that the gene tree leaf labels contain the
			species leaf labels they are mapped to (perhaps delimited by '_', '-', or '.'), and ensure that each gene taxon maps to only one species taxon.`);
		return false;
	}


}





// Find all of the node annotations, and determine whether they have missing values,
// and if they are nominal or numerical
function getTreeAnnotations(tree){
	
	
	var annotation_names = [];
	
	
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
		var annotation = {name: ann_name, complete: true, format: "numerical", gradientMin: "#ffff1a", gradientMax: "#7950DB", ncols: 20, discreteCols: {}};
		var isComplete = true;
		var isNumerical = true;
		var allInteger = false;
		
		console.log(ann_name);
		
		for (var i = 0; i < tree.nodeList.length; i ++){
			
			
			var value = tree.nodeList[i].annotation[ann_name];
			
			// Missing data
			if (value == null){
				isComplete = false;
				continue;
			}
			
			
			if (!isNumerical && !isComplete) break;
			
			if (!isNumerical) continue;
			
			// Contains non-numerical character
			if (value != parseFloat(value)) {
				isNumerical = false;
			}
			
			
			// Check if is integer 
			else if (Math.round(value) != value) {
				allInteger = false;
			}

			
		}
		
		if (isNumerical && allInteger) isNumerical = false;
		annotation.complete = isComplete;
		annotation.format = isNumerical ? "numerical" : "nominal";
		
		// If discrete then get values and assign colours
		if (!isNumerical) {
			
			var vals = [];
			for (var i = 0; i < tree.nodeList.length; i ++){
				var value = tree.nodeList[i].annotation[ann_name];
				if (!vals.includes(value)) vals.push(value);
			}
			
			
			for (var i = 0; i < vals.length; i ++){
				var value = vals[i];
				var col = getDefaultColour(i);
				discreteCols[value] = col;
			}
			
			
		}
		
		
		annotations.push(annotation);
		
	}
	
	
	return annotations;
	
	
}

















