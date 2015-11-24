var file = require('fs');
var natural = require('natural'), stem = natural.PorterStemmer;

function TextProcessor() {
	this.stopwords = [];
}

TextProcessor.prototype.loadStopwords = function(filename) {
	this.stopwords = file.readFileSync(filename).toString().split('\r\n');
	console.log('Stopwords loaded !');
}

TextProcessor.prototype.processText = function(text, stemopt) {
	var result = text;
	
	result = result.toLowerCase();
	result = result.replace(new RegExp('[^a-z ]+','gi'),' ');
	/*result = result.replace(new RegExp('\\s*(\\d+|[^\\w])\\s','gi'),' ');
    result = result.replace(new RegExp('\\s[^\\w]\\s*','gi'),' ');
	result = result.replace(new RegExp('\\s*(\\d+)\\s*','gi'),' ');*/
	
	for(var i = 0 ; i < this.stopwords.length; i++) {
        result = result.replace(new RegExp('\\s'+this.stopwords[i]+'\\s','gi'),' ');
    }
	
	if(stemopt == 'option2') {
		result = stem.tokenizeAndStem(result);
	}
	else {
		result = result.split(new RegExp('\\s','gi'));
	}
	
	return result;
};

module.exports = TextProcessor;