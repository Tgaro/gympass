const fs = require('fs')
const formidable = require('formidable')
const classificaPilotos = require('./classificaPilotos')
const patterns = {
	hora: /^\d{2}\:\d{2}\:\d{2}\.\d{3}/g,
	codPiloto: /(\s\d{3}\s)/g,
	nomePiloto: /\s[a-zA-Z]\.?[a-zA-Z]*\s/g,
	volta: /(\s\d\s)/g,
	tempoVolta: /\s\d\:\d{2}\.\d{3}/g,
	velocidade: /\s\d*,\d*/g,
	repl: /\/\t/g
}

module.exports = async req => {
	
	let histArquivo
	let caminhoArquivo

	const result = await getFiles(req)
		.then(async result => {

			await saveFile(result)
			return result
		})
		.catch(error => console.log(error))

	const nomeArquivo = result.files.filetoupload.name
	histArquivo = `./src/server/files/old/${nomeArquivo.split('.')[0]}_${new Date().getMinutes()}${new Date().getSeconds()}.${nomeArquivo.split('.')[1]}`
	caminhoArquivo = `./src/server/files/${result.files.filetoupload.name}`

	const data = fs.readFileSync(caminhoArquivo, 'utf8')
	const linhas = data.split('\n')
	await fs.rename(caminhoArquivo, histArquivo, () => {})

	const infoCorrida = await trabalhaArquivo(linhas)
	const melhorVolta = infoCorrida.melhorVolta
	const pilotos = await classificaPilotos(infoCorrida.arr, infoCorrida.codPilotos)

	return {pilotos, melhorVolta}
}

const getFiles = req => {

	return new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, files) => {

			if (err) 
				return reject(err)
      		resolve({ fields: fields, files: files })
			return 1
		})
	})
}

const saveFile = result => {

	return new Promise((resolve, reject) => {

		fs.rename(result.files.filetoupload.path, `./src/server/files/${result.files.filetoupload.name}`, (err) => {

			if(!err){

				//console.log(fs.statSync(result.files.filetoupload.path));
				fs.statSync(`./src/server/files/${result.files.filetoupload.name}`)
				console.log('....');
				resolve(console.log('arquivo salvo'))
			}
			else
				reject(err)
		})
	})
}

const trabalhaArquivo = linhas => {

	let arr = []
	let codPilotos = []
	let melhorVolta = {
		tempo: '59:59.999'
	}

	for (let i = 1; i < linhas.length; i++){

		let volta = linhas[i].match(patterns.volta)[0].replace(patterns.repl, '').trim()
		let codPiloto = linhas[i].match(patterns.codPiloto)[0].replace(patterns.repl, '').trim()
		let nomePiloto = linhas[i].match(patterns.nomePiloto)[0].replace(patterns.repl, '').trim()
		let hora = linhas[i].match(patterns.hora)[0].replace(patterns.repl, '').trim()
		let tempoVolta = linhas[i].match(patterns.tempoVolta)[0].replace(patterns.repl, '').trim()
		let velocidade = linhas[i].match(patterns.velocidade)[0].replace(patterns.repl, '').trim()

		arr.push({
			codPiloto: codPiloto,
			nomePiloto: nomePiloto, 
			hora: hora, 
			volta: volta, 
			tempoVolta: tempoVolta, 
			velocidade: velocidade
		})

		codPilotos.push(codPiloto)

		if(melhorVolta.tempo > tempoVolta){

			melhorVolta.tempo = tempoVolta
			melhorVolta.codPiloto = codPiloto
			melhorVolta.nomePiloto = nomePiloto
		}
	}

	codPilotos = codPilotos.filter((item, pos) => {

		return codPilotos.indexOf(item) == pos
	})

	return({arr, codPilotos, melhorVolta})
}