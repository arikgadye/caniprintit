define(['jquery', 'bacon', 'bacon.jquery', 'printanalyzer/findBestAR', 'printanalyzer/AspectRatio', 'vow', 'filereader/getImageDimensions', 'view/switchView'], function($, bacon, bjq, findBestAR, AspectRatio, vow, getImageDimensions, switchView) {	
	$(document).ready(function() {
		// create an array of the top three print sizes; starting from good, okay, then bad. 
		function getThreeSizes(sizes) {
			var printSizes = [];
			var i = 0;
			while (i < 3) {
				if (sizes["good"].length > 0) {printSizes.push({'printStatus': 'good', 'size': sizes['good'].pop()}); i++}
				if (sizes["okay"].length > 0) {printSizes.push({'printStatus': 'okay', 'size': sizes['okay'].pop()}); i++}
				if (sizes["bad"].length > 0)  {printSizes.push({'printStatus': 'bad',  'size': sizes['bad'].pop()}); i++}
			}
			switchView(printSizes)();
		}
		function getImageSizes(val) {
			return new vow.Promise(function(resolve, reject){
				if (val[0] > 0 && val[1] > 0) {
					resolve(findBestAR(val[0], val[1]));
				} else {
					reject(new Error("Bad response" + this.status));
				}
			}).then(function(AR) {
				if (AR) {
					return AR.ratio.findSizes({width: val[0], height: val[1]}, 130, 150);
				} else {
					console.log("Bad dimensions");
				}
			}).then(function(sizes) {
				getThreeSizes(sizes);
			});
		}
		//reading from form changes
		var width = bjq.textFieldValue($('#widthInput')).changes().map(function(e) {
			return parseInt(e);
		});
		var height = bjq.textFieldValue($('#heightInput')).changes().map(function(e) {
			return parseInt(e);
		});
		
		var both = bacon.combineAsArray(width, height);
		both.onValue(function(val) {
			getImageSizes(val);
		});

	// filling in form values from file input change
	function fillInForm(width, height) {
		$('#widthInput').val(width)
		$('#heightInput').val(height);
		both = bacon.combineAsArray(width, height);
		both.onValue(function(val) {
			getImageSizes(val);
		});
	}
	var input = $("input[type=file]").asEventStream('change').map(function(e) {
		return getImageDimensions(e.target.files[0]);
	});
	input.onValue(function(val) {
		val.then(function(dimensions) {
			fillInForm(dimensions.width, dimensions.height);
		})
		});
	});
});