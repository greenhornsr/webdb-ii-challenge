const express = require('express');
const router = express.Router();
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.db3'
    },
    useNullAsDefault: true,
}

const db = knex(knexConfig)

router.use(express.json());

router.get('/', (req, res) => {
    return db('zoos')
    .then(zoos => {
        zoos ? res.status(200).json(zoos): 
        res.status(404).json({message: 'sorry, no zoos found'})
    })
    .catch(err => {
        res.status(500).json({message: 'internal server error', err})
    })
})
router.get('/:id', (req, res) => {
    return null
})
router.post('/', (req, res) => {
    return null
})
router.put('/:id', (req, res) => {
    return null
})
router.delete('/:id', (req, res) => {
    return null
})


module.exports = router;