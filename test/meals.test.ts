import { expect, it, test, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../src/app.js'
import request from 'supertest'
import { execSync } from 'node:child_process'



describe('Rotas das refeições', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('usuário pode cadastrar uma refeição', async () => {
        const createMealResponse = await request(app.server)
            .post('/meals')
            .send({
                name: 'Lanche',
                description: "Bolo",
                is_on_diet: true,
                "date": "2025-11-21"
            })

        const cookies = createMealResponse.get('Set-Cookie')

        console.log(cookies)


    })
})

