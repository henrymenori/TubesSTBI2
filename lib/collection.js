var file = require('fs');
var math = require('mathjs');

var TextProcessor = require('../lib/TextProcessor');

function Collection(textprocessor) {
	this.rawdocuments = [];
	this.textprocessor = new TextProcessor();
	this.idf = {};
	this.norm = [];
	this.invertedfile = {};
	this.option = {};
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

Collection.prototype.createInvertedFile = function(documentLocation, stopwordLocation, tfopt, idfopt, normopt, stemopt) {
	this.textprocessor.loadStopwords(stopwordLocation);
	this.loadDocuments(documentLocation);
	
	// set IR option
	this.option['tfopt'] = tfopt;
	this.option['idfopt'] = idfopt;
	this.option['normopt'] = normopt;
	this.option['stemopt'] = stemopt;
	
	// preprocess document
	var temp;
	var doclength = this.rawdocuments.length;
	var word = [];
	var postdoc = [];
	
	for(var i = 0; i < doclength; i++) {
		postdoc.push([]);
	}
	
	for(var i = 0; i < doclength; i++) {
		temp = this.textprocessor.processText(this.rawdocuments[i].title + ' ' + this.rawdocuments[i].words, this.option['stemopt']);
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
	if(this.option['tfopt'] == 'option1') {
		for(var i = 0; i < doclength; i++) {
			matrixtf.push([]);
			for(var j = 0; j < wordlength; j++) {
				matrixtf[i].push(1);
			}
		}
	}
	// raw tf
	else if(this.option['tfopt'] == 'option2') {
		matrixtf = postdoc;
	}
	// binary tf
	else if(this.option['tfopt'] == 'option3') {
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
	else if(this.option['tfopt'] == 'option4') {
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
	else if(this.option['tfopt'] == 'option5') {
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
	if(this.option['idfopt'] == 'option1') {
		for(var i = 0; i < wordlength; i++) {
			matrixidf.push(1);
		}
	}
	// standard idf
	else if(this.option['idfopt'] == 'option2') {
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
	
	// no normalization
	if(this.option['normopt'] == 'option1') {
		for(var i = 0; i < doclength; i++) {
			this.norm.push(1);
		}
	}
	else if(this.option['normopt'] == 'option2') {
		for(var i = 0; i < doclength; i++) {
			this.norm.push(0);
			for(var j = 0; j < wordlength; j++) {
				this.norm[i] = this.norm[i] + math.pow(postdoc[i][j], 2);
			}
			this.norm[i] = math.sqrt(this.norm[i]);
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
				invertedfile[word[j]][i + 1] = result;
			}
		}
	}
	this.invertedfile = invertedfile;
	
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

Collection.prototype.indexing = function(query) {
	// preprocess query
	var temp;
	var doclength = this.rawdocuments.length;
	var word = [];
	var postquery = [];
	var norm;
	
	temp = this.textprocessor.processText(query, this.option['stemopt']);
	for(var j = 0; j < temp.length; j++) {
		if(word.indexOf(temp[j]) == -1) {
			word.push(temp[j]);
			postquery.push(0);
		}
		postquery[word.indexOf(temp[j])]++;
	}
	
	// count idf and tf query
	var matrixtf = [];
	var matrixidf = [];
	var wordlength = word.length;
	
	// no tf
	if(this.option['tfopt'] == 'option1') {
		for(var j = 0; j < wordlength; j++) {
			matrixtf.push(1);
		}
	}
	// raw tf
	else if(this.option['tfopt'] == 'option2') {
		matrixtf = postquery;
	}
	// binary tf
	else if(this.option['tfopt'] == 'option3') {
		for(var j = 0; j < wordlength; j++) {
			if(postquery[j] == 0) {
				matrixtf.push(0);
			}
			else {
				matrixtf.push(1);
			}
		}
	}
	// augmented tf
	else if(this.option['tfopt'] == 'option4') {
		var max = 0;
		for(var j = 0; j < wordlength; j++) {
			if(postquery[j] > max) {
				max = postquery[j];
			}
		}
		for(var j = 0; j < wordlength; j++) {
			matrixtf.push(0.5 + 0.5 * postquery[j] / max);
		}
	}
	// logarithmic tf
	else if(this.option['tfopt'] == 'option5') {
		for(var j = 0; j < wordlength; j++) {
			if(postquery[j] != 0) {
				matrixtf.push(1 + math.log(postquery[j], 10));
			}
			else {
				matrixtf.push(0);
			}
		}
	}
	
	// no idf
	if(this.option['idfopt'] == 'option1') {
		for(var i = 0; i < wordlength; i++) {
			matrixidf.push(1);
		}
	}
	// standard idf
	else if(this.option['idfopt'] == 'option2') {
		for(var i = 0; i < wordlength; i++) {
			if(this.idf[word[i]] != undefined) {
				matrixidf.push(this.idf[word[i]]);
			}
			else {
				matrixidf.push(0);
			}
		}
	}
	
	// no normalization
	if(this.option['normopt'] == 'option1') {
		norm = 1;
	}
	else if(this.option['normopt'] == 'option2') {
		for(var j = 0; j < wordlength; j++) {
			norm = norm + math.pow(postquery[j], 2);
		}
		norm = math.sqrt(norm);
	}	
	
	// create inverted query
	var invertedfile = {};
	var result;
	
	for(var j = 0; j < wordlength; j++) {
		invertedfile[word[j]] = matrixtf[j] * matrixidf[j];
	}
	
	// count similarity
	var similarity = [];
	for(var i = 0; i < this.rawdocuments.length; i++) {
		similarity.push(0);
		for(var j = 0; j < wordlength; j++) {
			if(this.invertedfile[word[j]] != undefined) {
				if(this.invertedfile[word[j]][i + 1] != undefined) {
					similarity[i] = similarity[i] + invertedfile[word[j]] * this.invertedfile[word[j]][i + 1];
				}
			}
		}
		similarity[i] = similarity[i] / norm / this.norm[i];
	}
	
	// sort similarity
	var result = [];
	for(var i = 0; i < similarity.length; i++) {
		if(similarity[i] > 0) {
			result.push({
				nodoc : '' + (i + 1),
				value : similarity[i]
			});
		}
	}
	result.sort(function(a, b) {
		if(a.value > b.value) {
			return -1;
		}
		if(a.value < b.value) {
			return 1;
		}
		return 0;
	});
	
	return result;
};

Collection.prototype.loadQueries = function(filename) {
	var queries = file.readFileSync(filename).toString().split('.I');
	var query;
	var element;
	var rawqueries = [];
	
	for(var i = 0; i < queries.length; i++) {
		query = queries[i];
		if(query != '') {
			element = query.split('.W\r\n');
			rawqueries.push(element[1]);
		}
	}
	console.log("Query loaded !");
	
	return rawqueries;
};

Collection.prototype.loadRelevance = function(filename) {
	var relevances = file.readFileSync(filename).toString().split('\r\n');
	var relevance;
	var element;
	var relevantjudgements = [];
	
	for(var i = 0; i < relevances.length; i++) {
		var relevance = relevances[i];		
		if(relevance != '') {
			element = relevance.split(' ');
			if(relevantjudgements.length < element[0]) {
				relevantjudgements[relevantjudgements.length] = [element[1]];
			}
			else {
				relevantjudgements[element[0] - 1].push(element[1]);
			}
		}
	}
	console.log("Relevance Feedback loaded !");
	
	return relevantjudgements;
};

Collection.prototype.experimental = function(querylocation, relevancelocation) {
	var queries = this.loadQueries(querylocation);
	var relevances = this.loadRelevance(relevancelocation);
	var temp;
	var rank;
	var result = [];
	
	for(var i = 0; i < queries.length; i++) {
		temp = this.indexing(queries[i]);
		
		var rank = [];
		for(var j = 0; j < temp.length; j++) {
			if(relevances[i].indexOf(temp[j].nodoc) != -1) {
				rank.push(j + 1);
			}
		}
		
		// recall
		var recall = rank.length / relevances[i].length;
		// precision
		var precision = rank.length / temp.length;
		// non-interpolated precision
		var nip = 0;
		for(var j = 0; j < rank.length; j++) {
			nip = nip + (j + 1) / rank[j];
		}
		nip = nip / relevances[i].length;
		
		result.push({
			recall : recall,
			precision : precision,
			nip : nip
		});
	}
	
	return result;
};

Collection.prototype.interactive = function(query) {
	var temp = this.indexing(query);
	var result = [];
	
	for(var i = 0; i < temp.length; i++) {
		result.push({
			nodoc : temp[i].nodoc,
			title : this.rawdocuments[temp[i].nodoc - 1].title,
			words : this.rawdocuments[temp[i].nodoc - 1].words
		});
	}
	
	return result;
};

module.exports = Collection;