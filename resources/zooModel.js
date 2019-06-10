const knex = require('knex');

module.exports = {
    find, 
    findById,
    add,
    update,
    remove
}

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.db3'
    },
    useNullAsDefault: true,
}

const db = knex(knexConfig)

function find() {
    return db('zoos')
}
function findById(id) {
    return db('zoos')
    .where({id})
    .first()
}
async function add(newzoo) {
    const [id] = await db('zoos').insert(newzoo)

    return findById(id)
}
function update(id, changes) {
    return db('zoos')
    .where({id})
    .update(changes, '*')
}
function remove(id) {
    return db('zoos')
    .where({ id })
    .delete()
}
