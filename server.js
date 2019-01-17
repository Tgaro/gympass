const app = require('./src/server/app')
const port = process.env.PORT || 3030
const server = app.listen(port, () => console.log(`Servidor ativo na porta ${port}`))