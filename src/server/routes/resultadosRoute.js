const leituraArquivo = require('../utils/leituraArquivo')

module.exports = app => {

	app.post('/resultados', async (req, res) => {

		const arquivoFormatado = await leituraArquivo(req)
		const pilotos = arquivoFormatado.pilotos
		const melhorVolta = arquivoFormatado.melhorVolta

		res.status(200)
		res.render('resultados', {
			pilotos: pilotos,
			melhorVolta: melhorVolta
		})
	})
}