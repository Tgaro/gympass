module.exports = app => {

	app.get('/carregaArquivo', (req, res) => {

		res.status(200)
		res.render('carregaArquivo')
	})
}