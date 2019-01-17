const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
chai.use(chaiHttp)

describe('Realiza testes de roteamento', function() {

    it('Deve realizar o POST no endereço /resultados', function(done) {
        chai
            .request(server)
            .post('/resultados')
            .set('content-type', 'application/x-www-form-urlencoded')
            .attach('filetoupload', './testFiles/gympassExample.txt')
            .end((err, res) => {
                
                res.should.have.status(200)
                done()
            })
    })

    it('Deve realizar o GET no endereço /home', function(done) {
        chai
            .request(server)
            .get('/home')
            .end((err, res) => {
                
                res.should.have.status(200)
                done()
            })
    })

    it('Deve realizar o GET no endereço /', function(done) {
        chai
            .request(server)
            .get('/')
            .end((err, res) => {
                
                res.should.have.status(200)
                done()
            })
    })

    it('Deve realizar o GET no endereço /carregaArquivo', function(done) {
        chai
            .request(server)
            .get('/carregaArquivo')
            .end((err, res) => {
                
                res.should.have.status(200)
                done()
            })
    })

    it('Deve realizar o GET no endereço /resultados', function(done) {
        chai
            .request(server)
            .get('/resultados')
            .end((err, res) => {
                
                res.should.have.status(200)
                done()
            })
    })

    it('Deve retornar 404 ao dar GET em um endereço inválido', function(done) {
        chai
            .request(server)
            .get('/outro')
            .end((err, res) => {
                
                res.should.have.status(404)
                done()
            })
    })
})