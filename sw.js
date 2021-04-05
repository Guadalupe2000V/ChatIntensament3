// Vera Chisco Guadalupe
// Importaciones
importScripts('js/sw-utils.js');

// Creacion de las tres constantes para almacenar los tres tipos de cache
const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

// Corazon de la aplicacion
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/Intensamente.ico',
    '/img/avatars/Alegria.jpg',
    '/img/avatars/Desagrado.jpg',
    '/img/avatars/Furia.jpg',
    '/img/avatars/Temor.jpg',
    '/img/avatars/Tristeza.jpg',
    '/js/app.js',
    '/js/sw-utils.js'
];

// Cache inmutable
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// Evento de instalacion
self.addEventListener('install', e=>{

    // Pasamos los archivos al cache estatic0
    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));

    // Pasamos los archivos al cache inmutable
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE));

    // Esperamos a que los caches finalizen
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

// Evento de activacion
self.addEventListener('activate', e=>{
    const respuesta = caches.keys().then(keys=>{
        keys.forEach(key=>{
            // Static-v1
            if(key!=STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch',e=>{
    const respuesta = caches.match(e.request).then(res=>{
        if(res){
            return res;
        }
        else{
            return fetch(e.request).then(newResp=>{
                return actualizarCacheDinamico(DYNAMIC_CACHE,e.request,newResp);
            });
        }
    });
    e.respondWith(respuesta);
});