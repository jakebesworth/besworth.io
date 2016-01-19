/*
window.onload = function() {

    var userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.indexOf('safari') > -1) {

	var menu = document.getElementById('menu');

	if(typeof menu !== 'undefined') {

            menu.style.marginBottom = '-2px';
            menu.style.marginLeft = '-2px';
        }
    }
}
*/
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

    if(typeof element !== 'undefined' && typeof ms !== 'undefined') {

        if(element.style.display == 'none') {

            fadeIn(element, ms);
        }
        else {

            fadeOut(element, ms);
        }
    }
}

function menu(id) {

    if(document.getElementById('main-' + id).style.display === 'none') {

        document.getElementById('main-home').style.display = 'none';
        document.getElementById('main-adknown').style.display = 'none';
        document.getElementById('main-jobs').style.display = 'none';
        document.getElementById('main-goals').style.display = 'none';
        document.getElementById('main-conclusions').style.display = 'none';

        document.getElementById('menu-home').className = 'menu-button';
        document.getElementById('menu-adknown').className = 'menu-button';
        document.getElementById('menu-jobs').className = 'menu-button';
        document.getElementById('menu-goals').className = 'menu-button';
        document.getElementById('menu-conclusions').className = 'menu-button';

        fadeIn(document.getElementById('main-' + id), 300);
        document.getElementById('menu-' + id).className = 'menu-button-selected';
    }
}

function fadeIn(element, ms) {

    if(typeof element !== 'undefined' && typeof ms !== 'undefined') {

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

    if(typeof element !== 'undefined' && typeof ms !== 'undefined') {
   
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
