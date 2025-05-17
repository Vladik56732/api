import express from 'express'
import cors from 'cors'

import { router as productsRouter } from './products.js'
import { router as usersRouter } from './users.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/products', productsRouter)
app.use('/users', usersRouter)

app.listen(3000, 'localhost', () => {
    console.log('Сервер запущен на http://localhost:3000')
})
