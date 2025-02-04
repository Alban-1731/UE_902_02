
// Création des fonds de carte
var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: "OpenStreetMap",
    type: "base",
    visible: true
});

var googleSatelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attributions: '© Google Maps'
    }),
    title: "Google Satellite",
    type: "base",
    visible: false
});

// Création de la couche WMS
var wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://www.geotests.net/geoserver/dumont/wms',
        params: {
            'LAYERS': 'Sample_BD_foret_T31TCJ',
            'FORMAT': 'image/png',
            'TRANSPARENT': true
        },
        serverType: 'geoserver',
        attributions: 'Geoserver WMS'
    }),
    title: "Sample Forêt",
    type: "overlay",
    visible: true
});

// Création de la carte avec LayerSwitcher
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Group({
            title: "Fonds de carte",
            layers: [osmLayer, googleSatelliteLayer]
        }),
        new ol.layer.Group({
            title: "Couches supplémentaires",
            layers: [wmsLayer]
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([1.3829, 43.4590]), // Paris
        zoom: 10
    })
});

// Ajout du LayerSwitcher
var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: "Changer les couches", // Texte affiché au survol
    groupSelectStyle: "children" // Permet de sélectionner un fond de carte à la fois
});
map.addControl(layerSwitcher);
