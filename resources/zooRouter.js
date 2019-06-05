const express = require('express');
const router = express.Router();
const knex = require('knex');
const Zoosdb = require('./zooModel');

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
    Zoosdb.find()
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
    Zoosdb.add(newzoo)
    .then(ids => {
        res.status(201).json({message: `${newzoo.name} Zoo added successfully`, Zoo_Info: ids})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: `internal server error`, error:  err})
    })
})

router.get('/:id', (req, res) => {
    const {id} = req.params
    Zoosdb.findById(id)
    .first()
    .then(zoo => {
        // throw 'bad id given';  // throw to trigger catch.  should be done in .then()
        zoo ? res.status(200).json({Zoo_Info: zoo}): 
        res.status(404).json({message: 'sorry, no zoos found'})
    })
    .catch(err => {
        // res.status(500).json({message: 'internal server error', error:  err})
        res.status(500).json(errorRef(err))
    })
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    Zoosdb.update(id, changes)
    .then(count => {
        count ? res.status(200).json({message: `${count} records updated`, changes}): 
        res.status(404).json({message: `sorry, no zoo with given id: ${id} found`})
    })
    .catch(err => {
        console.log(err)
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
        res.status(500).json(errorRef(err))
    })
})

// error middleware
const errorRef = (error) => {
    const hash = Math.random().toString(36).substring(2);
    console.log(hash, error)
    return { message: `Unknown Error, Ref: ${hash}`, error }
}


module.exports = router;