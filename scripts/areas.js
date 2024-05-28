// Función para obtener favoritos desde localStorage
function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : {};
}

// Función para guardar favoritos en localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Hacer una solicitud para obtener el JSON de tiempos de espera
fetch('/datos/ej3.json')
    .then(response => response.json())
    .then(waitTimesData => {
        console.log("JSON de tiempos de espera:", waitTimesData);  // Debugging output
        const waitTimes = {};
        waitTimesData.atracciones.forEach(item => {
            const [key, value] = Object.entries(item)[0];
            waitTimes[key] = value;
        });

        // Hacer una solicitud para obtener el XML
        return fetch('/datos/ej2.xml').then(response => response.text()).then(xmlText => {
            return { xmlText, waitTimes };
        });
    })
    .then(({ xmlText, waitTimes }) => {
        // Crear un nuevo parser XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        console.log("XML Document:", xmlDoc);  // Debugging output

        // Mapeo de acrónimos
        const areaAcronyms = {
            "Plaza mayor": "PLA",
            "The Far West": "TFW",
            "Territorio pirata": "PIR",
            "Cool Children Land": "CCL",
            "Calle futura": "FUT"
        };

        // Obtener los favoritos de localStorage
        const favorites = getFavorites();

        // Seleccionar todas las áreas
        const areas = xmlDoc.querySelectorAll('area');

        // Iterar sobre cada área y generar el HTML correspondiente
        areas.forEach((area, areaIndex) => {
            const nombre = area.getAttribute('nombre');
            const decoracionNode = area.querySelector('decoracion');
            const decoracion = decoracionNode ? decoracionNode.textContent : '';

            // Obtener el acrónimo del nombre del área
            const areaAcronym = areaAcronyms[nombre];
            console.log(`Procesando área: ${nombre} (${areaAcronym})`);  // Debugging output

            // Verificar si hay al menos una atracción en el área
            const atracciones = area.querySelectorAll('atraccion');
            if (atracciones.length > 0 && areaAcronym) {
                // Crear el HTML de las atracciones en forma de tabla
                let atraccionesHTML = `<table border="1" id="${areaAcronym}" class="table">`;

                // Agregar el nombre del área y su decoración en la primera fila
                atraccionesHTML += `
                <tr>
                    <td colspan="11">${nombre} - ${decoracion}</td>
                </tr>
                <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Nivel de intensidad</th>
                    <th>Altura mínima</th>
                    <th>Altura máxima</th>
                    <th>Acceso express</th>
                    <th>Tiempo de espera</th>
                    <th>Tiempo de espera express</th>
                    <th>Favorito</th>
                </tr>
                `;

                atracciones.forEach((atraccion, atraccionIndex) => {
                    const nombreComercialNode = atraccion.querySelector('nombreComercial');
                    const estadoNode = atraccion.querySelector('estado');
                    const tipoNode = atraccion.querySelector('tipo');
                    const lvlIntensidadNode = atraccion.querySelector('lvlIntesidad');
                    const alturaMinNode = atraccion.querySelector('alturaMin');
                    const alturaMaxNode = atraccion.querySelector('alturaMax');
                    const accesoExpressNode = atraccion.querySelector('accesoExpress');

                    // Generar una clave única para la atracción
                    const attractionKey = `${areaAcronym}-${String(atraccionIndex + 1).padStart(2, '0')}`;

                    // Obtener los tiempos de espera del JSON
                    const waitTime = waitTimes[attractionKey] ? waitTimes[attractionKey][0] : 'N/A';
                    const expressWaitTime = waitTimes[attractionKey] ? (waitTimes[attractionKey][1] !== -1 ? waitTimes[attractionKey][1] : 'N/A') : 'N/A';

                    // Determinar si la atracción es favorita
                    const isFavorite = favorites[attractionKey] ? true : false;

                    var classEstado = ''; 
                    var nvlIntesidad = '';
                    var express = '';
                    var classTipo = '';

                    // Agregar al HTML solo si los nodos esenciales existen
                    if (nombreComercialNode && estadoNode && lvlIntensidadNode && accesoExpressNode) {
                        if(estadoNode.textContent === 'OP'){
                            classEstado = 'bg-success';
                        } else if(estadoNode.textContent === 'OB'){
                            classEstado = 'bg-warning';
                        } else if(estadoNode.textContent === 'CE'){
                            classEstado = 'bg-danger';
                        }

                        if(lvlIntensidadNode.textContent === 'Suave'){
                            nvlIntesidad = 'text-success';
                        } else if(lvlIntensidadNode.textContent === 'Moderada'){
                            nvlIntesidad = 'text-warning';
                        } else if(lvlIntensidadNode.textContent === 'Intensa'){
                            nvlIntesidad = 'text-danger';
                        }

                        if(accesoExpressNode.textContent === 'true'){
                            express = 'bg-success';
                            accesoExpressNode.textContent = 'Sí';
                        } else {
                            accesoExpressNode.textContent = 'No';
                            express = 'bg-danger';
                        }

                        if(tipoNode){
                            if(tipoNode.textContent === 'Acuática'){
                                classTipo = 'text-info';
                            } else if(tipoNode.textContent === 'Montaña rusa'){
                                classTipo = 'text-green';    
                            } else if(tipoNode.textContent === 'Infantil'){
                                classTipo = 'text-pink';
                            } else if(tipoNode.textContent === 'Giratoria'){
                                classTipo = 'text-purple';
                            }
                        } else {
                            classTipo = 'text-secondary';
                        }

                        atraccionesHTML += `
                        <tr>
                            <td>${nombreComercialNode.textContent}</td>
                            <td class="${classEstado}">${estadoNode.textContent}</td>
                            <td class="${classTipo}">${tipoNode ? tipoNode.textContent : 'N/A'}</td>
                            <td class="${nvlIntesidad}">${lvlIntensidadNode.textContent}</td>
                            <td>${alturaMinNode ? alturaMinNode.textContent : 'N/A'}</td>
                            <td>${alturaMaxNode ? alturaMaxNode.textContent : 'N/A'}</td>
                            <td class="${express}">${accesoExpressNode.textContent}</td>
                            <td>${waitTime}</td>
                            <td>${expressWaitTime}</td>
                            <td>
                                <div class="checkbox-wrapper-50">
                                    <input type="checkbox" class="plus-minus favorite-checkbox" data-key="${attractionKey}" ${isFavorite ? 'checked' : ''}>
                                </div>
                            </td>
                        </tr>
                        `;
                    }
                });

                atraccionesHTML += '</table>';

                // Agregar el HTML generado al documento
                const areaContainer = document.createElement('div');
                areaContainer.innerHTML = atraccionesHTML;
                document.getElementById('areas-container').appendChild(areaContainer);
            }
        });

        // Evento para manejar el cambio de estado de las checkboxes
        document.querySelectorAll('.favorite-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const key = this.getAttribute('data-key');
                const attractionName = this.closest('tr').querySelector('td:first-child').textContent; // Obtener el nombre de la atracción
                if (this.checked) {
                    favorites[key] = attractionName;
                } else {
                    delete favorites[key];
                }
                saveFavorites(favorites);
                console.log("Favoritos guardados:", favorites); // Debugging output
            });
        });
    })
    .catch(error => console.error('Error al obtener los datos:', error));
