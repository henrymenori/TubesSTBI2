var file = require('fs');
var math = require('mathjs');

var TextProcessor = require('../lib/TextProcessor');

function Collection(textprocessor) {
	this.rawdocuments = [];
	this.textprocessor = new TextProcessor();
	this.idf = {};
}

Collection.prototype.loadDocuments = function(filename) {
    var documents = file.readFileSync(filename).toString().split('.I ');
    for(var i = 0; i < documents.length; i++) {
        var document = documents[i];
        var element, title, author, words;

        if(document != '') {
            element = document.split('.T\r\n');
            element = element[1].split('.A\r\n');
            if (element.length > 1) {
                title = element[0];
				author = '';
				for(var j = 1; j < element.length - 1; j++) {
					author = author + element[j] + ' ';
				}
                element = element[element.length - 1].split('.W\r\n');
				author = author + element[0] + ' ';
				element = element[1].split('.X\r\n');
				words = element[0];
            }
            else {
                element = element[0].split('.W\r\n');
				title = element[0];
				element = element[1].split('.X\r\n');
				words = element[0];
            }

            this.rawdocuments.push({
                title: title,
                author: author,
                words: words
            });
        }
    }
	console.log("Document loaded !");
};

Collection.prototype.createInvertedFile = function(documentLocation, stopwordLocation, stemopt, tfopt, idfopt) {
	this.textprocessor.loadStopwords(stopwordLocation);
	this.loadDocuments(documentLocation);
	
	// preprocess document
	var temp;
	var doclength = this.rawdocuments.length;
	var word = [];
	var postdoc = [];
	
	for(var i = 0; i < doclength; i++) {
		postdoc.push([]);
	}
	
	for(var i = 0; i < doclength; i++) {
		temp = this.textprocessor.processText(this.rawdocuments[i].title + ' ' + this.rawdocuments[i].words, stemopt);
		for(var j = 0; j < temp.length; j++) {
			if(word.indexOf(temp[j]) == -1) {
				word.push(temp[j]);
				for(var k = 0; k < postdoc.length; k++) {
					postdoc[k].push(0);
				}
			}
			postdoc[i][word.indexOf(temp[j])]++;
		}
	}
	console.log("Post documents created !");
	
	// count idf and tf document
	var matrixtf = [];
	var matrixidf = [];
	var wordlength = word.length;
	
	// no tf
	if(tfopt == 'option1') {
		for(var i = 0; i < doclength; i++) {
			matrixtf.push([]);
			for(var j = 0; j < wordlength; j++) {
				matrixtf[i].push(1);
			}
		}
	}
	// raw tf
	else if(tfopt == 'option2') {
		matrixtf = postdoc;
	}
	// binary tf
	else if(tfopt == 'option3') {
		for(var i = 0; i < doclength; i++) {
			matrixtf.push([]);
			for(var j = 0; j < wordlength; j++) {
				if(postdoc[i][j] == 0) {
					matrixtf[i].push(0);
				}
				else {
					matrixtf[i].push(1);
				}
			}
		}
	}
	// augmented tf
	else if(tfopt == 'option4') {
		for(var i = 0; i < doclength; i++) {
			var max = 0;
			for(var j = 0; j < wordlength; j++) {
				if(postdoc[i][j] > max) {
					max = postdoc[i][j];
				}
			}
			matrixtf.push([]);
			for(var j = 0; j < wordlength; j++) {
				matrixtf[i].push(0.5 + 0.5 * postdoc[i][j] / max);
			}
		}
	}
	// logarithmic tf
	else if(tfopt == 'option5') {
		for(var i = 0; i < doclength; i++) {
			matrixtf.push([]);
			for(var j = 0; j < wordlength; j++) {
				if(postdoc[i][j] != 0) {
					matrixtf[i].push(1 + math.log(postdoc[i][j], 10));
				}
				else {
					matrixtf[i].push(0);
				}
			}
		}
	}
	
	// no idf
	if(idfopt == 'option1') {
		for(var i = 0; i < wordlength; i++) {
			matrixidf.push(1);
		}
	}
	// standard idf
	else if(idfopt == 'option2') {
		for(var i = 0; i < wordlength; i++) {
			var sum = 0;
			for(var j = 0; j < doclength; j++) {
				if(postdoc[j][i] > 0) {
					sum++;
				}
			}
			matrixidf.push(math.log(doclength / sum, 10));
		}
	}
	
	// create inverted file
	var invertedfile = {};
	var result;
	
	for(var i = 0; i < wordlength; i++) {
		this.idf[word[i]] = matrixidf[i];
	}
	for(var i = 0; i < doclength; i++) {
		for(var j = 0; j < wordlength; j++) {
			result = matrixtf[i][j] * matrixidf[j];
			if(result != 0) {
				if(invertedfile[word[j]] == undefined) {
					invertedfile[word[j]] = {};
				}
				invertedfile[word[j]][i + 1] = matrixtf[i][j] * matrixidf[j];
			}
		}
	}
	
	// sort inverted by alphabet
	var str = '';
	
	Object.keys(invertedfile).sort().forEach(function(key) {
		Object.keys(invertedfile[key]).forEach(function(kez) {
			str = str + '' + key + '\t' + kez + '\t' + invertedfile[key][kez] + '\n';
		});
	});
	file.writeFileSync('inverted.txt', str, 'utf-8');
	
	console.log("Inverted file created !");
};

module.exports = Collection;