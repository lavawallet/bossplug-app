

var path = require("path"),
    express = require("express");

var DIST_DIR = path.join(__dirname, "../public"),
    PORT = 3000,
    app = express();


var fs = require('fs');

const storage = require('electron-json-storage');
const {clipboard} = require('electron')
const DeviceManager = require('./device-manager')
const StorageHelper = require('./storage-helper')


module.exports =  class SocketServer {

  constructor(beatQueue,padConfigManager){
    console.log('new socket serv')
     this.beatQueue=beatQueue;
     this.padConfigManager=padConfigManager;
  }


    async init(server )
    {


      var self = this;
      var io = require('socket.io')(server);
      var port = process.env.PORT || 2054;


      ///  https://socket.io/docs/rooms-and-namespaces/#


      server.listen(port, function () {
        console.log('Socket server listening at port %d', port);
      });

      var sockets = {};




      //https://stackoverflow.com/questions/6756241/socket-io-client-side-emit-callback-never-fires

      io.on('connection', function (socket) {
        console.log('established new socket connection');

          socket.on('connectToLaunchpad', async function (data,fn) {
                var response = await DeviceManager.connectToLaunchpad()
                console.log(response)
                fn(JSON.stringify(response));  //immediate response
          });


          socket.on('addAudioFolder', async function (data,fn) {
              console.log('audio folder')
                var response = await StorageHelper.showOpenDialog({
                    properties: ['openDirectory']
                })
                fn(JSON.stringify(response));  //immediate response

          });


          socket.on('loadPadConfig', async function (data,fn) {
              console.log('audio folder')
                var response = await StorageHelper.showOpenDialog()
                fn(JSON.stringify(response));  //immediate response

          });


          socket.on('findAudioInDir', async function (folder,fn) {

                var audioFiles = [];

                try{   audioFiles = await StorageHelper.findAllInDir(folder.path,/\.wav$/,false )
                }catch(e) {console.error(e)}


                fn(JSON.stringify(audioFiles));  //immediate response

          });


          socket.on('queueSound', async function (sfx,fn) {
                  console.log('queueSound', sfx)

                  var response = self.beatQueue.play(sfx)
                  fn(JSON.stringify(response));  //immediate response
            });


            socket.on('assignSoundToPadConfig', async function (assignment,fn) {
                    console.log('assignSoundToPadConfig', assignment)
                    var response = self.padConfigManager.assignSoundToPadConfig(assignment)
                    fn(JSON.stringify(response));  //immediate response
              });


          socket.on('copyToClipboard', async function (data,fn) {
                  console.log('copy to clipboard', data)
                  var success = clipboard.writeText(data)
                  fn(JSON.stringify(data));  //immediate response
            });


          socket.on('disconnect', function () {
            console.log(socket.sid, 'disconnected');
            delete sockets[socket.sid];
          });
      });





  }

}
