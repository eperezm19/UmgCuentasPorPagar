
$( document ).ready(function() {

  LlenarTablaBancos();

  document.getElementById("txtNombreBanco").onkeyup = function() {

    var nombreBanco = document.getElementById("txtNombreBanco").value;

    if(nombreBanco != "" && nombreBanco != null && nombreBanco != undefined){

      $("#txtNombreBanco").removeClass('is-invalid');

    }

  };

  
  $("#btnAddBanco").click(function(e) {

    e.preventDefault(); 

    var idBanco = document.getElementById("txtBancoId").value;
    var nombreBanco = document.getElementById("txtNombreBanco").value;

    if(idBanco > 0){

      if(nombreBanco != "" && nombreBanco != null && nombreBanco != undefined){

        let url = host + 'api/Bancos';
        var respuesta = null;
  
        fetch(url + "/" + idBanco, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "BancoId" : idBanco, "Nombre": nombreBanco }),
          cache: 'no-cache'
        })
        .then(function(response) {
          console.log(response);
          return response.text();
        })
        .then(function(data) {

          if(data != undefined && data != null && data != ""){
            respuesta = JSON.parse(data);
          }

          LlenarTablaBancos();
          LimpiarForm();

          Swal.fire('Registro modificado exitosamente', '', 'success');
          
        })
        .catch(function(err) {
          console.log(err);
        });
  
      }
      else{
        
        $("#txtNombreBanco").addClass('is-invalid');
  
      }

    }
    else{
          
      if(nombreBanco != "" && nombreBanco != null && nombreBanco != undefined){

        let url = host + 'api/Bancos';
        var respuesta = null;

        fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "Nombre": nombreBanco }),
          cache: 'no-cache'
        })
        .then(function(response) {
          console.log(response);
          return response.text();
        })
        .then(function(data) {
          respuesta = JSON.parse(data);

          LlenarTablaBancos();
          LimpiarForm();

          Swal.fire('Registro agregado exitosamente', '', 'success');


        })
        .catch(function(err) {
          console.log(err);
        });

      }
      else{
        
        $("#txtNombreBanco").addClass('is-invalid');

      }

    }

  });
  
});

//local
//let host = "https://localhost:44396/";

//server azure
let host = "https://cuentasporpagarumg.azurewebsites.net/";

let BancosList = [];

async function ObtenerBancos(){

  let url = host + 'api/Bancos';
  
  var resp = await fetch(url)
  .then(function(response) {
      console.log(response);
      return response.text();
  })
  .then(function(data) {
      BancosList = JSON.parse(data);
  })
  .catch(function(err) {
      console.log(err);
  });

}


async function LlenarTablaBancos(){

  await ObtenerBancos();

  $('#dtBancos').empty();

  console.table(BancosList);

  BancosList.forEach(function (elemento, indice, array) {

    if (indice == 0) {

      $('#dtBancos').append('<thead> <tr> <th>No. </th> <th>Nombre</th><th>Operaciones</th> </tr> </thead>' +
                        ' <tbody><tr> <td>' + elemento.bancoId + '</td> <td>' + elemento.nombre + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarBanco(' + elemento.bancoId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="EliminarBanco(' + elemento.bancoId + ');" null=""><i class="fa fa-trash"></i></button> </td> </tr></tbody>');

    }
    else {

      $('#dtBancos').append('<tr> <td>' + elemento.bancoId + '</td> <td>' + elemento.nombre + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarBanco(' + elemento.bancoId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="EliminarBanco(' + elemento.bancoId + ');" null=""><i class="fa fa-trash"></i></button> </td> </tr>');

      }

  })

}


async function RecuperarBanco(id){

      var banco = {};

      let url = host + 'api/Bancos';

      var resp = await fetch(url + "?id=" + id)
      .then(function(response) {
        console.log(response);
        return response.text();
      })
      .then(function(data) {

          if(data != undefined){
            banco = JSON.parse(data);
          }
          else{
            console.log(data);
          }

          console.log(banco);

          document.getElementById("txtNombreBanco").value = banco.nombre;
          document.getElementById("txtBancoId").value = banco.bancoId; 

      })
      .catch(function(err) {
          console.log(err);
      });

}

async function EliminarBanco(id){

    if(id > 0){

      let url = host + 'api/Bancos';
        var respuesta = null;
  
        fetch(url + "/" + id, {
          method: 'DELETE',
        })
        .then(function(response) {
          console.log(response);
          return response.text();
        })
        .then(function(data) {

          if(data != undefined && data != null && data != ""){
            respuesta = JSON.parse(data);
          }

          LlenarTablaBancos();

            Swal.fire('Registro eliminado exitosamente', '', 'success');
          
        })
        .catch(function(err) {
          console.log(err);
        });

    }

}


function LimpiarForm(){

  document.getElementById("txtNombreBanco").value = "";
  document.getElementById("txtBancoId").value = ""; 

}