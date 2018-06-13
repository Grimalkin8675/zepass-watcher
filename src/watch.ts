import opn = require('opn');

import { urlZepass, musicUrl, delayClient } from './config';
import { myLog, isTicketAvaible, wakeUp } from './utils/functions';


async function watch(url: string, silently: boolean=false) {
    myLog('sending request');
    const res = await isTicketAvaible(url);
    myLog('ticket avaible: '+res);
    if (res) {
        if (silently) {
            opn(urlZepass);
        } else {
            wakeUp(urlZepass, musicUrl);
        }
    } else {
        setTimeout(() => watch(url, silently), delayClient);
    }
    return new Promise((resolve, reject) => {});
}


/* main */
if (process.argv.length === 2) {
    console.log('starting watcher with Meshuggah...');
    watch(urlZepass);
} else if (process.argv[2] === '-q') {
    console.log('starting watcher without Meshuggah...');
    watch(urlZepass, true);
} else {
    console.log('unknown arguments');
    console.log('use -q to run without Meshuggah');
}
