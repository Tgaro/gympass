const patterns = {
	hora: /^\d{2}\:\d{2}\:\d{2}\.\d{3}/g,
	codPiloto: /(\s\d{3}\s)/g,
	nomePiloto: /\s[a-zA-Z]\.?[a-zA-Z]*\s/g,
	volta: /(\s\d\s)/g,
	tempoVolta: /\s\d\:\d{2}\.\d{3}/g,
	velocidade: /\s\d*,\d*/g,
	repl: /\/\t/g
}

module.exports = linhas => {

	let arr = []
	let codPilotos = []
	let melhorVolta = {
		tempo: '59:59.999'
	}
	let msgErro = ''

	for (let i = 1; i < linhas.length; i++){

		try{
			//Através de expressões regulares, lê cada linha do arquivo e busca os valores no padrão definido
			let volta = linhas[i].match(patterns.volta)[0].replace(patterns.repl, '').trim()
			let codPiloto = linhas[i].match(patterns.codPiloto)[0].replace(patterns.repl, '').trim()
			let nomePiloto = linhas[i].match(patterns.nomePiloto)[0].replace(patterns.repl, '').trim()
			let hora = linhas[i].match(patterns.hora)[0].replace(patterns.repl, '').trim()
			let tempoVolta = linhas[i].match(patterns.tempoVolta)[0].replace(patterns.repl, '').trim()
			let velocidade = linhas[i].match(patterns.velocidade)[0].replace(patterns.repl, '').trim()

			//Popula um array de objetos com os dados do arquivo
			arr.push({
				codPiloto: codPiloto,
				nomePiloto: nomePiloto, 
				hora: hora, 
				volta: volta, 
				tempoVolta: tempoVolta, 
				velocidade: velocidade
			})
			//Gera array só com o código dos pilotos
			codPilotos.push(codPiloto)

			//Salva inofrmações sobre a melhor volta da corrida
			if(melhorVolta.tempo > tempoVolta){

				melhorVolta.tempo = tempoVolta
				melhorVolta.codPiloto = codPiloto
				melhorVolta.nomePiloto = nomePiloto
				melhorVolta.volta = volta
			}
		}catch(e){
			msgErro += `Linha ${i+1} descartada por falha no formato. \n`
			console.log(`Erro na linha ${i+1} do arquivo: ${e}`)
		}
	}
	//remove códigos de piloto do array que estão duplicados
	codPilotos = codPilotos.filter((item, pos) => {

		return codPilotos.indexOf(item) == pos
	})

	return({arr, codPilotos, melhorVolta, msgErro})
}