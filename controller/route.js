var express = require('express');
var Collection = require('../lib/Collection');

var router = express.Router();
var collection = new Collection();

var result;
var query;
var a;
var tops;
var topn;
var usd;
var uqe;

router.get('/home', function(req, res) {
	res.render('home');
});

router.post('/inverting', function(req, res) {
	collection.createInvertedFile(
		req.body.documentLocation,
		req.body.stopwordLocation,
		req.body.TF,
		req.body.IDF,
		req.body.Normalization,
		req.body.Stemming
	);
	res.redirect('/home');
});

router.get('/experimental', function(req, res) {
	res.render('experimental');
});

router.post('/runex', function(req, res) {
	var result = collection.experimental(
		req.body.queryLocation,
		req.body.relevanceLocation,
		req.body.A,
		req.body.tops,
		req.body.topn,
		req.body.USD,
		req.body.UQE
	);
	res.render('resultex', {
		result : result
	});
});

router.get('/interactive', function(req, res) {
	res.render('interactive');
});

router.post('/runin', function(req, res) {
	query = req.body.query;
	a = req.body.A;
	tops = req.body.tops;
	topn = req.body.topn;
	usd = req.body.USD;
	uqe = req.body.UQE;
	result = collection.interactive(query, tops);
	res.render('resultin', {
		result : result
	});
	console.log(req.body);
});

router.post('/runin2', function(req, res) {
	result = collection.interactive2(query, req.body.relevant, a, tops, topn, usd, uqe);
	res.render('resultin2', {
		query : query,
		result : result
	});
});

router.get('/help', function(req, res) {
	res.render('help');
});

module.exports = router;