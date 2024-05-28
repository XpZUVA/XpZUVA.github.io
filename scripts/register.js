$(document).ready(function(){

    var errorMessage = '';
    $('.errorMessages').hide();

    $('#formRegister').on('submit', function(event){
        event.preventDefault();

        var name = $('#name').val();
        var lastname = $('#lastname').val();
        var user = $('#username').val().trim();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#passwordRepeat').val();

        var nameRegex = /^[A-Za-z\s]+$/;
        var userRegex = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var passwordRegex = /^[A-Za-z\d@$!%*?&]{8,}$/;

        var isValid = true;
        

        if (!nameRegex.test(name)) {
            isValid = false;
            errorMessage += 'Por favor ingresa un nombre válido.<br>';
        }
        if(!nameRegex.test(lastname)){
            isValid = false;
            errorMessage += 'Por favor ingresa un apellido válido.<br>';
        }
        if (!userRegex.test(user)) {
            isValid = false;
            errorMessage += 'Usuario inválido. Debe tener entre 3 y 20 caracteres y no puede contener dos puntos ni guiones ni espacios.';
        }
        if (!emailRegex.test(email)) {
            isValid = false;
            errorMessage += 'Por favor ingresa un email válido.<br>';
        }
        if (!passwordRegex.test(password)) {
            isValid = false;
            errorMessage += 'La contraseña debe tener al menos 8 caracteres y puede incluir letras, números y caracteres especiales.<br>';
        }
        if (password !== confirmPassword) {
            isValid = false;
            errorMessage += 'Las contraseñas no coinciden.<br>';
        }
        

        if (!isValid) {
            $('.errorMessages').show();
            $('.errorMessages').html(errorMessage);
        } else {
            $('.errorMessages').hide();
            localStorage.setItem('loggedIn', true);
            localStorage.removeItem('profile-img');
            localStorage.setItem('username', user);
            window.location.href = 'index.html'; 
        }

    });
    
});