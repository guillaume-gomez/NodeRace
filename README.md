# NodeRace
A Network video game to learn basic NodeJs Skills.

This application is an example of what it is possible to do with html5 ans websockets.

## Dependancies :

- We are using **Nodejs** to run the server : https://github.com/nodejs/node
- The module **Express**, as web framework : https://github.com/expressjs/express
- The module **socket.io** (a higher abstraction of websockets) : https://github.com/socketio/socket.io

To install all those dependencies you need to have nodejs and npm installed.

Then you can go into `server` directory and run :
```
npm install
```
*this will install the module dependancies.*

- At last for the 2D game Framework we are using JawsJs : https://github.com/ippa/jaws

  *You don't need to do anything for this one.*
  
## Running the application :

In order to run the application go into `server` if you're not already in it and run :
```
node app.js
```
*You may need to run __nodejs__ instead of node depending on your configuration*

Now you have the server running, a text in the terminal should indicate on which **port** it is listening, if you have a conflic you can modify this in [server/public/config.json](server/public/config.json) 

Open a browser and go to 127.0.0.1:<**port**>.

That's it ! now by default the server listens on all interfaces, so for example you can easily play on lan using your local ip address (for example 192.168.1.10)
