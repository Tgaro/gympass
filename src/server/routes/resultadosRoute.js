const leituraArquivo = require('../application/commands/leituraArquivo')

module.exports = app => {

	app.post('/resultados', async (req, res) => {

		const arquivoFormatado = await leituraArquivo(req)
		const pilotos = arquivoFormatado.pilotos
		const melhorVolta = arquivoFormatado.melhorVolta
		const msgErro = arquivoFormatado.erroArquivo
		console.log('erro', msgErro)
		res.status(200)
		res.render('resultados', {
			pilotos: pilotos,
			melhorVolta: melhorVolta,
			msgErro: msgErro
		})
	})

	app.get('/resultados', (req, res) => {

		res.status(200)
		res.redirect('/carregaArquivo')
	})
}