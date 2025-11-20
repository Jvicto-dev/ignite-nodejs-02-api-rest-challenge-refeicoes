import type { FastifyInstance } from 'fastify'
import { db as knex } from '../database.js'
import { z } from 'zod'
import crypto from 'node:crypto'


export async function usersRoutes(app: FastifyInstance) {

    // Criar um usuário
    app.post('/', async (request, replay) => {
        const createUserSchema = z.object({
            name: z.string(),
            email: z.string()
        })

        const { name, email } = createUserSchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = crypto.randomUUID(),
                replay.cookie('sessionId', sessionId, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7 // 7 dias
                })
        }

        const userEmail = await knex('users').where({ email }).select('*')

        if (userEmail.length > 0) {
            return replay.status(401).send({message: 'usuário já existe'})
        }


        await knex('users').insert({
            id: crypto.randomUUID(),
            name,
            email,
            session_id: sessionId
        })

        return replay.status(201).send()

    })
}