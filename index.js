import express from 'express'

const app = express()
app.use(express.json())

let products = [
    {
        id: 1,
        name: 'apple',
        count: 50,
        price: 2,
    },
    {
        id: 2,
        name: 'pineapple',
        count: 20,
        price: 10,
    },
    {
        id: 3,
        name: 'grape',
        count: 100,
        price: 3,
    },
]
//read
app.get('/products', (req, res) => {
    console.log(req.query)
    const { min, max } = req.query

    const filteredProducts = products.filter(product => {
        if (min && max) {
            return max >= product.count && product.count >= min
        }

        if (min) {
            return product.count >= min
        }

        if (max) {
            return max >= product.count
        }

        return true
    })

    const { sortBy, sortOrder } = req.query
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOrder == 'desc') {
            if (sortBy) {
                return b[sortBy] - a[sortBy]
            }
            return b.name.localeCompare(a.name)
        }

        if (sortBy) {
            return a[sortBy] - b[sortBy]
        }
        return a.name.localeCompare(b.name)
    })

    return res.json(sortedProducts)
})
//get
app.get('/products/:id', (req, res) => {
    const { id } = req.params

    const product = products.find(elem => elem.id == id)

    if (!product) {
        return res
            .status(404)
            .json({ message: ` Product with id:${id} not found` })
    }

    return res.json(product)
})

app.delete('/products/:id', (req, res) => {
    const { id } = req.params

    const product = products.find(elem => elem.id == id)

    if (!product) {
        return res
            .status(404)
            .json({ message: ` Product with id:${id} not found` })
    }

    products = products.filter(elem => elem.id != id)

    return res.json(products)
})

app.patch('/products/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body
    console.log(req.body)
    if (!name) {
        return res.status(401).json({ message: ` Invalid name` })
    }
    const product = products.find(elem => elem.id == id)

    if (!product) {
        return res
            .status(404)
            .json({ message: ` Product with id:${id} not found` })
    }

    product.name = name
    products = products.map(elem => {
        if (elem.id == id) {
            return { ...elem, name }
        }
        return elem
    })
    return res.json(product)
})

app.post('/products', (req, res) => {
    const { name, count, price } = req.body
    const product = {
        id: products.length + 1,
        name,
        count,
        price,
    }

    products.push(product)
    return res.json(product)
})

app.listen(3000, 'localhost', () => {
    console.log('Сервер запущен на http://localhost:3000')
})
