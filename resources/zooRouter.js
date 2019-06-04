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
    db('zoos')
    .then(zoos => {
        zoos ? res.status(200).json({Zoos: zoos}): 
        res.status(404).json({message: 'sorry, no zoos found'})
    })
    .catch(err => {
        res.status(500).json({message: 'internal server error', error:  err})
    })
})

router.post('/', (req, res) => {
    const newzoo = req.body
    db('zoos')
    .insert(req.body, 'id')
    .then(ids => {
        res.status(201).json({message: `${ids} added successfully`, id: ids, newZooAdded: newzoo})
    })
    .catch(err => {
        res.status(500).json({message: `internal server error`, error:  err})
    })
})

router.get('/:id', (req, res) => {
    db('zoos').where({ id: req.params.id }) 
    .first()
    .then(zoo => {
        zoo ? res.status(200).json(zoo): 
        res.status(404).json({message: 'sorry, no zoos found'})
    })
    .catch(err => {
        res.status(500).json({message: 'internal server error', error:  err})
    })
})

router.put('/:id', (req, res) => {
    const {id} = req.params
    const changes = req.body
    db('zoos').where({ id: req.params.id }).update(changes) 
    .then(count => {
        count ? res.status(200).json({message: `${count} records updated`, changes}): 
        res.status(404).json({message: `sorry, no zoo with given id: ${id} found`})
    })
    .catch(err => {
        res.status(500).json({message: 'internal server error', error:  err})
    })
})

router.delete('/:id', (req, res) => {
    const zoo = req.body
    db('zoos').where({ id: req.params.id }).delete() 
    .then(count => {
        if(count){
            const zoounit = count > 1 ? 'records': 'record';
            res.status(200).json({message: `${count} ${zoounit} deleted`, zoodeleted: zoo})
        }else{
            res.status(404).json({message: 'Zoo not found'})
        }
    })
    .catch(err => {
        res.status(500).json({message: 'internal server error', error:  err})
    })
})


module.exports = router;