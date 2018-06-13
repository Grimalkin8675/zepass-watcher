# ZePass watcher

Watches ZePass for tickets.


## Config

In [`package.json`](package.json):

- `urlZepass`: url to watch on ZePass
- `musicUrl`: youtube url (or whatever) to open to wake you up when ticket is avaible
- `delayClient`: delay in ms between two requests to urlZepass
- `webserverPort`, `websocketPort`, `delayServer`: not used (yet, maybe)


## How to use

### Building

Of course, install [npm](https://nodejs.org) and run `npm install` at the root of this project.


### Scripts

- `npm run build`: builds the project
- `npm run watch`: watchs the url (see config) and starts the music when found
- `npm run watchq`: same as `watch` but quietly (no music when found)
- other scripts are WIP (did really think I was going to do a develop branch ?)
