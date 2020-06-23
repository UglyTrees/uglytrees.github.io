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

	SPECIES_TO_GENE_MAPPER = null;
	UNMAPPED_GENE_LABELS = [];


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


function resetSpeciesToGeneMapper(){
	SPECIES_TO_GENE_MAPPER = null;
	UNMAPPED_GENE_LABELS = [];
}




// Builds a map
function mapGeneTreeToSpeciesTree(g, geneLeaves, speciesLeaves){
	
	
	// If the mapper is empty, automatically detect one
	var success = false;
	if (SPECIES_TO_GENE_MAPPER == null) {
		success = automaticallyDetectMapping(g, geneLeaves, speciesLeaves);
	}
	
	
	// Otherwise, try to map from the existing mappings
	if (!success) {
		UNMAPPED_GENE_LABELS = checkIfMappingApplies(SPECIES_TO_GENE_MAPPER, UNMAPPED_GENE_LABELS, g, geneLeaves);
		if (UNMAPPED_GENE_LABELS.length == 0) success = true;
	}
	
	
	// If this has failed, prompt the user
	if (!success) {
		openMapperDialog(SPECIES_TO_GENE_MAPPER, UNMAPPED_GENE_LABELS);
	}
	

	return success;
	
}


// Apply the current mapping to the species and gene tree nodes
function applyTheMapping(speciesLeaves, geneTrees) {
	
	
	// Reset mappings
	for (var i = 0; i < speciesLeaves.length; i ++){
		var species_leaf = speciesLeaves[i];
		species_leaf.branchToGeneNodeMap[g] = {};
		species_leaf.nodeToGeneBranchMap[g] = {};
	}

	for (var g = 0; g < geneTrees.length; g ++){
			
		var geneTree = geneTrees[g];
		if (geneTree == null) continue;
		for (var j = 0; j < geneTree.nodeList.length; j ++){
			var node = geneTree.nodeList[j];
			node.speciesNodeMap = null;
		}
	}
	
	
	for (var speciesLabel in SPECIES_TO_GENE_MAPPER){
		
		
		// Get the species leaf object
		var species_leaf = null;
		for (var i = 0; i < speciesLeaves.length; i ++){
			if (speciesLeaves[i].label == speciesLabel) {
				species_leaf = speciesLeaves[i];
				break;
			}
		}
		
		
		if (species_leaf == null) continue;
		
		var geneLabels = SPECIES_TO_GENE_MAPPER[speciesLabel];
		
		// For each gene tree
		for (var g = 0; g < geneTrees.length; g ++){
			
			var geneTree = geneTrees[g];
			if (geneTree == null) continue;
			species_leaf.branchToGeneNodeMap[g] = [];
			species_leaf.nodeToGeneBranchMap[g] = [];
			
			// For each leaf mapped to this species
			for (var i = 0; i < geneLabels.length; i ++){
				var geneLabel = geneLabels[i];
				
				
				// Get the gene leaf object
				var gene_leaf = null;
				for (var j = 0; j < geneTree.nodeList.length; j ++){
					var node = geneTree.nodeList[j];
					if (node.children.length != 0) continue;
					if (node.label == geneLabel){
						gene_leaf = node;
						break;
					}
					
				}
				
				// Apply
				if (gene_leaf != null) {
					gene_leaf.speciesNodeMap = species_leaf;
					species_leaf.branchToGeneNodeMap[g][gene_leaf.id] = gene_leaf;
					species_leaf.nodeToGeneBranchMap[g][gene_leaf.id] = gene_leaf;
					
					
					
				}

				
				
			}
			
						

			
		
	
		}

	}
	
	return true;
}


// Checks if the gene to species tree mapper is valid
// returns a list of gene leaves which can not be mapped
function checkIfMappingApplies(mapper, unmappedGeneLabels, g, geneLeaves){
	

	
	// Ensure that each gene leaf maps to exactly one species list
	for (var j = 0; j < geneLeaves.length; j ++) {
		var gene_leaf = geneLeaves[j];


		// How many species is this mapped to?
		var numMapped = 0;
		for (var speciesLabel in SPECIES_TO_GENE_MAPPER){

			var geneLabels = SPECIES_TO_GENE_MAPPER[speciesLabel];
			for (var i = 0; i < geneLabels.length; i ++){
				var geneLabel = geneLabels[i];
				if (geneLabel == gene_leaf.label) {
					numMapped ++;
					break;
				}
			}
			
			if (numMapped > 1) break;

		}
		
		if (numMapped == 0) {
			unmappedGeneLabels.push(gene_leaf.label);
			//console.log(gene_leaf.label + " is unmapped");
		}
		if (numMapped > 1) console.log("Error:", gene_leaf.label, "is mapped to more than one species");
		
		
	}
	
	unmappedGeneLabels.sort();
	unmappedGeneLabels.unique();
	return unmappedGeneLabels;
	
	
}



Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}


// Attempts to map a gene tree to a species tree, or returns an error message
function automaticallyDetectMapping(g, geneLeaves, speciesLeaves){
	


	// Reset mappings
	SPECIES_TO_GENE_MAPPER = {};
	for (var i = 0; i < speciesLeaves.length; i ++){
		SPECIES_TO_GENE_MAPPER[speciesLeaves[i].label] = [];
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

					var species_leaf = geneMappedTo[0];
					/*
					species_leaf.branchToGeneNodeMap[g][gene_leaf.id] = gene_leaf;
					species_leaf.nodeToGeneBranchMap[g][gene_leaf.id] = gene_leaf;
					gene_leaf.speciesNodeMap = species_leaf;
					*/
					SPECIES_TO_GENE_MAPPER[species_leaf.label].push(gene_leaf.label);
					
					

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


	return mappedSuccessfully;


	/*
	if (mappedSuccessfully) {
		return "";

	}else{
		return `<b>Unable to automatically map tree to the species tree.</b>  Please ensure that the species labels substrings of the gene labels, (perhaps also delimited by '_', '-', or '.'), and ensure that each gene taxon maps to only one species taxon. See <a style="color:black" href="about/#mapping">example</a>.`;
		
	}
	*/

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
		
		//console.log(ann_name);
		
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
		if (isNumerical && allInteger) isNumerical = true;
		if (!isNumerical && !allInteger) annotation.mustBeNominal = true;

		annotation.complete = isComplete;
		annotation.format = isNumerical && ann_name != "Label" ? "numerical" : "nominal";
		
		// Get discrete values and assign colours
		if (!isNumerical || allInteger) {
			
			var vals = [];
			for (var i = 0; i < tree.nodeList.length; i ++){
				var value = ann_name == "Label" ? tree.nodeList[i].label : tree.nodeList[i].annotation[ann_name];
				if (value == null) continue;
				if (!vals.includes(value)) vals.push(value);
			}


			// Sort the list of values
			vals = vals.sort();
			
			
			for (var i = 0; i < vals.length; i ++){
				var value = vals[i];
				var col = getDefaultColour(i);
				annotation.discreteCols[value] = col;
			}
			
			
		}
		
		annotations.push(annotation);
		
	}
	
	
	return annotations;
	
	
}

















