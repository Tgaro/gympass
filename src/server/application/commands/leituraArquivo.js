const fs = require('fs')
const formidable = require('formidable')
const classificaPilotos = require('./classificaPilotos')
const trabalhaArquivo = require('./trabalhaArquivo')

const realizaLeitura = async req => {
	
	//captura arquivos que foi feito upload no formulário
	let leitura
	let result

	result = await capturaArquivo(req)
		.then(async result => {
			return result
		})

	leitura = await percorreArquivo(result.files.filetoupload)

	return leitura
}

const capturaArquivo = req => {

	return new Promise((resolve, reject) => {

		const form = new formidable.IncomingForm()
		form.parse(req, (err, fields, files) => {

      		resolve({ files: files })
			return 1
		})	
	})
}

const percorreArquivo = async (obj) => {

	let histArquivo
	let caminhoArquivo
	let erroArquivo = null
	let melhorVolta
	let tabelaArquivo
	let listaPilotos
	const nomeArquivo = obj.name

	//salva arquivo que foi feito o upload localmente
	await copiaArquivo(obj)

	histArquivo = `./src/server/application/files/old/${nomeArquivo.split('.')[0]}_${new Date().getMinutes()}${new Date().getSeconds()}.${nomeArquivo.split('.')[1]}`
	caminhoArquivo = `./src/server/application/files/${nomeArquivo}`

	const data = fs.readFileSync(caminhoArquivo, 'utf8')
	const linhas = data.split('\n')
	await fs.rename(caminhoArquivo, histArquivo, () => {})

	//Se houver somente 1 linha no arquivo (cabeçalho) a leitura não será realizada
	if(linhas.length <= 1){

		erroArquivo = 'O arquivo deve conter mais de uma linha contando com o cabeçalho.'
		tabelaArquivo = []
		listaPilotos = []
		melhorVolta = {
			tempo: null,
			codPiloto: null,
			nomePiloto: null,
			volta: null
		}
		return {tabelaArquivo, listaPilotos, melhorVolta, erroArquivo}
	}
	else {
		//realiza leitura e tratamento do arquivo
		const infoCorrida = await trabalhaArquivo(linhas)
		melhorVolta = infoCorrida.melhorVolta
		erroArquivo = infoCorrida.msgErro
		tabelaArquivo = infoCorrida.arr
		listaPilotos = infoCorrida.codPilotos
		
		return {tabelaArquivo, listaPilotos, melhorVolta, erroArquivo}
	}
}
//salva arquivo localmente
const copiaArquivo = obj => {

	return new Promise((resolve, reject) => {

		fs.copyFile(obj.path, `./src/server/application/files/${obj.name}`, (err) => {

			fs.statSync(`./src/server/application/files/${obj.name}`)
			resolve(console.log('Arquivo copiado'))
		})
	})
}

module.exports = {percorreArquivo, realizaLeitura, copiaArquivo}