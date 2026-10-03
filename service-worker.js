const CACHE_NAME = "regalos-detalles-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./js/app.js",
    "./data/productos.json",
    "./manifest.webmanifest",

    "./images/fondo-regalos.jpg",
    "./images/hero-regalos.jpg",
    "./images/icon-192.png",
    "./images/icon-512.png",

    "./images/taza-personalizada.jpg",
    "./images/taza-magica.jpg",
    "./images/taza-floral.jpg",
    "./images/globo-numero.jpg",
    "./images/globo-corazon.jpg",
    "./images/bouquet-globos.jpg",
    "./images/caja-regalo.jpg",
    "./images/peluche.jpg",
    "./images/set-regalo.jpg",
    "./images/vela.jpg",
    "./images/cortina.jpg",
    "./images/guirnalda.jpg",
    "./images/kit-cumpleanos.jpg",
    "./images/playera.jpg",
    "./images/termo.jpg",
    "./images/llavero.jpg",
    "./images/globo-frase.jpg",
    "./images/taza-pareja.jpg",
    "./images/numero-decorativo.jpg",
    "./images/canasta.jpg",

    "./audio/musica-regalos.mp3"
];


/* =========================================
   INSTALACIÓN
========================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(ARCHIVOS);

            })

    );

    self.skipWaiting();

});


/* =========================================
   ACTIVACIÓN
========================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(nombres => {

                return Promise.all(

                    nombres
                        .filter(nombre => nombre !== CACHE_NAME)
                        .map(nombre => caches.delete(nombre))

                );

            })

    );

    self.clients.claim();

});


/* =========================================
   PETICIONES
========================================= */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(respuestaCache => {

                if (respuestaCache) {

                    return respuestaCache;

                }

                return fetch(event.request);

            })

    );

});
