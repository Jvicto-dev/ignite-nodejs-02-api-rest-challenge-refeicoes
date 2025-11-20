import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users.js'
import { mealsRoutes } from './routes/meals.js'
export const app = fastify()

// cookies
app.register(cookie)

// Rotas de usuários
app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })