import { Router } from 'express'

export const router = Router()

let users = [
    {
        id: 1,
        name: 'Vasya777',
        hours: 105,
        friends: 4,
    },
    {
        id: 2,
        name: 'FreonX2022',
        hours: 20,
        friends: 10,
    },
    {
        id: 3,
        name: 'SuperUltraPro',
        hours: 1000,
        friends: 1,
    },
]

//read
router.get('/', (req, res) => {
    console.log(req.query)

    const { name } = req.query
    if (name && name != '') {
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(name.toLowerCase())
        )
        return res.json(filteredUsers)
    }
    const { min, max } = req.query

    const filteredUsers = users.filter(user => {
        if (min && max) {
            return max >= user.hours && user.hours >= min
        }

        if (min) {
            return user.hours >= min
        }

        if (max) {
            return max >= user.hours
        }

        return true
    })

    const { sortBy, sortOrder } = req.query
    const sortedUsers = filteredUsers.sort((a, b) => {
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

    return res.json(sortedUsers)
})
//get
router.get('/:id', (req, res) => {
    const { id } = req.params

    const user = users.find(elem => elem.id == id)

    if (!user) {
        return res
            .status(404)
            .json({ message: ` User with id:${id} not found` })
    }

    return res.json(user)
})

router.delete('/:id', (req, res) => {
    const { id } = req.params

    const user = users.find(elem => elem.id == id)

    if (!user) {
        return res
            .status(404)
            .json({ message: ` User with id:${id} not found` })
    }

    users = users.filter(elem => elem.id != id)

    return res.json(users)
})

router.patch('/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body
    console.log(req.body)
    if (!name) {
        return res.status(401).json({ message: ` Invalid name` })
    }
    const user = users.find(elem => elem.id == id)

    if (!user) {
        return res
            .status(404)
            .json({ message: ` User with id:${id} not found` })
    }

    user.name = name
    users = users.map(elem => {
        if (elem.id == id) {
            return { ...elem, name }
        }
        return elem
    })
    return res.json(user)
})

router.post('/', (req, res) => {
    const { name, hours, friends } = req.body
    const user = {
        id: users.length + 1,
        name,
        hours,
        friends,
    }

    users.push(user)
    return res.json(user)
})
