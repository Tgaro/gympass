module.exports = app => {

	app.get('/home', (req, res) => {

		res.status(200)
		res.render('index')
	})

	app.get('/', (req, res) => {

		res.redirect('/home')
	})
}