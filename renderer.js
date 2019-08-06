const { remote } = require('electron')
const { app, BrowserWindow, dialog } = remote
const mainWindow = remote.getCurrentWindow()
const axios = require('axios');

const updateData = axios.get('https://raw.githubusercontent.com/fanzihui/electron_test/master/update.json')
  .then(res=>{
    console.log(res.data);
  })
  .catch(err=>{
    console.log(err)
  });


  const localVersion = app.getVersion(); // 0.0.1
  console.log(localVersion)