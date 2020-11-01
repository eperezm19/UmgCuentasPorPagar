
$(document).ready(function () {


    let session = {};

    session = JSON.parse(sessionStorage.getItem('SessionCP'));

    if (session == undefined || session == null) {

        if (document.title == "Cuentas por Pagar - Inicio") {

            console.log(document.title); 

            sessionStorage.setItem('SessionCP', JSON.stringify(null));
            window.location.href = "pages/login.html";
        }
        else {

            sessionStorage.setItem('SessionCP', JSON.stringify(null));
            window.location.href = "login.html";
        }
        
    }


  $("#menu-toggle").click(function(e) {

    e.preventDefault();
    $("#wrapper").toggleClass("toggled");

  });


});


function CerrarSesion(url) {

    sessionStorage.setItem('SessionCP', JSON.stringify(null));

    window.location.href = url;
}


function exportTableToExcel(tableID, filename = '') {

    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Nombre de archivo
    filename = filename ? filename + '.xls' : 'reporte.xls';

    // Se crea elemento downloadLink
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {

        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });

        navigator.msSaveOrOpenBlob(blob, filename);

    } else {
        // Crear link hacia el archivo
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Dar nombre
        downloadLink.download = filename;

        //desencadenante de la funcion
        downloadLink.click();
    }

}