import phantom from 'phantom';
import { Agent } from 'http';


/**
 * @class Watcher
 *
 * @property {string}   url           The url to watch.
 * @property {number}   delay         Delay between two requests in ms.
 * @property {function} onSendRequest Called before request is sent.
 * @property {function} processPage   Passed to page.evaluate().
 * @property {function} onResponse    Called page evaluation finished. The
 * return value of processPage is passed to it.
 */
export class Watcher {
    url: string;
    delay: number;
    onSendRequest: () => void;
    processPage: () => any;
    onResponse: (res: any) => void;


    /**
     * @param {string} url   The url to watch.
     * @param {number} delay Delay between two requests in ms.
     */
    constructor (url: string, delay: number) {
        this.url = url;
        this.delay = delay;
        this.onSendRequest = () => {};
        this.processPage = null;
        this.onResponse = () => {};
    }

    /**
     * @throws {Error} If processPage isn't set.
     */
    start() {
        const siht = this;

        async function watch(): Promise<void> {
            siht.onSendRequest();

            const instance = await phantom.create();
            const page = await instance.createPage();
            const status = await page.open(siht.url);
            const res = await page.evaluate(siht.processPage);
            await instance.exit();

            siht.onResponse(res);
            setTimeout(watch, siht.delay);
        }

        if (this.processPage === null) {
            throw Error('processPage must be set before calling start()');
            // TODO: check that processPage isn't an arrow function.
        }

        watch();
    }
}
