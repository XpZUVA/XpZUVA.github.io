$(document).ready(function(){
    // Realizar la llamada a la API
    $.ajax({
        url: 'https://samuelencinas.dev/shows_parque/P03',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            // Limpiar el contenedor de shows
            $('#shows-container').empty();

            // Verificar si hay shows en la respuesta
            if (data && data.shows && data.shows.length > 0) {
                // Iterar sobre los shows de cada área
                $.each(data.shows[0], function(area, shows){
                    // Crear el HTML para los shows del área
                    var html = '<div id="' + area + 'esp"><h2>' + area + '</h2>';
                    if (shows && shows.length > 0) {
                        html += '<ul class="lista-espectaculos">';
                        $.each(shows, function(index, show){
                            html += '<li>' + '<h3>' +show.name + '</h3>' + '<br>';
                            if (show.hours && show.hours.length > 0) {
                                html += 'Horarios disponibles: ' + show.hours.join(', ') + '<br>';
                                // Obtener el próximo horario del espectáculo
                                var nextShowTime = getNextShowTime(show.hours);
                                // Calcular y mostrar el tiempo restante en tiempo real
                                if (nextShowTime) {
                                    var intervalId = setInterval(function() {
                                        var timeDifference = nextShowTime - new Date();
                                        if (timeDifference > 0) {
                                            var remainingHours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                                            var remainingMinutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                                            var remainingSeconds = Math.floor((timeDifference / 1000) % 60);
                                            html += 'Tiempo restante: ' + remainingHours + 'h ' + remainingMinutes + 'm ' + remainingSeconds + 's' + '<br>';
                                        } else {
                                            clearInterval(intervalId);
                                            html += 'Tiempo restante: No disponible<br>';
                                        }
                                        $('#'+area+'esp .remaining-time-' + index).text('Tiempo restante: ' + remainingHours + 'h ' + remainingMinutes + 'm ' + remainingSeconds + 's');
                                    }, 1000);
                                } else {
                                    html += 'Tiempo restante: No disponible<br>';
                                }
                                html += '<span class="remaining-time remaining-time-' + index + '"></span><br>';
                            } else {
                                html += 'No hay horarios disponibles<br>';
                            }
                            if(show.express) {
                                html += 'Express: Sí<br>';
                            } else {
                                html += 'Este espectáculo no tiene pase express<br>';
                            }
                            html += '</li>';
                        });
                        html += '</ul>';
                    } else {
                        html += '<p>No hay shows disponibles en esta área</p>';
                    }

                    // Agregar el HTML al contenedor
                    $('#shows-container').append(html);
                });
            } else {
                $('#shows-container').html('<p>No se encontraron shows para este parque.</p>');
            }
        },
        error: function(xhr, status, error){
            console.error('Error al obtener los datos:', error);
            $('#shows-container').html('<p>Ocurrió un error al obtener los datos de la API.</p>');
        }
    });
});

// Función para obtener el próximo horario de un espectáculo
function getNextShowTime(hours) {
    var now = new Date();
    for (var i = 0; i < hours.length; i++) {
        var [hour, minute] = hours[i].split(':');
        var showTime = new Date();
        showTime.setHours(parseInt(hour));
        showTime.setMinutes(parseInt(minute));
        if (showTime > now) {
            return showTime;
        }
    }
    return null;
}
