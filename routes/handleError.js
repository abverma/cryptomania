exports.showErrorPage = (req, res, errorCode) => {

	if (errorCode === 500) {
		res.status(500);
		res.type('html');
		res.render('error', {
			'errorCode': 500, 
			'errorDesc': 'Server Error', 
			'errorMessage': 'Oops! This one is on us. Our minios are working on it.'
		});
	}
	else if (errorCode === 404) {
		res.type('html');
		res.status(404);
		res.render('error', {
			'errorCode': 404, 
			'errorDesc': 'Page not found', 
			'errorMessage': 'Oh Snap! Looks like you seek more than what we have.'
		});
	}
	
}