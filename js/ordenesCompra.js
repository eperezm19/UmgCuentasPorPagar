

$(document).ready(function () {

    LlenarProveedores();

    LlenarTabla();


    $("#btnAddOrden").click(function (e) {

        e.preventDefault();

        var id = document.getElementById("txtOrdenId").value;
        var fecha = document.getElementById("slFecha").value;
        var fechaRec = document.getElementById("slFechaRec").value;
        var proveedor = document.getElementById("slProveedor").value;
        var importe = "0";

        if (id > 0) {

            if (fecha != "" && fechaRec != "" && proveedor > 0 && importe != "") {

                let url = host + 'api/OrdenCompras';
                var respuesta = null;

                fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "OrdenCompraId": id, "Fecha": fecha, "FechaRecepcion": fechaRec, "Importe": importe,
                        "ProveedorId": proveedor, "EstadoOrdenCompraId": 1,
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

            if (fecha != "" && fechaRec != "" && proveedor > 0 && importe != "") {

                let url = host + 'api/OrdenCompras';
                var respuesta = null;

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "Fecha": fecha, "FechaRecepcion": fechaRec, "Importe": importe,
                        "ProveedorId": proveedor, "EstadoOrdenCompraId": 1,
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

    let url = host + 'api/OrdenCompras';

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



let listEstados = [];

async function ObtenerEstados() {

    let url = host + 'api/EstadoOrdenCompras';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listEstados = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    await ObtenerDatos();
    await ObtenerProveedores();
    await ObtenerEstados();

    $('#dtOrdenes').empty();

    console.table(list);


    list.forEach(function (elemento, indice, array) {

        var nombreProveedor = null;
        var estadoDesc = null;
        var boton = null;


        listProveedores.forEach(function (item, indice, array) {

            if (elemento.proveedorId == item.proveedorId) {

                nombreProveedor = item.nombre;
            }

        });

        listEstados.forEach(function (item, indice, array) {

            if (elemento.estadoOrdenCompraId == item.estadoOrdenCompraId) {

                estadoDesc = item.descripcion;
            }

        });


        if (estadoDesc != 'Recibido') {

            boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Marcar Recibido" onclick="MarcarRecibido(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-check"></i></button>';

        }
        else {

            boton ='';
        }


        if (indice == 0) {

            $('#dtOrdenes').append('<thead> <tr> <th>No. </th> <th>Fecha</th> <th>Fecha Recepción Requerida</th> <th>Proveedor</th> <th>Estado</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.ordenCompraId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.fechaRecepcion.split('T')[0] + '</td> <td>' + nombreProveedor + '</td>  <td>' + estadoDesc + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-trash"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar Productos" onclick="AsignarProductos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-cubes"></i></button> ' + boton + ' </td> </tr></tbody>');

        }
        else {

            $('#dtOrdenes').append('<tr> <td>' + elemento.ordenCompraId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.fechaRecepcion.split('T')[0] + '</td> <td>' + nombreProveedor + '</td> <td>' + estadoDesc + '</td> <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-trash"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar Productos" onclick="AsignarProductos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-cubes"></i></button> ' + boton + ' </td> </tr>');

        }

    })

}


async function RecuperarDatos(id) {

    var obj = {};

    let url = host + 'api/OrdenCompras';

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

            document.getElementById("txtOrdenId").value = obj.ordenCompraId;
            document.getElementById("slFecha").value = obj.fecha.split('T')[0];
            document.getElementById("slFechaRec").value = obj.fechaRecepcion.split('T')[0];
            $("#slProveedor").val(obj.proveedorId).change();


        })
        .catch(function (err) {
            console.log(err);
        });

}

async function Eliminar(id) {

    if (id > 0) {

        let url = host + 'api/OrdenCompras';
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


function AsignarProductos(id) {

    window.location.href = "detalleOrden.html?id=" + id;
}



function LimpiarForm() {

    document.getElementById("txtOrdenId").value = "";
    document.getElementById("slFecha").value = "";
    document.getElementById("slFechaRec").value = "";
    $("#slProveedor").val("").change();

}


let objProveedor = {};

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


async function LlenarProveedores() {

    await ObtenerProveedores();

    $("#slProveedor").empty();
    $('#slProveedor').append('<option value="" disabled selected>' + '--- Seleccione ---' + '</option>');

    console.log(listProveedores);

    listProveedores.forEach(function (obj) {

        $('#slProveedor').append('<option value="' + obj.proveedorId + '">' + obj.nombre + '</option>');

    });

}


async function MarcarRecibido(id) {

    var obj = {};

    let url = host + 'api/OrdenCompras';

    var Acum = 0;
    var AlmacenDisp = 0;

    await ObtenerDatosDetalles();
    await ObtenerAlmacenes();
    await ObtenerProveedores();


    listDet.forEach(function (item, indice, array) {

        if (item.ordenCompraId == id) {

            Acum += item.importe;
        }

    });

    if (AlmacenList.length > 0) {

        AlmacenDisp = AlmacenList[0].almacenId;

    }


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

            if (obj && obj != undefined) {

                //
                var oProv = {};

                listProveedores.forEach(function (prov) {

                    if (obj.proveedorId == prov.proveedorId) {

                        oProv = prov;

                    }

                });
                //

                obj.estadoOrdenCompraId = 2;

                let url = host + 'api/OrdenCompras';
                var respuesta = null;

                fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj),
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


                        //////
                        
                        var f = new Date();
                        var fecha = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();

                        var fechaVence = (f.getFullYear() + 3)+ "-" + (f.getMonth() + 1) + "-" + f.getDate();


                        if (fecha != "") {

                            let url = host + 'api/Facturas';
                            var respuesta = null;

                            fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "Fecha": fecha, "Importe": Acum, "Pendiente": (oProv.saldo + Acum),
                                    "Vence": fechaVence, "Descripcion": "Por Ingreso de Compra: " + id, "ProveedorId": obj.proveedorId,
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

                                    if (fecha != "") {

                                        let url = host + 'api/IngresoCompras';
                                        var res = null;

                                        fetch(url, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                "Fecha": fecha, "ProveedorId": obj.proveedorId, "AlmacenId": AlmacenDisp,
                                                "FacturaId": respuesta.facturaId, "OrdenCompraId": id,
                                            }),
                                            cache: 'no-cache'
                                        })
                                            .then(function (response) {
                                                console.log(response);
                                                return response.text();
                                            })
                                            .then(function (data) {
                                                res = JSON.parse(data);

                                                Swal.fire('Registro actualizado exitosamente', '', 'success');


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

                oProv.saldo += Acum; 

                fetch(url + "/" + obj.proveedorId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(oProv),
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

                Swal.fire('No se ha podido actualizar el registro', '', 'warning');
            }


        })
        .catch(function (err) {
            console.log(err);
        });

}



let listDet = [];

async function ObtenerDatosDetalles() {

    let url = host + 'api/OrdenCompraDetalles';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listDet = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}



let AlmacenList = [];

async function ObtenerAlmacenes() {

    let url = host + 'api/Almacenes';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            AlmacenList = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}
