
$(document).ready(function () {

    LlenarTabla();

    LlenarProveedores();
    LlenarBancos();
    LlenarFormasPago();



    $("#btnAddPago").click(function (e) {

        e.preventDefault();

        AgregarPago();

    });

    $("#slProveedor").change(function (e) {

        e.preventDefault();

        var id = document.getElementById("slProveedor").value;

        LlenarBancos(id);

    });


});

//local
//let host = "https://localhost:44396/";

//server azure
let host = "https://cuentasporpagarumg.azurewebsites.net/";

let list = [];

async function ObtenerDatos() {

    let url = host + 'api/Pagos';

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

    $('#dtPagos').empty();

    console.table(list);

    await ObtenerBancos();
    await ObtenerFormasPago();
    await ObtenerProveedores();

    list.forEach(function (elemento, indice, array) {

        var bancoDesc = null;
        var formaPagoDesc = null;
        var proveedorDesc = null;


        listBancos.forEach(function (item, indice, array) {

            if (elemento.bancoId == item.bancoId) {

                bancoDesc = item.nombre;

            }

        });

        listFormasPago.forEach(function (item, indice, array) {

            if (elemento.formaPagoId == item.formaPagoId) {

                formaPagoDesc = item.descripcion;

            }

        });

        listProveedores.forEach(function (item, indice, array) {

            if (elemento.proveedorId == item.proveedorId) {

                proveedorDesc = item.nombre;

            }

        });



        if (indice == 0) {

            $('#dtPagos').append('<thead> <tr> <th>No. </th> <th>Fecha</th> <th>Referencia</th> <th>Importe</th> <th>Proveedor</th> <th>Forma de Pago</th> <th>Banco</th> <th>Factura</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.pagoId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.referencia + '</td> <td>' + parseFloat(elemento.importe).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + proveedorDesc + '</td> <td>' + formaPagoDesc + '</td> <td>' + bancoDesc + '</td> <td>' + elemento.facturaId + '</td> </tr></tbody>');

        }
        else {

            $('#dtPagos').append('<tr> <td>' + elemento.pagoId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.referencia + '</td> <td>' + parseFloat(elemento.importe).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + proveedorDesc + '</td> <td>' + formaPagoDesc + '</td> <td>' + bancoDesc + '</td> <td>' + elemento.facturaId + '</td> </tr>');

        }

    })

}



var objProveedor = {};

async function RecuperarDatosProveedor(id) {

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


function LimpiarForm() {

    document.getElementById("txtReferencia").value = "";
    document.getElementById("txtImporte").value = "";
    $("#slProveedor").val("").change();
    $("#slFormaPago").val("").change();
    $("#slBanco").val("").change();

}




async function LlenarProveedores() {

    await ObtenerProveedores();

    $("#slProveedor").empty();
    $('#slProveedor').append('<option value="" disabled selected>' + '--- Seleccione ---' + '</option>');

    console.log(listProveedores);

    listProveedores.forEach(function (obj) {

        $('#slProveedor').append('<option value="' + obj.proveedorId + '">' + obj.nombre + '</option>');

    });

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



async function LlenarFormasPago() {

    await ObtenerFormasPago();

    $("#slFormaPago").empty();
    $('#slFormaPago').append('<option value="" disabled selected>' + '--- Seleccione ---' + '</option>');

    console.log(listFormasPago);

    listFormasPago.forEach(function (obj) {

        $('#slFormaPago').append('<option value="' + obj.formaPagoId + '">' + obj.descripcion + '</option>');

    });

}


let listFormasPago = [];

async function ObtenerFormasPago() {

    let url = host + 'api/FormaPagos';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listFormasPago = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}



async function LlenarBancos(idProveedor) {

    await ObtenerBancos();
    await RecuperarPP();

    $("#slBanco").empty();
    $('#slBanco').append('<option value="" disabled selected>' + '--- Seleccione ---' + '</option>');

    console.log(listBancos);

    listBancos.forEach(function (obj) {

        listPP.forEach(function (item) {

            if (obj.bancoId == item.bancoId && item.proveedorId == idProveedor) {

                $('#slBanco').append('<option value="' + obj.bancoId + '">' + obj.nombre + '</option>');

            }

        })


    });

}


let listBancos = [];

async function ObtenerBancos() {

    let url = host + 'api/Bancos';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listBancos = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

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


async function AgregarPago() {


    var f = new Date();
    var fecha = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();

    var fechaVence = (f.getFullYear() + 3) + "-" + (f.getMonth() + 1) + "-" + f.getDate();


    var referencia = document.getElementById("txtReferencia").value;
    var importe = document.getElementById("txtImporte").value;
    var proveedor = document.getElementById("slProveedor").value;
    var formaPago = document.getElementById("slFormaPago").value;
    var bancoId = document.getElementById("slBanco").value;

    await RecuperarDatosProveedor(proveedor);


    if (fecha != "") {

        let url = host + 'api/Facturas';
        var respuesta = null;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Fecha": fecha, "Importe": importe, "Pendiente": (objProveedor.saldo -= importe),
                "Vence": fechaVence, "Descripcion": "Por Pago a proveedor: " + objProveedor.nombre, "ProveedorId": proveedor,
            }),
            cache: 'no-cache'
        })
            .then(function (response) {
                console.log(response);
                return response.text();
            })
            .then(function (data) {
                respuesta = JSON.parse(data);

                //Swal.fire('Registro actualizado exitosamente', '', 'success');
                console.log("factura ID: " + respuesta.facturaId);


                if (fecha != "" && referencia != "" && importe != "" && proveedor > 0 && formaPago > 0 && bancoId > 0) {

                    let url = host + 'api/Pagos';
                    var resp = null;

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "Fecha": fecha, "Referencia": referencia, "Importe": importe, "ProveedorId": proveedor,
                            "FormaPagoId": formaPago, "BancoId": bancoId, "FacturaId": respuesta.facturaId, "Conciliado": 0,
                        }),
                        cache: 'no-cache'
                    })
                        .then(function (response) {
                            console.log(response);
                            return response.text();
                        })
                        .then(function (data) {

                            if (data != undefined && data != null && data != "") {
                                resp = JSON.parse(data);
                            }

                            LlenarTabla();
                            LimpiarForm();

                            Swal.fire('Registro ingresado exitosamente', '', 'success');

                        })
                        .catch(function (err) {
                            console.log(err);
                        });

                }
                else {

                    Swal.fire('Se deben completar todos los datos.', '', 'info');

                }


            })
            .catch(function (err) {
                console.log(err);
            });



        //
        url = host + 'api/Proveedores';
        respuesta = null;

        objProveedor.saldo -= importe;

        fetch(url + "/" + objProveedor.proveedorId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objProveedor),
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

                //LlenarTabla();
                //LimpiarForm();

                //Swal.fire('Registro modificado exitosamente', '', 'success');

            })
            .catch(function (err) {
                console.log(err);
            });



    }
    else {

        Swal.fire('Se deben completar todos los datos.', '', 'info');

    }



}

