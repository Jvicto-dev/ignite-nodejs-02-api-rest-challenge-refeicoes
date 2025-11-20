import { z } from 'zod'
import {config} from 'dotenv'


if(process.env.NODE_ENV === 'test'){
    config({
        path: '.env.test'
    })
}else{
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
})


const _env = envSchema.safeParse(process.env)


if(_env.success === false){
    console.log("variaveis de ambiente invalidas", _env.error.format())
    throw new Error('variaveis de ambiente invalidas')
}

export const env = _env.data