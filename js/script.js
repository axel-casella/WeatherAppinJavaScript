//Capturo elementos
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i"),
backgroundvideo = document.querySelector("#background-video");
const body = document.querySelector('.body');

let api;

inputField.addEventListener("keyup", e =>{
    // Si el usuario presiona enter btn y el valor del input no está vacio
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // Si el navegador admite API geolocalización
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Su navegador no es compatible con la api de geolocalización");
    }
});

//request
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=YOURAPIKEYHERE`;
    fetchData();
}

//lat y lon
function onSuccess(position){
    const {latitude, longitude} = position.coords; // obteniendo lat y lon del dispositivo del usuario del objeto
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=YOURAPIKEYHERE`;
    fetchData();
}

function onError(error){
    // Si ocurre algún error al obtener la ubicación del usuario lo muestro en infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

//Convierto a fetch en una función (fetchData)
function fetchData(){
    infoTxt.innerText = "Obteniendo detalles del clima...";
    infoTxt.classList.add("pending");
    // Obteniendo la respuesta de la API y devolviendola 
    // Luego llamo a la función weatherDetails pasandole el resultado de la API como argumento
    fetch(api)
    .then(res => res.json())
    .then(result => weatherDetails(result))
    .catch(() =>{
        infoTxt.innerText = "¡Ups! Algo salió mal";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){ // Si el nombre de la ciudad ingresado por el usuario no es válido
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} no es un nombre de ciudad válido`;
    }else{
        //Obtener el valor de las propiedades requeridas apartir de la info meteorológica
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, temp_min, temp_max, feels_like, humidity, pressure} = info.main;
        const {speed} = info.wind;
       
        //Guardo los datos en el localstorage y los seteo
        localStorage.setItem('city',  JSON.stringify(city));
        localStorage.setItem('country',  JSON.stringify(country));
        localStorage.setItem('description',  JSON.stringify(description));
        localStorage.setItem('id',  JSON.stringify(id));
        localStorage.setItem('main1',  JSON.stringify(Math.floor(temp)));
        localStorage.setItem('main2',  JSON.stringify(Math.floor(temp_min)));
        localStorage.setItem('main3',  JSON.stringify(Math.floor(temp_max)));
        localStorage.setItem('main4',  JSON.stringify(Math.floor(feels_like)));
        localStorage.setItem('main5',  JSON.stringify(Math.floor(humidity)));
        localStorage.setItem('main6',  JSON.stringify(Math.floor(pressure)));
        localStorage.setItem('speed',  JSON.stringify(Math.floor(speed)));

        // Uso el ícono del clima personalizado que me provee la documentación de la API
        // Luego cambio su fondo dinamicamente de acuerdo al clima
        if(id == 800){
            wIcon.src = "icons/clear.svg";
            backgroundvideo.src = "videos/clear.mp4";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";
            backgroundvideo.src = "videos/storm.mp4";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
            backgroundvideo.src = "videos/snow.mp4";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
            backgroundvideo.src = "videos/haze.mp4";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
            backgroundvideo.src = "videos/cloud.mp4";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
            backgroundvideo.src = "videos/rain.mp4";
        }
        
        //Paso la información meteorológica a un elemento en particular
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-1").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(temp_min);
        weatherPart.querySelector(".temp .numb-3").innerText = Math.floor(temp_max);
        weatherPart.querySelector(".temp .numb-4").innerText = Math.floor(speed);
        weatherPart.querySelector(".temp .numb-5").innerText = Math.floor(pressure);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");

    }
}

//Regresar hacia atrás
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    backgroundvideo.src = "";
    body.style.backgroundImage = 'radial-gradient(circle at 50% -20.71%, #ade5ff 0, #7dcefb 25%, #3cb5f2 50%, #009ce9 75%, #0085e0 100%)';
});

//Cada vez que recargo la página hago un get del localstorage y muestro la última búsqueda
/*(() => {
    const lscity = localStorage.getItem('city');
    const lscountry = localStorage.getItem('country');
    const lsdescription = localStorage.getItem('description');
    const lsid = localStorage.getItem('id');
    const lsmain1 = localStorage.getItem('main1');
    const lsmain2 = localStorage.getItem('main2');
    const lsmain3 = localStorage.getItem('main3');
    const lsmain4 = localStorage.getItem('main4');
    const lsmain5 = localStorage.getItem('main5');
    const lsmain6 = localStorage.getItem('main6');
    const lsspeed = localStorage.getItem('speed');
    //console.log(lscity, lscountry, lsid, lsdescription, lsmain1, lsmain2, lsmain3, lsmain4, lsmain5, lsmain6, lsspeed);
    //Paso la información meteorológica a un elemento en particular
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(lsmain1);
    weatherPart.querySelector(".weather").innerText = lsdescription;
    weatherPart.querySelector(".location span").innerText = `${lscity}, ${lscountry}`;
    weatherPart.querySelector(".temp .numb-1").innerText = Math.floor(lsmain2);
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(lsmain3);
    weatherPart.querySelector(".temp .numb-3").innerText = Math.floor(lsmain4);
    weatherPart.querySelector(".temp .numb-4").innerText = Math.floor(lsspeed);
    weatherPart.querySelector(".temp .numb-5").innerText = Math.floor(lsmain5);
    weatherPart.querySelector(".humidity span").innerText = `${lsmain6}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");

    // Uso el ícono del clima personalizado que me provee la documentación de la API
        // Luego cambio su fondo dinamicamente de acuerdo al clima
        if(lsid == 800){
            wIcon.src = "icons/clear.svg";
            backgroundvideo.src = "videos/clear.mp4";
        }else if(lsid >= 200 && lsid <= 232){
            wIcon.src = "icons/storm.svg";
            backgroundvideo.src = "videos/storm.mp4";  
        }else if(lsid >= 600 && lsid <= 622){
            wIcon.src = "icons/snow.svg";
            backgroundvideo.src = "videos/snow.mp4";
        }else if(lsid >= 701 && lsid <= 781){
            wIcon.src = "icons/haze.svg";
            backgroundvideo.src = "videos/haze.mp4";
        }else if(lsid >= 801 && lsid <= 804){
            wIcon.src = "icons/cloud.svg";
            backgroundvideo.src = "videos/cloud.mp4";
        }else if((lsid >= 500 && lsid <= 531) || (lsid >= 300 && lsid <= 321)){
            wIcon.src = "icons/rain.svg";
            backgroundvideo.src = "videos/rain.mp4";
        }

})(); */

/*Si se descomenta el código desde la línea 137 , el localstorage funciona, pero me muestra los datos en null
la primera vez.... solo la comente para que no quede tan mal la primera vez que entras... una vez que ya guarda
información por primera vez , funciona bien la función de recargar la página y te muestra tu última búsqueda.*/



