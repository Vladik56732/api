import { Router } from 'express'

export const router = Router()

let products = [
    {
        id: 1,
        name: 'apple',
        hours: 50,
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

//get all
router.get('/', (req, res) => {
    console.log(req.query)
    const { min, max } = req.query

    const filteredProducts = products.filter(product => {
        if (min && max) {
            return max >= product.hours && product.hours >= min
        }

        if (min) {
            return product.hours >= min
        }

        if (max) {
            return max >= product.hours
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
router.get('/:id', (req, res) => {
    const { id } = req.params

    const product = products.find(elem => elem.id == id)

    if (!product) {
        return res
            .status(404)
            .json({ message: ` Product with id:${id} not found` })
    }

    return res.json(product)
})
//delete
router.delete('/:id', (req, res) => {
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
//update
router.patch('/:id', (req, res) => {
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
//create
router.post('/', (req, res) => {
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
