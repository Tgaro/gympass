const fs = require('fs')
const formidable = require('formidable')
const classificaPilotos = require('./classificaPilotos')
const trabalhaArquivo = require('./trabalhaArquivo')

module.exports = async req => {
	
	let histArquivo
	let caminhoArquivo
	let erroArquivo = null
	let melhorVolta
	let pilotos
	//captura arquivos que foi feito upload no formulário
	const result = await getFiles(req)
		.then(async result => {
			//salva arquivo que foi feito o upload localmente
			const save = await saveFile(result)
			return result
		})
		.catch(error => console.log(error))

	const nomeArquivo = result.files.filetoupload.name
	histArquivo = `./src/server/application/files/old/${nomeArquivo.split('.')[0]}_${new Date().getMinutes()}${new Date().getSeconds()}.${nomeArquivo.split('.')[1]}`
	caminhoArquivo = `./src/server/application/files/${nomeArquivo}`

	const data = fs.readFileSync(caminhoArquivo, 'utf8')
	const linhas = data.split('\n')
	await fs.rename(caminhoArquivo, histArquivo, () => {})

	console.log(linhas)
	//Se houver somente 1 linha no arquivo (cabeçalho) a leitura não será realizada
	if(linhas.length <= 1){

		erroArquivo = 'O arquivo deve conter mais de uma linha contando com o cabeçalho'
		pilotos = []
		melhorVolta = {
			tempo: null,
			codPiloto: null,
			nomePiloto: null,
			volta: null
		}
		return {pilotos, melhorVolta, erroArquivo}
	}
	else {
		//realiza leitura e tratamento do arquivo
		const infoCorrida = await trabalhaArquivo(linhas)
		melhorVolta = infoCorrida.melhorVolta
		erroArquivo = infoCorrida.msgErro
		pilotos = await classificaPilotos(infoCorrida.arr, infoCorrida.codPilotos)
		return {pilotos, melhorVolta, erroArquivo}
	}
}

const getFiles = req => {

	return new Promise((resolve, reject) => {

		const form = new formidable.IncomingForm()
		form.parse(req, (err, fields, files) => {

			if (err) 
				return reject(err)
      		resolve({ fields: fields, files: files })
			return 1
		})
	})
}
//salva arquivo localmente
const saveFile = result => {

	return new Promise((resolve, reject) => {

		fs.rename(result.files.filetoupload.path, `./src/server/application/files/${result.files.filetoupload.name}`, (err) => {

			if(!err){

				fs.statSync(`./src/server/application/files/${result.files.filetoupload.name}`)
				console.log('....');
				resolve(console.log('arquivo salvo'))
			}
			else
				reject(err)
		})
	})
}