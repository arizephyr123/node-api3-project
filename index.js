// code away!
const server = require ('./server.js');

const port = 4003;

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
