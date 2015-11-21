var express = require('express');
var Collection = require('../lib/Collection');

var router = express.Router();
var collection = new Collection();

router.get('/home', function(req, res) {
	res.render('home');
});

router.post('/indexing', function(req, res) {
	collection.createInvertedFile(
		req.body.documentLocation,
		req.body.stopwordLocation,
		'option2',
		'option2',
		'option2'
	);
	res.redirect('/home');
});

module.exports = router;