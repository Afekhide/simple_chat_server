import {Server} from 'socket.io';
import {createServer} from 'http';

const PORT = process.env.PORT || 4000;
let clients = []

const httpServer = createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Welcome to Simple Chat Server')
    res.end()
})
const server = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

server.on('connection', socket => {
    console.log(`${socket.id} connected...`);

    socket.on('message', data => {
        server.emit('message', data)
    })

    socket.on('register', data => {
        clients.push({
            id: socket.id,
            username: JSON.parse(data).username
        })
        console.log(clients)
    })

    socket.on('disconnect', reason => {
        console.log(`${socket.id} disconnected...`)
        clients = clients.filter(client => client.id !== socket.id)
        //console.log(clients)
    })
    
})



httpServer.listen(PORT)
console.log('Listenning on port... ', PORT)