const { remote, ipcRenderer } = require('electron')
const { app, BrowserWindow, dialog, shell } = remote
const mainWindow = remote.getCurrentWindow()
const axios = require('axios');
const semver = require('semver')
const fs = require('fs');
const request = require('request');
const path = require('path');
const progress = require('request-progress');

ipcRenderer.send('greet', {
  message: 'hello main ~'
})
ipcRenderer.on('greet', (event, args) => {
  console.log(args)
})

axios.get('https://raw.githubusercontent.com/fanzihui/electron_test/master/update.json')
  .then(res=>{
    console.log(res.data);
    let updateData= res.data
    let removeVersion = updateData.version
    const localVersion = app.getVersion(); // 0.0.1
    const shouldUpdate = semver.gt(removeVersion, localVersion);
    console.log('shouldUpdate', shouldUpdate)
    console.log(semver.diff(removeVersion, localVersion))
    const isMajorUpdate = semver.diff(removeVersion, localVersion) === 'major';
    if (!shouldUpdate) return;

    let isUpdate = document.querySelector('.isUpdate');
    let pageProgress = document.querySelector('.progress');

    isUpdate.innerHTML = '<button>可以更新啦</button>'

    // 打开网页下载的更新方式
    // isUpdate.addEventListener('click',function(){
    //   console.log('123123')
    //   shell.openExternal('https://www.baidu.com'); 
    // })

    // 第二种更新方式
    function handleUpdate(){
      // 测试地址
      const downloadUrl = `https://qhstaticssl.kujiale.com/download/kjl-software12/kujiale-win64-12.0.2-stable-zhannei_denglu.exe`;
      // 正式使用时, 根据版本号拼接安装程序地址
      // const downloadUrl = `https://qhstaticssl.kujiale.com/download/kjl-software12/kujiale-win64-12.0.2-stable-zhannei_denglu.exe`;
      // 用request下载
      console.log(app.getPath('temp'))
      progress(request(downloadUrl))
      .on('progress', (state) => {
          // 进度
          console.log(state)
          pageProgress.innerHTML = state.percent.toFixed(2) * 100 + '%'
      })
      .on('end',function(){
        setTimeout(function(){
          shell.openItem(path.join(app.getPath('temp'), 'kujiale-win64-12.0.2-stable-zhannei_denglu.exe'))
          app.quit();
        },5000)
      })
      // 写入到临时文件夹
      .pipe(fs.createWriteStream(path.join(app.getPath('temp'), 'kujiale-win64-12.0.2-stable-zhannei_denglu.exe')))
    }

    isUpdate.addEventListener('click',function(){
      console.log('45656')
      handleUpdate();
    })
  
    if (isMajorUpdate) {
      console.log('给出强势更新')
    } else {
      console.log('给出普通的更新提示')
    }
  })
  .catch(err=>{
    console.log(err)
  });


  