// Initialisation de la carte centrée sur Toulouse
const map = L.map('map').setView([43.55, 1.3829], 10);

// Fond de carte OpenStreetMap
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fond de carte satellite Esri
const esriSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
});

// Fond de carte satellite Google
const googleSatelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Maps'
});

wmsLayerCode_Pred = L.tileLayer.wms('https://www.geotests.net/geoserver/dumont/wms', {
    layers: 'dumont:Sample_BD_foret_T31TCJ',
    styles: 'dumont:Classif_Sample_Code_pred',
    format: 'image/png',
    transparent: true,
    tiled: true,
    opacity: 0.5, // Ajuste l'opacité entre 0 (transparent) et 1 (opaque)
    attribution: 'Données WMS © GeoServer'
}).addTo(map);

// URL du flux WMS avec filtre CQL
wmsLayerCode = L.tileLayer.wms('https://www.geotests.net/geoserver/dumont/wms', {
    layers: 'dumont:Sample_BD_foret_T31TCJ',
    styles: 'dumont:Classif_Sample',
    format: 'image/png',
    transparent: true,
    tiled: true,
    opacity: 0.5, // Ajuste l'opacité entre 0 (transparent) et 1 (opaque)
    attribution: 'Données WMS © GeoServer'
}).addTo(map);

const overlayLayers = {
"Couche BD Forêt": wmsLayerCode_Pred,
"Couche Prediction" : wmsLayerCode
};

// Contrôle des couches
const baseLayers = {
    "OpenStreetMap": osmLayer,
    "Satellite Esri": esriSatelliteLayer,
    "Google satellite": googleSatelliteLayer
};
LayerControl = L.control.layers(baseLayers, overlayLayers);
LayerControl.addTo(map);

// Ajout d'une échelle
L.control.scale({
    position: 'bottomleft',  // Position de l'échelle (bottomleft, bottomright, topleft, topright)
    imperial: false,         // Désactiver l'affichage en miles
    metric: true             // Activer l'affichage en kilomètres
}).addTo(map);


// Fonction pour mettre à jour la couche WMS en fonction de la sélection de l'utilisateur
function updateWMSLayer(codes) {
    const cqlFilter = codes.length > 0 ? codes.map(code => `Code='${code}'`).join(' OR ') : null;
    const cqlFilter_Code_pred = cqlFilter.replaceAll("Code", "Code_pred");

    if (cqlFilter !== null && map.hasLayer(wmsLayerCode)) {
        console.log('Filtre CQL:', cqlFilter); // Afficher le filtre CQL dans la console
        console.log('Filtre CQL Code_pred:', cqlFilter_Code_pred); // Afficher le filtre CQL dans la console
        wmsLayerCode.remove(); // Supprimer la couche WMS actuelle
        wmsLayerCode_Pred.remove(); // Supprimer la couche WMS Code_pred actuelle
    
        if (cqlFilter === "Code='0'"){
            wmsLayerCode = L.tileLayer.wms('https://www.geotests.net/geoserver/dumont/wms', {
                layers: 'dumont:Sample_BD_foret_T31TCJ',
                styles: 'dumont:Classif_Sample',
                format: 'image/png',
                transparent: true,
                tiled: true,
                opacity: 0.5, // Ajuste l'opacité entre 0 (transparent) et 1 (opaque)
                attribution: 'Données WMS © GeoServer'
            }).addTo(map);

            wmsLayerCode_Pred = L.tileLayer.wms('https://www.geotests.net/geoserver/dumont/wms', {
                layers: 'dumont:Sample_BD_foret_T31TCJ',
                styles: 'dumont:Classif_Sample_Code_pred',
                format: 'image/png',
                transparent: true,
                tiled: true,
                opacity: 0.5, // Ajuste l'opacité entre 0 (transparent) et 1 (opaque)
                attribution: 'Données WMS © GeoServer'
            }).addTo(map);
        }
        else {
            // URL du flux WMS avec filtre CQL
            wmsLayerCode = L.tileLayer.wms('https://www.geotests.net/geoserver/dumont/wms', {
                layers: 'dumont:Sample_BD_foret_T31TCJ',
                styles: 'dumont:Classif_Sample',
                format: 'image/png',
                transparent: true,
                tiled: true,
                attribution: 'Données WMS © GeoServer',
                CQL_FILTER: cqlFilter
           }).addTo(map);

           wmsLayerCode_Pred = L.tileLayer.wms('https://www.geotests.net/geoserver/dumont/wms', {
                layers: 'dumont:Sample_BD_foret_T31TCJ',
                styles: 'dumont:Classif_Sample_Code_pred',
                format: 'image/png',
                transparent: true,
                tiled: true,
                attribution: 'Données WMS © GeoServer',
                CQL_FILTER: cqlFilter_Code_pred
            }).addTo(map);
        }
        
        const overlayLayers = {
            "Couche BD Forêt": wmsLayerCode,
            "Couche Prediction" : wmsLayerCode_Pred
        };

       LayerControl.remove();
       LayerControl = L.control.layers(baseLayers, overlayLayers);
       LayerControl.addTo(map);
    }
}


