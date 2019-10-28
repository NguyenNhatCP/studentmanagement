var express = require('express');
var authController = require('../controllers/auth.controller');
var router = express.Router();

router.get('/login', authController.indexLogin);

router.post('/login', async (req, res) => {
	var pageData = {
		title: 'Login'
	};
	var errors = [];
	let { Sid, Password } = req.body;
	try {
		let foundUser = await authController.login(Sid, Password)
		res.cookie('userId', foundUser._id, {
			signed: true
		});
		res.cookie('tokenKey',foundUser.tokenKey)
		if (foundUser.Permission == 'admin') {
			res.redirect('/admin');
		}
		else {
			res.redirect('/');
		}
		res.end();
	} catch (error) {
		errors.push(`${error}`);
		if (errors.length) {
			res.render('auth/login', {
				pageData: pageData,
				errors: errors,
				values: req.body
			});
			return;
		}
	}
})
router.get('/jwtTest', async (req, res) => {
	let tokenKey = req.body.token || req.headers['x-access-token']
	try {
		//Verify token
		await authController.verifyJWT(tokenKey)
		res.status(200).send({
			result: 1,
			message: 'Verify Json Web Token successully',
		})
	} catch (error) {
		res.status(401).send({
			result: 0,
			message: `Error check token : ${error}`
		})
	}
})

module.exports = router;
