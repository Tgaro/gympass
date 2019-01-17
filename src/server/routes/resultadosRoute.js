const leituraArquivo = require('../application/commands/leituraArquivo')
const classificaPilotos = require('../application/commands/classificaPilotos')

module.exports = app => {

	app.post('/resultados', async (req, res) => {

		const arquivoFormatado = await leituraArquivo.realizaLeitura(req)
		const pilotos = await classificaPilotos(arquivoFormatado.tabelaArquivo, arquivoFormatado.listaPilotos)
		const melhorVolta = arquivoFormatado.melhorVolta
		const msgErro = arquivoFormatado.erroArquivo

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