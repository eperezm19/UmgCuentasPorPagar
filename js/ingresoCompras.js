
$(document).ready(function () {

    LlenarTabla();

});


let host = "https://cuentasporpagarumg.azurewebsites.net/";


let list = [];

async function ObtenerDatos() {

    let url = host + 'api/IngresoCompras';

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
    await ObtenerAlmacenes();

    $('#dtIngreso').empty();

    console.table(list);

    list.forEach(function (elemento, indice, array) {


        var proveedorDesc = null;
        var almacenDesc = null;

        listProveedores.forEach(function (item, indice, array) {

            if (elemento.proveedorId == item.proveedorId) {

                proveedorDesc = item.nombre;

            }

        });

        listAlmacenes.forEach(function (item, indice, array) {

            if (elemento.almacenId == item.almacenId) {

                almacenDesc = item.descripcion;

            }

        });


        if (indice == 0) {

            $('#dtIngreso').append('<thead> <tr> <th>No. </th> <th>Fecha</th> <th>Orden de Compra</th> <th>Proveedor</th> <th>Almacén</th> <th>Factura</th> </thead>' +
                ' <tbody><tr> <td>' + elemento.ingresoCompraId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td><td>' + elemento.ordenCompraId + '</td> <td>' + proveedorDesc + '</td> <td>' + almacenDesc + '</td> <td>' + elemento.facturaId + '</td> </tr></tbody>');

        }
        else {

            $('#dtIngreso').append('<tr> <td>' + elemento.ingresoCompraId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td><td>' + elemento.ordenCompraId + '</td> <td>' + proveedorDesc + '</td> <td>' + almacenDesc + '</td> <td>' + elemento.facturaId + '</td> </tr>');

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



let listAlmacenes = [];

async function ObtenerAlmacenes() {

    let url = host + 'api/Almacenes';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listAlmacenes = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}