import { expect, it, test, describe, beforeAll, beforeEach, afterAll } from 'vitest'
import { app } from '../src/app.js'
import request from 'supertest'
import { execSync } from 'node:child_process'




describe('Rotas do usuário', () => {

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

    it('pode cadastrar um usuário', async () => {
        const response = await request(app.server)
            .post('/users')
            .send({
                name: 'João victo',
                email: "teste2@gmail.com"
            })

        expect(response.statusCode).toEqual(201)
    })
})

