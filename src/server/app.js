const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('./src/client/public'))
app.set('view engine', 'ejs')
app.set('views', './src/client/views')

consign()
	.include('./src/server/routes')
	.into(app)

app.use((req, res) => {
    res.status(404).send('O endereço que você está procurando não existe');
})

module.exports = app