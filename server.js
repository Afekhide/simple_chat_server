import {Server} from 'socket.io';
import {createServer} from 'http';

const PORT = 4000;
let clients = []

const httpServer = createServer()
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



httpServer.listen(PORT || 8080)
console.log('Listenning on port... ', PORT)