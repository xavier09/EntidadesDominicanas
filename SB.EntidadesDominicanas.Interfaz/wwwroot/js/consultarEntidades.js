$(document).ready(function () {
    ConsultarEntidades()
});

function ConsultarEntidades() {


    const token = localStorage.getItem('jwtToken'); // Example using localStorage

    if (!token) {
        Swal.fire({
            title: "No se encontro un token. Por favor valla a inicio y genere uno.",
            icon: "info",
            draggable: true
        });
        return; // Or redirect to login
    }

    $.ajax({
        url: "https://localhost:7244/api/EntidadesGubernamentalesDominicanas/ConsultarListaEntidades",
        type: "GET",
        contentType: "application/json",
        //data: JSON.stringify({ IdEntidad: generateUUID(), NombreEntidad: $('#nombre_entidad').val() }),
        traditional: true,

        headers: { "Authorization": "Bearer " + token },

        success: function (response) {
            mostrarDataTable(response)
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


function mostrarDataTable(json) {
    var jsonData = JSON.parse(json)

    var DataTable = $("#dataTable").DataTable({
        responsive: true,
        data: jsonData,
        destroy: true, 
        dom: 'Bfrtip',
        columns:
            [
                { title: "Id entidad", data: "IdEntidad" , defaultContent: "-" },
                { title: "Nombre entidad", data: "NombreEntidad", defaultContent: "-" },
                {
                    title: "Accion 1",
                    defaultContent: "-",
                    render: function (e, type, data, index) {
                        return '<button type="button" id="detalle' + data.IdEntidad + '" data-id="' + data.IdEntidad + '" onclick="actualizar(' + '\'' + data.IdEntidad + '\'' + "," + '\'' + data.NombreEntidad + '\'    )" class="btn btn-primary"><span data-v-081c0a81="" class="icon is-small"><i class="fa fa-eye"></i></span> Editar</button>';

                    }
                },
                {
                    title: "Accion 2",
                    render: function (e, type, data, index) {
                        return '<button type="button" id="editar' + data.IdEntidad + '" data-id="' + data.IdEntidad + '" onclick="borrar(' + '\'' + data.IdEntidad + '\'' + "," + '\'' + data.NombreEntidad + '\'  )" class="btn btn-danger"><span data-v-081c0a81="" class="icon is-small"><i class="fas fa-edit"></i></span> Borrar</button>';
                    }
                    , defaultContent: "-"
                },
            ],
  
       
        columnDefs: [
            {
                defaultContent: "-", "targets": "_all",
                className: 'dt-body-left'
            }
        ],
        "language": {
            "url": "../json/datatableSpanish.json"
        },
        "info": false,
        "scrollCollapse": false,
        "paging": false

    });

}

function actualizar(idEntidad, nombreEntidad) {


    $('#ModalActualizar').modal('show');


    $('#idEntidad').val(idEntidad);
    $('#nombreEntidad').val(nombreEntidad);
    $("#idEntidadButton").val(idEntidad);
}

function ActualizarData() {
    const token = localStorage.getItem('jwtToken');
     
    if (!token) {
        Swal.fire({
            title: "No se encontro un token. Por favor valla a inicio y genere uno.",
            icon: "info",
            draggable: true
        });
        return; // Or redirect to login
    }

    $.ajax({
        url: "https://localhost:7244/api/EntidadesGubernamentalesDominicanas/ActualizarNombreEntidad",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ IdEntidad: $('#idEntidadButton').val(), NombreEntidad: $("#nombreEntidad").val() }),
        traditional: true,

        headers: { "Authorization": "Bearer " + token },

        success: function (response) {
            Swal.fire({
                title: response.mensaje,
                icon: "info",
                draggable: true
            });
            $('#ModalActualizar').modal('toggle');
            ConsultarEntidades()
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

function borrar(idEntidad, nombreEntidad) {

    const token = localStorage.getItem('jwtToken');

    if (!token) {
        Swal.fire({
            title: "No se encontro un token. Por favor valla a inicio y genere uno.",
            icon: "info",
            draggable: true
        });
        return; // Or redirect to login
    }

    $.ajax({
        url: "https://localhost:7244/api/EntidadesGubernamentalesDominicanas/BorrarEntidad",
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify({ IdEntidad: idEntidad, nombreEntidad : nombreEntidad }),
        traditional: true,

        headers: { "Authorization": "Bearer " + token },

        success: function (response) {
            Swal.fire({
                title: response.mensaje,
                icon: "info",
                draggable: true
            });
            ConsultarEntidades()
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




function CerrarModal() {
    $('#ModalActualizar').modal('toggle');
}