const { app, BrowserWindow, Menu } = require('electron')

// Mantén una referencia global del objeto window, si no lo haces, la ventana
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
let win
let getids
let local = true;
let web = false;
function createWindow () {

  //conexion
  //var con = require("./conexion");
  //var f = require("./funciones");
  // Crea la ventana del navegador.
  const shell = require('electron').shell
  const fs = require('fs');
  var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {label:'Ir al inicio'},
                {label:'Ayuda',
              click(){shell.openExternal('http://www.rdeprocess.com/')}},
                {label:'Imprimir',
                  click(){
                    console.log("Va a imprimir");
                    //win.webContents.print({silent:true, printBackground:true});
                    // win.webContents.printToPDF({ marginsType:1, pageSize:"Letter", landscape:true }, (error, data) => {
                    win.webContents.print({ marginsType:1, pageSize:"Letter", landscape:true }, (error, data) => {
                    if (error) throw error
                    fs.writeFile('../output.pdf', data, (error) => {

                    //getTitle of Window
                    console.log(win.webContents.getTitle())

                    //Silent Print

                    if (error) throw error
                    console.log('Write PDF successfully.')
                  })})
                    console.log("En teoria ya imprimio");
                  }},
                {label:'Salir',
              click(){
                app.quit();
              }}
            ]
        }
    ])
  Menu.setApplicationMenu(menu);


  win = new BrowserWindow({ width: 1024, height: 700,webPreferences: {
        nodeIntegration: true
    } })
  // y carga el archivo index.html de la aplicación.
  win.loadFile('index.html')
  win.maximize();
  // Abre las herramientas de desarrollo (DevTools).
  if(local && !web){
    win.webContents.openDevTools()
  }
  // Emitido cuando la ventana es cerrada.
  win.on('closed', () => {
    // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
    // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
    // en el que deberías borrar el elemento correspondiente.
    win = null
  })
}
///////////////////////////////////////////////////////////////////////////////////////////////////
//Daniel codigo
const {ipcMain} = require('electron')
global.sharedObj ={usuario:null};
global.local = local;
global.web = web;
console.log("Creando respuestas");
ipcMain.on('setUsuario',(event,arg)=>{
  global.sharedObj.usuario = arg;
  //console.log("Argumento: "+arg.nombre);
})
ipcMain.on('getUsuario',(event,arg)=>{
  //console.log("Argumento: "+arg);
  event.returnValue=global.sharedObj.usuario;
})
ipcMain.on('cerrar',(event,arg)=>{
  //alert("Error en conección","comuniquese con personal de informática para revisar este error\nCodigo 001");
  const { dialog } = require('electron');
  //const response = dialog.showMessageBox(null);
  const options = {
    type: 'warning',
    buttons: ['Aceptar'],
    defaultId: 2,
    title: 'Error en la conexión a la base de datos.',
    message: 'El sistema no pudo conectarse a la base de datos, por lo tanto se cerrará.',
    detail: 'Notifique al personal de IT que surgió el error Código 001',
    //checkboxLabel: 'Remember my answer',
    //checkboxChecked: true,
  };
  dialog.showMessageBox(null, options, (response, checkboxChecked) => {
    app.quit();
  });
})
///////////////////////////////////////////////////////////////////////////////////////////////////

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', createWindow)

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (win === null) {
    createWindow()
  }
})
