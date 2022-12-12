var map = L.map('main_map').setView([10.974177, -63.865009], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* var marker = L.marker([10.970695, -63.866047]).addTo(map);
var marker = L.marker([10.971080, -63.852224]).addTo(map);
var marker = L.marker([10.966126, -63.863365]).addTo(map); */

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(map);
        });
    }
});

$.ajax({
    dataType: "json",
    url: "bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(map);
        });
    }
});