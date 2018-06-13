import * as $ from 'jquery';
import opn = require('opn');

import { urlZepass, musicUrl, delayClient } from './config';
import { myLog, getTickets, wakeUp } from './utils/functions';
import { Watcher } from './utils/Watcher';
import { Ticket } from './utils/Ticket';


const watcher = new Watcher(urlZepass, delayClient);

watcher.onSendRequest = () => myLog('sending request');
watcher.processPage = getTickets;


/* main */
if (process.argv.length === 2) {
    console.log('starting watcher with Meshuggah...');
    watcher.onResponse = (tickets: Array<Ticket>) => {
        if (tickets.length === 0) {
            myLog('no ticket avaible');
        } else {
            myLog('ticket avaible!');
            console.log('tickets =', tickets);
            wakeUp(urlZepass, musicUrl);
        }
    };
    watcher.start();
} else if (process.argv[2] === '-q') {
    console.log('starting watcher without Meshuggah...');
    watcher.onResponse = (tickets: Array<Ticket>) => {
        if (tickets.length === 0) {
            myLog('no ticket avaible');
        } else {
            myLog('ticket avaible!');
            console.log('tickets =', tickets);
            opn(urlZepass);
        }
    };
    watcher.start();
} else {
    console.log('unknown arguments');
    console.log('use -q to run without Meshuggah');
}
