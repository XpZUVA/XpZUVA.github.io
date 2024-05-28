$(document).ready(function(){

    const defaultProfileImg = '/assets/imagenes/default-profile.png'; 

    $('#accountButton').on('click', function(event){
        window.location.href = 'cuenta.html';
    });

    $('#file-input').on('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#profile-img').attr('src', e.target.result);
                localStorage.setItem('profile-img', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Función para obtener favoritos desde localStorage
    function getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : {};
    }

    // Función para mostrar las atracciones favoritas
    function showFavorites() {
        // Obtener los favoritos de localStorage
        const favorites = getFavorites();
        const username = localStorage.getItem('username') || 'Anónimo';
        const profileImg = localStorage.getItem('profile-img') || defaultProfileImg; // Usar imagen predeterminada si no hay imagen en localStorage

        // Crear la imagen de perfil y el input para subir una nueva imagen
        let profileImageHTML = `<img id="profile-img" src="${profileImg}" alt="Imagen de perfil" class="profile-img">`;

        // Crear una lista para las atracciones favoritas
        let favoritesListHTML = `<h2>${username}</h2><div class="atraccionesFav"><h3>Atracciones favoritas</h3><ul>`;

        // Iterar sobre los favoritos y agregarlos a la lista HTML
        for (const key in favorites) {
            if (favorites[key]) {
                const attractionName = favorites[key];  // Obtener el nombre de la atracción
                favoritesListHTML += `<li>${attractionName}</li>`;
            }
        }

        favoritesListHTML += '</ul></div>';

        // Agregar la lista de favoritos y la imagen de perfil al contenedor en el HTML
        $('#profile-image').html(profileImageHTML);
        $('.profile-info').html(favoritesListHTML);

        // Reasignar el event listener al nuevo input de archivo
        $('#file-input').on('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#profile-img').attr('src', e.target.result);
                    localStorage.setItem('profile-img', e.target.result);
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Llamar a la función para mostrar las atracciones favoritas al cargar el documento
    showFavorites();

    $('#logoutButton').on('click', function(event){
        localStorage.removeItem('username');
        localStorage.removeItem('favorites');
        localStorage.removeItem('profile-img');
        localStorage.setItem('loggedIn', false);
        window.location.href = 'index.html';
    });

});
