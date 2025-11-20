import type { FastifyInstance } from 'fastify'
import { db as knex } from '../database.js'

export async function usersRoutes(app: FastifyInstance) {
    app.get('/', (request, replay) => {
        console.log("Deu certo")
    })
}