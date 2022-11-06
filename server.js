import {Server} from 'socket.io';
import {createServer} from 'http';
import { config } from 'dotenv';
import {createClient} from '@supabase/supabase-js';

config();
const PORT = process.env.PORT || 4000;
let clients = []
const supabase = createClient(process.env.supabase_url, process.env.supabase_key);

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
    socket.emit('fetchMessages',{db_url: process.env.supabase_url, db_key: process.env.supabase_key});

    socket.on('message', data => {
        server.emit('message', data);
        let {text} = JSON.parse(data);
        (async function(){
            const {error} = await supabase.from('message').insert({text});
            error? console.log(error) : console.log('message sent successfully');
        })()
    })

    socket.on('register', data => {
        clients.push({
            id: socket.id,
            username: JSON.parse(data).username
        })
    })

    socket.on('disconnect', reason => {
        console.log(`${socket.id} disconnected...`)
        clients = clients.filter(client => client.id !== socket.id)
    })
    
})



httpServer.listen(PORT)
console.log('Listenning on port... ', PORT)