//conexion.js
module.exports = {
  consulta: function(consulta,respuesta){
    var rem = require('electron').remote;
    let local = rem.getGlobal('local');
    let web = rem.getGlobal('web');
    var mysql = require('mysql');
    var con = mysql.createConnection({
      host: "localhost",
      user: "mapa",
      password: "RdEpAc1292",
      database: "maparde"
    });

    try{
      con.connect(function(err) {
      var queries={
        deptos:"select * from depas",
        actualizar:"update depas set meta = ?, avance = ? where iddepas = ?;"};
      if (err) throw err;
      // console.log("consultaq: "+consulta.consultaq+" queries: "+JSON.stringify(queries));
      var sql = (consulta.valores==null?queries[consulta.consultaq]:mysql.format(queries[consulta.consultaq],consulta.valores));
      console.log(sql);
      con.query(sql, function (err, result) {
        if (err) throw err;
        if(err) console.log(sql);
        //console.log("Result: " + JSON.stringify(result));
        con.end();
        return respuesta(result);
      });
      //con.end();
    });
    }catch(e){
      console.log('Error, no se conecto a la base de datos');
      const {ipcRenderer} = require('electron');
      ipcRenderer.send('cerrar',null);
    }
  }
}
//hola
