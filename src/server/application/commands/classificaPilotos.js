module.exports = (tabelaArquivo, listaPilotos) => {

	let pilotos = []
	//percorre todos os códigos de piloto do arquivo e gera as informações
	for(let i = 0; i < listaPilotos.length; i++){

		const piloto = tabelaArquivo.filter(item => listaPilotos[i] == item.codPiloto)
		pilotos.push(geraInfoPiloto(piloto))
	}
	//adiciona a posição do piloto e diferença de chegada do primeiro para os demais
	pilotos = geraPodium(pilotos)
	return pilotos
}
//Função para gerar as informações de chegada, melhor volta, quantidades de volta de um piloto.
const geraInfoPiloto = piloto => {
	// declaração das variáveis
	let melhorVolta = '59:59.999'
	let chegada = null
	let inicio = null
	let voltas = 0
	let velocidadeMedia = 0.0000
	let infoPiloto = {}
	let menorVolta = Number.MAX_SAFE_INTEGER

	//percorre linhas do piloto para coletar informações de melhor volta, chegada, etc.
	for(let i = 0; i < piloto.length; i++){

		if(Date.parse(`01/01/1999 00:${melhorVolta}`) > Date.parse(`01/01/1999 00:${piloto[i].tempoVolta}`)){

			melhorVolta = piloto[i].tempoVolta
		}

		if(voltas < parseInt(piloto[i].volta)){

			voltas = piloto[i].volta
			chegada = piloto[i].hora
		}
		if(piloto[i].volta < menorVolta){

			inicio = piloto[i].hora
			menorVolta = piloto[i].volta
		}

		velocidadeMedia += parseFloat((piloto[i].velocidade).replace(',', '.'))
	}
	//calculo da velocidade média
	velocidadeMedia = parseFloat(velocidadeMedia / piloto.length).toFixed(3)
	
	//gera informação do piloto consolidada - Informações de chegada
	infoPiloto = {
		codPiloto: piloto[0].codPiloto,
		nomePiloto: piloto[0].nomePiloto,
		voltas: voltas,
		chegada: chegada,
		melhorVolta: melhorVolta,
		velocidadeMedia: velocidadeMedia,
		diferenca: null,
		tempoDeProva: diferencaHora(inicio, chegada)
	}

	return infoPiloto
}

const geraPodium = pilotos => {

	//ordena os pilotos por ordem de chegada
	// pilotos.sort((a,b) => {
	// 	if(a.voltas < b.voltas)
	// 		return -1
	// 	if(a.voltas > b.voltas)
	// 		return 1
	// 	return 0
	// })

	pilotos.sort(function (a, b) {
		return b.voltas - a.voltas || Date.parse(`01/01/1999 ${a.chegada}`, 'dd/MM/yyyy hh:mm:ss.sss') - Date.parse(`01/01/1999 ${b.chegada}`, 'dd/MM/yyyy hh:mm:ss.sss')
	})

	// pilotos.sort((a,b) => {
	// 	if (Date.parse(`01/01/1999 ${a.chegada}`, 'dd/MM/yyyy hh:mm:ss.sss') < Date.parse(`01/01/1999 ${b.chegada}`, 'dd/MM/yyyy hh:mm:ss.sss'))
	// 		return -1
	// 	if (Date.parse(`01/01/1999 ${a.chegada}`, 'dd/MM/yyyy hh:mm:ss.sss') > Date.parse(`01/01/1999 ${b.chegada}`, 'dd/MM/yyyy hh:mm:ss.sss'))
	// 		return 1
	// 	return 0
	// })

	//adiciona a informação da posição dos pilotos que estão ordenados e a distancia de cada um para o primeiro colocado
	for(let i = 0; i < pilotos.length; i++){

		pilotos[i].posicao = i+1
		if(i == 0)
			pilotos[i].diferenca = 0
		else
			pilotos[i].diferenca = diferencaHora(pilotos[0].chegada, pilotos[i].chegada)
	}

	return(pilotos)
}

//Função que realiza a diferença das horas
const diferencaHora = (inicio, fim) => {
   
	const options = { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' , ms: 'numeric',  hour12: false}
	const dif = new Date(Date.parse(`01/01/1999 ${fim}`, 'dd/MM/yyyy hh:mm:ss.sss') - Date.parse(`01/01/1999 ${inicio}`, 'dd/MM/yyyy hh:mm:ss.sss'))

	return `+${Intl.DateTimeFormat('en-US', options).format(dif)}.${dif.getMilliseconds()}`
}
