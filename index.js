const express = require('express');
const helmet = require('helmet');

const zooRouter = require('./resources/zooRouter')

const server = express();

server.use('/api/zoos', zooRouter)
server.use(express.json());
server.use(helmet());

// endpoints here
server.get('/', (req, res) => {
  res.send(`<h1>ZooFinder</h1>`)
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
