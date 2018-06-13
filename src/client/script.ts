// import jQuery = require('jquery');
import * as $ from 'jquery';


function openWS(port: string) {
    const url = 'ws://localhost:'+port;
    const ws = new WebSocket(url);

    ws.onopen = () => {
        ws.send('open');
    };

    ws.onerror = (error) => {
        throw new Error('WebSocket Error:'+error);
    };

    ws.onmessage = (e) => {
        console.log('received:', e);
    }

    ws.onclose = () => {}
}


$(() => {
    $.post('http://'+window.location.host+'/wsadress', openWS, 'json');
});
