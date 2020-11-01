
$( document ).ready(function() {

    LlenarTablaAlmacen();
   
  
     document.getElementById("txtNombreAlmacen").onkeyup = function() {
  
      var nombreAlmacen = document.getElementById("txtNombreAlmacen").value;
  
      if(nombreAlmacen != "" && nombreAlmacen != null && nombreAlmacen != undefined){
  
        $("#txtNombreAlmacen").removeClass('is-invalid');
  
      }
  
    }; 
  
    
    $("#btnAddAlmacen").click(function(e) {
  
      e.preventDefault(); 
  
      var idAlmacen = document.getElementById("txtAlmacenId").value;
      var nombreAlmacen = document.getElementById("txtNombreAlmacen").value;
  
      if(idAlmacen > 0){
  
        if(nombreAlmacen != "" && nombreAlmacen != null && nombreAlmacen != undefined){
  
          let url = host + 'api/Almacenes';
          var respuesta = null;
    
          fetch(url + "/" + idAlmacen, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "AlmacenId" : idAlmacen, "Descripcion": nombreAlmacen }),
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
  
            LlenarTablaAlmacen();
            LimpiarForm();
  
            alert("Registro modificado exitosamente");
            
          })
          .catch(function(err) {
            console.log(err);
          });
    
        }
        else{
          
          $("#txtNombreAlmacen").addClass('is-invalid');
    
        }
  
      }
      else{
            
        if(nombreAlmacen != "" && nombreAlmacen != null && nombreAlmacen != undefined){
  
          let url = host + 'api/Almacenes';
          var respuesta = null;
  
          fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "Descripcion": nombreAlmacen }),
            cache: 'no-cache'
          })
          .then(function(response) {
            console.log(response);
            return response.text();
          })
          .then(function(data) {
            respuesta = JSON.parse(data);
  
            LlenarTablaAlmacen();
            LimpiarForm();
  
            alert("Registro agregado exitosamente");
  
          })
          .catch(function(err) {
            console.log(err);
          });
  
        }
        else{
          
          $("#txtNombreAlmacen").addClass('is-invalid');
  
        }
  
      }
  
    });
    
  });
  
  //local
  //let host = "https://localhost:44396/";
  
  //server azure
  let host = "https://cuentasporpagarumg.azurewebsites.net/";
  
  let AlmacenList = [];
  
  async function ObtenerAlmacen(){
  
    let url = host + 'api/Almacenes';
    
    var resp = await fetch(url)
    .then(function(response) {
        console.log(response);
        return response.text();
    })
    .then(function(data) {
        AlmacenList = JSON.parse(data);
    })
    .catch(function(err) {
        console.log(err);
    });
  
  }
  
  
  async function LlenarTablaAlmacen(){
  
    await ObtenerAlmacen();
  
    $('#dtAlmacenes').empty();
  
    console.table(AlmacenList);
  
    AlmacenList.forEach(function (elemento, indice, array) {
  
      if (indice == 0) {
  
          $('#dtAlmacenes').append('<thead> <tr> <th>No. </th> <th>Descripcion</th><th>Operaciones</th> </tr> </thead>' +
                          ' <tbody><tr> <td>' + elemento.almacenId + '</td> <td>' + elemento.descripcion + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarAlmacen(' + elemento.almacenId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="EliminarAlmacen(' + elemento.almacenId + ');" null=""><i class="fa fa-trash"></i></button> </td> </tr></tbody>');
  
      }
      else {
  
          $('#dtAlmacenes').append('<tr> <td>' + elemento.almacenId + '</td> <td>' + elemento.descripcion + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarAlmacen(' + elemento.almacenId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="EliminarAlmacen(' + elemento.almacenId + ');" null=""><i class="fa fa-trash"></i></button> </td> </tr>');
  
        }
  
    })
  
  }
  
  
  async function RecuperarAlmacen(id){
  
        var almacen = {};
  
        let url = host + 'api/Almacenes';
  
        var resp = await fetch(url + "?id=" + id)
        .then(function(response) {
          console.log(response);
          return response.text();
        })
        .then(function(data) {
  
            if(data != undefined){
                almacen = JSON.parse(data);
            }
            else{
              console.log(data);
            }
  
            console.log(almacen);
  
            document.getElementById("txtNombreAlmacen").value = almacen.descripcion;
            document.getElementById("txtAlmacenId").value = almacen.almacenId; 
  
        })
        .catch(function(err) {
            console.log(err);
        });
  
  }
  
  async function EliminarAlmacen(id){
  
      if(id > 0){
  
        let url = host + 'api/Almacenes';
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
  
            LlenarTablaAlmacen();
  
            alert("Registro eliminado exitosamente");
            
          })
          .catch(function(err) {
            console.log(err);
          });
  
      }
  
  }
  
  
  function LimpiarForm(){
  
    document.getElementById("txtNombreAlmacen").value = "";
    document.getElementById("txtAlmacenId").value = ""; 
  
  }