
$(document).ready(function () {

    var IdQS = getParameterByName('id');
    document.getElementById("txtProveedorId").value = IdQS;

    console.log(IdQS);


    if (IdQS > 0) {

        RecuperarProveedor(IdQS);
    }


    LlenarTabla();


    var idProveedor = document.getElementById("txtProveedorId").value;

    if (!(idProveedor > 0)) {

        window.location.href = "../index.html";

    }

});

//local
//let host = "https://localhost:44396/";

//server azure
let host = "https://cuentasporpagarumg.azurewebsites.net/";

let list = [];

async function ObtenerDatos() {

    let url = host + 'api/Bancos';

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


let objProveedor = {};

async function RecuperarProveedor(id) {


    let url = host + 'api/Proveedores';

    var resp = await fetch(url + "?id=" + id)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                objProveedor = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(objProveedor);

        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    var idProveedor = document.getElementById("txtProveedorId").value;

    await ObtenerDatos();
    await RecuperarProveedor(idProveedor);
    await RecuperarPP();


    $('#dtBancos').empty();

    console.table(list);


    document.getElementById("titleTb").innerHTML = "Asignar Bancos - Proveedor: " + objProveedor.nombre;

    list.forEach(function (elemento, indice, array) {

        var encontrado = false;
        var valEncont = 0;
        var estado = "No asignado";

        listPP.forEach(function (item, indice, array) {

            if (item.bancoId == elemento.bancoId && objProveedor.proveedorId == item.proveedorId) {

                encontrado = true;
                valEncont = item.proveedorBancoId;
            }

        })


        
        var boton = null;

        if (encontrado) {

            estado = "Asignado";

            boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Quitar" onclick="Quitar(' + valEncont + ');" null=""><i class="fa fa-times"></i></button>';

        }
        else {

            boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar" onclick="Asignar(' + elemento.bancoId + ');" null=""><i class="fa fa-check"></i></button>';
        }


        if (indice == 0) {

            $('#dtBancos').append('<thead> <tr> <th>No. </th> <th>Nombre</th> <th>Estado</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.bancoId + '</td> <td>' + elemento.nombre + '</td> <td>' + estado + '</td> <td> ' + boton + ' </td> </tr></tbody>');

        }
        else {

            $('#dtBancos').append('<tr> <td>' + elemento.bancoId + '</td> <td>' + elemento.nombre + '</td> <td>' + estado + '</td> <td> ' + boton + ' </td> </tr>');

        }

    })

}



async function Quitar(id) {

    if (id > 0) {

        let url = host + 'api/ProveedorBancos';
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
                LimpiarForm();

                Swal.fire('Registro quitado exitosamente', '', 'success');

            })
            .catch(function (err) {
                console.log(err);
            });

    }

}


function Asignar(id) {

    var idProveedor = document.getElementById("txtProveedorId").value;


    var nombreC = document.getElementById("txtNombreCuenta").value;
    var numeroC = document.getElementById("txtNumeroCuenta").value;


    if (id > 0 && idProveedor > 0) {

        if (numeroC != "" && nombreC != "") {

            let url = host + 'api/ProveedorBancos';
            var respuesta = null;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "BancoId": id, "ProveedorId": idProveedor, "NumeroCuenta": numeroC, "NombreCuenta": nombreC,
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

                    Swal.fire('Registro asignado exitosamente', '', 'success');


                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        else {

            Swal.fire('Se deben completar los datos del formulario.', '', 'info');
        }

    }
    else {

        Swal.fire('No se ha podido asignar el registro.', '', 'warning');
    }


}


let listPP = [];

async function RecuperarPP() {


    let url = host + 'api/ProveedorBancos';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                listPP = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(listPP);

        })
        .catch(function (err) {
            console.log(err);
        });

}


function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}



function LimpiarForm() {

    document.getElementById("txtNombreCuenta").value = "";
    document.getElementById("txtNumeroCuenta").value = "";

}
