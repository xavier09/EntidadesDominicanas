$(document).ready(function () {
    const currentPath = window.location.pathname;

    $('nav ul li').each(function () {
        const anchorTag = $(this).find('a');
        if (anchorTag.attr('href') === currentPath) {
            $(this).addClass('active');
        }
    });
});



function GenerarTokenJwt() {

    $.ajax({
        url: "http://localhost:5046/api/EntidadesGubernamentalesDominicanas/GenerarJwtToken",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ Clave: $('#clave').val(), NombreUsuario: $('#nombreUsuario').val() }),
        traditional: true,
        success: function (response) {
            Swal.fire({
                title: response.mensaje,
                icon: "info",
                draggable: true
            });
            localStorage.setItem('jwtToken', response.token);
            $('#nombreUsuario').val('')
            $('#clave').val('')
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 403) {
                Swal.fire({
                    title: "No tiene permisos para acceder a este recurso.",
                    icon: "info",
                    draggable: true
                });
            }
            else if (jqXHR.status === 0) {
                Swal.fire({
                    title: "No hay conexion con el servidor",
                    icon: "info",
                    draggable: true
                });
            }
            else {
                Swal.fire({
                    title: "ha ocurrido un error. Intente de nuevo mas tarde.",
                    icon: "info",
                    draggable: true
                });
            }
        }
    });
}

function RegistrarEntidad() {

    const token = localStorage.getItem('jwtToken'); // Example using localStorage

    if (!token) {
        Swal.fire({
            title: "No se encontro un token. Por favor valla a inicio y genere uno.",
            icon: "info",
            draggable: true
        });
        return; 
    }

    $.ajax({
        url: "http://localhost:5046/api/EntidadesGubernamentalesDominicanas/RegistrarEntidad",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ IdEntidad: generateUUID(), NombreEntidad: $('#nombre_entidad').val() }),
        traditional: true,

        headers: { "Authorization": "Bearer " + token },

        success: function (response) {
            $('#nombre_entidad').val('')
            Swal.fire({
                title: response.mensaje,
                icon: "info",
                draggable: true
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
                if (jqXHR.responseJSON && jqXHR.responseJSON.mensaje) {
                    Swal.fire({
                        title: jqXHR.responseJSON.mensaje,
                        icon: "info",
                        draggable: true
                    });
                } else {
                    Swal.fire({
                        title: "No autorizado. Por favor valla inicio y genere un token.",
                        icon: "info",
                        draggable: true
                    });
                }
            } else if (jqXHR.status === 403) {
                Swal.fire({
                    title: "No tiene permisos para acceder a este recurso.",
                    icon: "info",
                    draggable: true
                });
            }
            else if (jqXHR.status === 0) {
                Swal.fire({
                    title: "No hay conexion con el servidor",
                    icon: "info",
                    draggable: true
                });
            }
            else {
                Swal.fire({
                    title: "ha ocurrido un error. Intente de nuevo mas tarde.",
                    icon: "info",
                    draggable: true
                });
            }
        }
    });

}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


