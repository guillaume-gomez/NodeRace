# NodeRace
A Network video game to learn basic NodeJs Skills.

This application is an example of what it is possible to do with html5 and websockets.

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

### assets :

The cars were made by [bagera3005](http://bagera3005.deviantart.com/)

## Running the application :

In order to run the application go into `server` if you're not already in it and run :
```
node app.js
```
*You may need to run __nodejs__ instead of node depending on your configuration*

Now you have the server running, a text in the terminal should indicate on which **port** it is listening, if you have a conflic you can modify this in [server/config.json](server/config.json) 

Open a browser and go to 127.0.0.1:<**port**> (by default http://127.0.0.1:51510).

That's it ! now by default the server listens on all interfaces, so for example you can easily play on lan using your local ip address (for example 192.168.1.10)

## sublime-project
### packages

Here are the packages you may want to add to sublime if you want to edit the files and/or open the .sublime-project :

- [JsFormat](https://packagecontrol.io/packages/JsFormat) **used to follow a clean coding style**

For the plugin to read and use '*.jsbeautifyrc*'
you need to set a custom setting for JsFormat
  ( Preferences -> Package Settings -> JsFormat -> Settings - User )
and set this :
```json
{
	"jsbeautifyrc_files": true
}
```

## Authors :
- [Gomez Guillaume](https://github.com/guillaume-gomez)
- [Jarretier Adrien](https://github.com/AdrienJarretier)