// Écouteur d'événement pour le changement de sélection
document.getElementById('codeSelect').addEventListener('change', function() {
    const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
    console.log('Codes sélectionnés:', selectedOptions); // Afficher les codes sélectionnés dans la console
    document.getElementById("selected-options").textContent = selectedOptions
    updateWMSLayer(selectedOptions);
});

function updateMultiple() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    let values = Array.from(checkboxes).map(cb => cb.value);
    document.getElementById("selected-options").textContent = values;
  }

// 📌 URL du service WFS GeoServer (Remplace avec ton URL GeoServer)
var geoServerWFS = "https://www.geotests.net/geoserver/dumont/wfs";

// 📌 Paramètres pour récupérer les données en format GeoJSON
var wfsParams = {
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: 'dumont:Sample_BD_foret_T31TCJ', // Remplace "your_layer_name" par le nom de ta couche
    outputFormat: 'application/json',
    srsName: 'EPSG:4326' // Vérifie que ton GeoServer supporte ce SRS
};

// 📌 Construction de l'URL complète
var wfsUrl = geoServerWFS + '?' + new URLSearchParams(wfsParams).toString();

// 📌 Charger les données WFS via AJAX et afficher sur la carte
$.getJSON(wfsUrl, function (data) {
    var wfsLayer = L.geoJSON(data, {
        style: function (feature) {
            return {
                color: "white",
                weight: 0,
                fillOpacity: 0,
                fillColor: "transparent"
            };
        },
        onEachFeature: function (feature, layer) {
            // 📌 Ajout d'un événement click pour afficher une popup avec les attributs
            layer.on('click', function (e) {
                var properties = feature.properties;
                var popupContent = "<b>Informations du polygone :</b><br>";
                
                // 📌 Afficher tous les attributs du polygone
                for (var key in properties) {
                    popupContent += "<b>" + key + ":</b> " + properties[key] + "<br>";
                }

                layer.bindPopup(popupContent).openPopup();
            });
        }
    }).addTo(map);
}).fail(function () {
    console.log("Erreur lors du chargement du WFS.");
});

var legendParams = {
    service: 'WMS',
    version: '1.0.0',
    request: 'GetLegendGraphic',
    format: 'image/png',
    typeName: 'dumont:Sample_BD_foret_T31TCJ' // Remplace "your_layer_name" par le nom de ta couche
};

var geoServerWMS = "https://www.geotests.net/geoserver/dumont";
var legendUrl = geoServerWMS + '?' + new URLSearchParams(legendParams).toString();
var legendUrl = "https://www.geotests.net/geoserver/dumont/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=dumont:Sample_BD_foret_T31TCJ";
// 📌 Insérer la légende dans l'élément HTML
document.getElementById("legend-image").src = legendUrl;

document.getElementById("toggle-legend").addEventListener("click", function () {
    var legendDiv = document.getElementById("legend");
    if (legendDiv.style.display === "none") {
        legendDiv.style.display = "block";
    } else {
        legendDiv.style.display = "none";
    }
});