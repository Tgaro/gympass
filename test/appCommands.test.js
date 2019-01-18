const chai = require('chai')
const leituraArquivo = require('../src/server/application/commands/leituraArquivo')
const classificaPilotos = require('../src/server/application/commands/classificaPilotos')
const expect = chai.expect
let obj = {}
let info = {}

describe('Valida funções da aplicação', () => {

	it('Deve ler o arquivo corretamente', async () => {

		obj ={
			name: 'gympassExample.txt',
			path: './testFiles/gympassExample.txt'
		}
		info = await leituraArquivo.percorreArquivo(obj)
		expect(info.melhorVolta.tempo).to.equal('1:02.769')
		expect(info.melhorVolta.codPiloto).to.equal('038')
		expect(info.melhorVolta.nomePiloto).to.equal('F.MASSA')
		expect(info.melhorVolta.volta).to.equal('3')
		expect(info.erroArquivo).to.equal('')
		expect(info.tabelaArquivo.length).to.equal(23)
		expect(info.listaPilotos.length).to.equal(6)
	})


	it('Deve ler o arquivo e retornar erro na linha 3', async () => {

		obj ={
			name: 'gympassExample_erro.txt',
			path: './testFiles/gympassExample_erro.txt'
		}
		info = await leituraArquivo.percorreArquivo(obj)
		expect(info.melhorVolta.tempo).to.equal('1:02.769')
		expect(info.melhorVolta.codPiloto).to.equal('038')
		expect(info.melhorVolta.nomePiloto).to.equal('F.MASSA')
		expect(info.melhorVolta.volta).to.equal('3')
		expect(info.erroArquivo).to.equal('Linha 3 descartada por falha no formato. \n')
		expect(info.tabelaArquivo.length).to.equal(22)
		expect(info.listaPilotos.length).to.equal(6)
	})


	it('Deve ler o arquivo e retornar erro de falta de informações', async () => {

		obj ={
			name: 'gympassExample_semRegistro.txt',
			path: './testFiles/gympassExample_semRegistro.txt'
		}
		info = await leituraArquivo.percorreArquivo(obj)
		expect(info.melhorVolta.tempo).to.equal(null)
		expect(info.melhorVolta.codPiloto).to.equal(null)
		expect(info.melhorVolta.nomePiloto).to.equal(null)
		expect(info.melhorVolta.volta).to.equal(null)
		expect(info.erroArquivo).to.equal('O arquivo deve conter mais de uma linha contando com o cabeçalho.')
		expect(info.tabelaArquivo.length).to.equal(0)
		expect(info.listaPilotos.length).to.equal(0)
	})


	it('Deve classificar 6 pilotos corretamente', async () => {

		obj ={
			name: 'gympassExample.txt',
			path: './testFiles/gympassExample.txt'
		}
		info = await leituraArquivo.percorreArquivo(obj)
		const resultado = await classificaPilotos(info.tabelaArquivo, info.listaPilotos)
		expect(resultado.length).to.equal(6)
		expect(resultado[0].codPiloto).to.equal('038')
		expect(resultado[5].codPiloto).to.equal('011')
	})

	it('Deve classificar 5 pilotos corretamente', async () => {

		obj ={
			name: 'gympassExample2.txt',
			path: './testFiles/gympassExample2.txt'
		}
		info = await leituraArquivo.percorreArquivo(obj)
		const resultado = await classificaPilotos(info.tabelaArquivo, info.listaPilotos)
		expect(resultado.length).to.equal(5)
		expect(resultado[0].codPiloto).to.equal('032')
		expect(resultado[4].codPiloto).to.equal('011')
	})

	it('Deve classificar nenhum piloto', async () => {

		obj ={
			name: 'gympassExample_semRegistro.txt',
			path: './testFiles/gympassExample_semRegistro.txt'
		}
		info = await leituraArquivo.percorreArquivo(obj)
		const resultado = await classificaPilotos(info.tabelaArquivo, info.listaPilotos)
		expect(resultado.length).to.equal(0)
	})

})