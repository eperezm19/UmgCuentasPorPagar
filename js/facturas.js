
$(document).ready(function () {

    LlenarTabla();

});



let host = "https://cuentasporpagarumg.azurewebsites.net/";

let list = [];

async function ObtenerDatos() {

    let url = host + 'api/Facturas';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            list = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    await ObtenerDatos();
    await ObtenerProveedores();

    $('#dtFacturas').empty();

    console.table(list);

    list.forEach(function (elemento, indice, array) {


        var proveedorDesc = null;

        listProveedores.forEach(function (item, indice, array) {

            if (elemento.proveedorId == item.proveedorId) {

                proveedorDesc = item.nombre;

            }

        });


        if (indice == 0) {

            $('#dtFacturas').append('<thead> <tr> <th>No. </th> <th>Fecha</th> <th>Descripción</th> <th>Proveedor</th> <th>Importe</th> <th>Pendiente</th> <th>Vence</th> </thead>' +
                ' <tbody><tr> <td>' + elemento.facturaId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.descripcion + '</td>  <td>' + proveedorDesc + '</td> <td>' + parseFloat(elemento.importe).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + parseFloat(elemento.pendiente).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + elemento.vence.split('T')[0] + '</td> </tr></tbody>');

        }
        else {

            $('#dtFacturas').append('<tr> <td>' + elemento.facturaId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.descripcion + '</td>  <td>' + proveedorDesc + '</td> <td>' + parseFloat(elemento.importe).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + parseFloat(elemento.pendiente).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + elemento.vence.split('T')[0] + '</td>  </tr>');

        }

    })

}



let listProveedores = [];

async function ObtenerProveedores() {

    let url = host + 'api/Proveedores';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listProveedores = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}