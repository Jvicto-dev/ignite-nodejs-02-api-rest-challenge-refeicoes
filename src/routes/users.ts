import type { FastifyInstance } from 'fastify'


export async function usersRoutes(app: FastifyInstance){
    app.get('/', (request, replay)=>{
        console.log("Deu certo")
    })
}