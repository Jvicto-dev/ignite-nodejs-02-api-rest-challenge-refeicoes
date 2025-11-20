import type { FastifyInstance } from 'fastify'
import { db as knex } from '../database.js'
import { z } from 'zod'
import crypto from 'node:crypto'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js'

export async function mealsRoutes(app: FastifyInstance) {

    // Criar uma refeição
    app.post('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {

        const createMealsSchema = z.object({
            name: z.string(),
            description: z.string(),
            is_on_diet: z.boolean(),
            date: z.string().transform(d => new Date(d))
        })

        const { name, description, is_on_diet, date } = createMealsSchema.parse(request.body)

        await knex('meals').insert({
            id: crypto.randomUUID(),
            user_id: request.user.id, // <-- AJUSTADO
            name,
            description,
            is_on_diet,
            date
        })

        return reply.status(201).send()
    })


    app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        await knex('meals').where({
            id,
            user_id: request.user.id
        }).delete()

        return reply.status(200).send({ message: "Refeição apagada com sucesso" })

    })


    app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {

        const meals = await knex('meals')
            .where({
                user_id: request.user.id
            })
            .select('*')

        return { meals }
    })

    app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {

        const mealsSchema = z.object({
            id: z.string()
        })

        const { id } = mealsSchema.parse(request.params)

        const getOneMeal = await knex('meals')
            .where({
                id
            }).select()



        return { getOneMeal }
    })

    // Criar uma refeição
    app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {

        const createMealsSchema = z.object({
            name: z.string(),
            description: z.string(),
            is_on_diet: z.boolean(),
            date: z.string().transform(d => new Date(d))
        })

        const mealsSchema = z.object({
            id: z.string()
        })

        const { id } = mealsSchema.parse(request.params)

        const { name, description, is_on_diet, date } = createMealsSchema.parse(request.body)

        await knex('meals')
            .where({
                id: id,
                user_id: request.user.id
            })
            .update({
                name,
                description,
                is_on_diet,
                date
            })

        return reply.status(200).send({
            message: 'refeição atualizada com sucesso !!'
        })
    })

    app.get('/metrics', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const meals = await knex('meals')
            .where({ user_id: request.user.id })
            .select('*')
            .orderBy('date', 'asc') 

        const totalMeals = meals.length

        const totalOnDiet = meals.filter(m => m.is_on_diet === true).length
        const totalOffDiet = meals.filter(m => m.is_on_diet === false).length

        // Melhor sequência dentro da dieta:
        let bestSequence = 0
        let currentSequence = 0

        for (const meal of meals) {
            if (meal.is_on_diet) {
                currentSequence++
                if (currentSequence > bestSequence) {
                    bestSequence = currentSequence
                }
            } else {
                currentSequence = 0
            }
        }

        return reply.send({
            totalMeals,
            totalOnDiet,
            totalOffDiet,
            bestSequence
        })
    })


}
