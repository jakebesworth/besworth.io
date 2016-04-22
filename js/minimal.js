function setCookie(name, value, path, expiration) {

    document.cookie = name + "=" + value + ';path=' + path + ';expires=' + expiration;
}

function deleteCookie(name) {

    document.cookie = name + "=;expires=Thu, 01, Jan 1970 00:00:01 GMT;";
}

function refresh() {
    window.location = window.location.href;
}

function hideshow(id, ms) {
    element = document.getElementById(id);

    if(defined(element) && defined(ms)) {

        if(element.style.display === 'none') {

            fadeIn(element, ms);
        }
        else {

            fadeOut(element, ms);
        }
    }
}

function defined(element) {

    return typeof element !== 'undefined' && element !== null;
}

function menu(id) {

    var clickedButton = document.getElementById('menu-' + id);
    var clickedElement = document.getElementById('main-' + id);

    if(defined(clickedButton) && defined(clickedElement) && clickedElement.style.display === 'none') {

        var buttons = document.getElementsByTagName('button');

        for(var i = 0; i < buttons.length; i++) {

            var button = buttons[i];
            var buttonElement = document.getElementById('main-' + button.id.replace('menu-', ''));

            if(defined(buttonElement)) {

                if(buttonElement.style.display === 'block') {

                    buttonElement.style.display = 'none';
                }

                if(button.className === 'menu-button-selected') {

                    button.className = 'menu-button';
                }
            }
        }

        fadeIn(clickedElement, 300);
        clickedButton.className = 'menu-button-selected';
    }
}

function fadeIn(element, ms) {

    if(defined(element) && defined(ms)) {

        element.style.opacity = 0;
        element.style.display = 'block';
        element.style.filter = "alpha(opacity=0)";
    
        var opacity = 0;
        var interval = setInterval(function() {

            opacity += 50 / ms;
            if(opacity >= 1) {

                clearInterval(interval);
                opacity = 1;
            }

            element.style.opacity = opacity;
            element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50);
    }
}


function fadeOut(element, ms) {

    if(defined(element) && defined(ms)) {
   
        var opacity = 1;
        var interval = setInterval( function() {

          opacity -= 50 / ms;
          if(opacity <= 0) {

            clearInterval(interval);
            opacity = 0;
            element.style.display = "none";
          }

          element.style.opacity = opacity;
          element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50);
    }
}
