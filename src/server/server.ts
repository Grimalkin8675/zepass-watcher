import express = require('express');
import websocket = require('ws');

import { webserverPort, websocketPort } from '../config';


/* WebServer */
const app = express();

app.post('/wsadress', (req: any, res: any) => { res.json(websocketPort) });

app.get(/.*/, express.static(__dirname + '/../../static'));

app.use((err: Error, req: any, res: any, next: () => any) => {
    console.log(err);
    res.status(500).send('Something broke!');
});


// Start server
app.listen(webserverPort, (err: Error) => {
    if (err) { return console.log('something bad happened', err); }
    console.log(`Server started on http://localhost:${webserverPort}/`);
});


/* WebSocket */
const wss = new websocket.Server({ port: websocketPort });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(`received: ${message}`);
    });

    ws.send('something');
});
