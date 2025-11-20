import {app} from './app.js'
import {env} from './env/index.js'



app.listen({
    port: env.PORT
}).then(() => {
    console.log('Server rodando na porta:' + env.PORT)
})




