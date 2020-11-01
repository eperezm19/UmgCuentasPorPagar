
$(document).ready(function () {

    $("#menu-toggle").click(function (e) {

        e.preventDefault();
        $("#wrapper").toggleClass("toggled");

    });


    $("#btnAcceder").click(function (e) {

        e.preventDefault();

        var usuario = document.getElementById("txtUsuario").value;
        var contrasenia = document.getElementById("txtContrasenia").value;

        ValidarCredenciales(usuario, contrasenia);


    });


});



//local
//let host = "https://localhost:44396/";

//server azure
let host = "https://cuentasporpagarumg.azurewebsites.net/";


let dataUsuario = {}

async function ValidarCredenciales(usuario, contrasenia) {

    let url = host + 'api/Usuarios';
    var respuesta = null;

    if (usuario != "" && contrasenia != "") {


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "Correo": usuario, "Contraseña": contrasenia, "Nombre": "-", "RolId": 0, }),
            cache: 'no-cache'
        })
            .then(function (response) {
                console.log(response);
                return response.text();
            })
            .then(function (data) {


                if (data != undefined && data != null && data != "") {

                    respuesta = JSON.parse(data);

                    console.log(respuesta);

                    if (respuesta && respuesta.correo != undefined && respuesta.correo != null) {


                        sessionStorage.setItem('SessionCP', JSON.stringify(respuesta));

                        window.location.href = "../index.html";

                    }
                    else {

                        Swal.fire('Usuario o contraseña incorrectos', '', 'warning');
                    }
                    
                }
                else {

                    Swal.fire('Usuario o contraseña incorrectos', '', 'warning');
                }

            })
            .catch(function (err) {
                console.log(err);
            });

    }
    else {

        Swal.fire('Se deben completar las credenciales.', '', 'info');
    }

}
