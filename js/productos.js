
$(document).ready(function () {

    LlenarTabla();


    $("#btnAddProducto").click(function (e) {

        e.preventDefault();

        var id = document.getElementById("txtProductoId").value;
        var descripcion = document.getElementById("txtDescripcion").value;
        var costo = document.getElementById("txtCosto").value;

        if (id > 0) {

            if (descripcion != "" && costo != "") {

                let url = host + 'api/Productos';
                var respuesta = null;

                fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "ProductoId": id, "Descripcion": descripcion, "CostoUnit": costo,
                    }),
                    cache: 'no-cache'
                })
                    .then(function (response) {
                        console.log(response);
                        return response.text();
                    })
                    .then(function (data) {

                        if (data != undefined && data != null && data != "") {
                            respuesta = JSON.parse(data);
                        }

                        LlenarTabla();
                        LimpiarForm();

                        Swal.fire('Registro modificado exitosamente', '', 'success');

                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            }
            else {

                Swal.fire('Se deben completar todos los datos.', '', 'info');

            }

        }
        else {

            if (descripcion != "" && costo != "") {

                let url = host + 'api/Productos';
                var respuesta = null;

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "Descripcion": descripcion, "CostoUnit": costo,
                    }),
                    cache: 'no-cache'
                })
                    .then(function (response) {
                        console.log(response);
                        return response.text();
                    })
                    .then(function (data) {
                        respuesta = JSON.parse(data);

                        LlenarTabla();
                        LimpiarForm();

                        Swal.fire('Registro agregado exitosamente', '', 'success');


                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            }
            else {

                Swal.fire('Se deben completar todos los datos.', '', 'info');

            }

        }

    });

});

//local
//let host = "https://localhost:44396/";

//server azure
let host = "https://cuentasporpagarumg.azurewebsites.net/";

let list = [];

async function ObtenerDatos() {

    let url = host + 'api/Productos';

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

    $('#dtProductos').empty();

    console.table(list);

    list.forEach(function (elemento, indice, array) {

        if (indice == 0) {

            $('#dtProductos').append('<thead> <tr> <th>No. </th> <th>Descripión</th> <th>Precio Unitario</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.productoId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.productoId + ');" null=""><i class="fa fa-trash"></i></button> </td> </tr></tbody>');

        }
        else {

            $('#dtProductos').append('<tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.productoId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.productoId + ');" null=""><i class="fa fa-trash"></i></button> </td> </tr>');

        }

    })

}


async function RecuperarDatos(id) {

    var obj = {};

    let url = host + 'api/Productos';

    var resp = await fetch(url + "?id=" + id)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                obj = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(obj);

            document.getElementById("txtProductoId").value = obj.productoId;
            document.getElementById("txtDescripcion").value = obj.descripcion;
            document.getElementById("txtCosto").value = parseFloat(obj.costoUnit).toFixed(2);
           

        })
        .catch(function (err) {
            console.log(err);
        });

}

async function Eliminar(id) {

    if (id > 0) {

        let url = host + 'api/Productos';
        var respuesta = null;

        fetch(url + "/" + id, {
            method: 'DELETE',
        })
            .then(function (response) {
                console.log(response);
                return response.text();
            })
            .then(function (data) {

                if (data != undefined && data != null && data != "") {
                    respuesta = JSON.parse(data);
                }

                LlenarTabla();

                Swal.fire('Registro eliminado exitosamente', '', 'success');

            })
            .catch(function (err) {
                console.log(err);
            });

    }

}


function LimpiarForm() {

    document.getElementById("txtProductoId").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtCosto").value = "";

}