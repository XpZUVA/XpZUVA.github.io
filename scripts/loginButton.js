$(document).ready(function(){
    // Redirección al hacer clic en el botón de navegación
    $('#logout').on('click', function(){
        localStorage.removeItem('username');
        localStorage.removeItem('favorites');
        localStorage.removeItem('profile-img');
        localStorage.setItem('loggedIn', false);
        window.location.href = 'index.html';
    });
});
