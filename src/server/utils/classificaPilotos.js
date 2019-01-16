module.exports = (arr, codPilotos) => {

	let pilotos = []
	for(let i = 0; i < codPilotos.length; i++){

		const piloto = arr.filter(item => codPilotos[i] == item.codPiloto)
		pilotos.push(geraInfoPiloto(piloto))
	}

	pilotos = geraPodium(pilotos)
	return pilotos
}

const geraInfoPiloto = piloto => {

	let melhorVolta = '59:59.999'
	let chegada = null
	let inicio = null
	let voltas = 0
	let velocidadeMedia = 0.0000
	let pilotos = {}

	for(let i = 0; i < piloto.length; i++){

		if(melhorVolta > piloto[i].tempoVolta)
			melhorVolta = piloto[i].tempoVolta
		if(voltas < piloto[i].volta){

			voltas = piloto[i].volta
			chegada = piloto[i].hora
		}
		if(piloto[i].volta == 1)
			inicio = piloto[i].hora

		velocidadeMedia += parseFloat((piloto[i].velocidade).replace(',', '.'))
	}

	velocidadeMedia = parseFloat(velocidadeMedia / piloto.length).toFixed(3)

	pilotos = {
		codPiloto: piloto[0].codPiloto,
		nomePiloto: piloto[0].nomePiloto,
		voltas: voltas,
		chegada: chegada,
		melhorVolta: melhorVolta,
		velocidadeMedia: velocidadeMedia,
		diferenca: null,
		tempoDeProva: diferencaHora(inicio, chegada)
	}

	return pilotos
}

const geraPodium = pilotos => {

	let posicao = 0
	pilotos.sort((a,b) => {
		if (a.chegada < b.chegada)
			return -1
		if (a.chegada > b.chegada)
			return 1
		return 0
	})

	for(let i = 0; i < pilotos.length; i++){

		pilotos[i].posicao = i+1
		if(i == 0)
			pilotos[i].diferenca = 0
		else
			pilotos[i].diferenca = diferencaHora(pilotos[0].chegada, pilotos[i].chegada)
	}

	return(pilotos)
}

const diferencaHora = (inicio, fim) => {
   
	const options = { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' , ms: 'numeric',  hour12: false}
	const dif = new Date(Date.parse(`01/01/1999 ${fim}`, 'dd/MM/yyyy hh:mm:ss.sss') - Date.parse(`01/01/1999 ${inicio}`, 'dd/MM/yyyy hh:mm:ss.sss'))

	return `+${Intl.DateTimeFormat('en-US', options).format(dif)}.${dif.getMilliseconds()}`
}
