// code away!
require('dotenv').config();

const server = require ('./server.js');

const port = process.env.PORT || 4003;

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
