var map = new ol.Map({
    target: 'map', // ID du conteneur HTML où afficher la carte
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() // Fond de carte OpenStreetMap
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([1.3829, 43.4590]), // Coordonnées de Paris
        zoom: 10
    })
});