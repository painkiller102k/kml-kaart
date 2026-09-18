// Leaflet kaart

let leafletMap;

function startLeaflet() {

    leafletMap = L.map('leafletMap').setView([59.437, 24.753], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    omnivore.kml('TECHNO-KODU.kml')
        .on('ready', function () {

            leafletMap.fitBounds(this.getBounds());

            // KML objektidele popupi lisamine

            this.eachLayer(function (layer) {

                if (layer.feature && layer.feature.properties) {

                    let name = layer.feature.properties.name;

                    if (name) {
                        layer.bindPopup(
                            '<b>' + name + '</b><br>' +
                            'See objekt on pärit KML-failist.'
                        );
                    }
                }
            });

        })
        .addTo(leafletMap);
}


// Leaflet suurendamine

function zoomIn() {
    leafletMap.zoomIn();
}


// Leaflet vähendamine

function zoomOut() {
    leafletMap.zoomOut();
}


// Leaflet algvaade

function goHome() {
    leafletMap.setView([59.437, 24.753], 12);
}


// OpenLayers kaart

let openLayersMap;

function startOpenLayers() {

    const vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: 'TECHNO-KODU.kml',
            format: new ol.format.KML({
                extractStyles: true
            })
        })
    });

    openLayersMap = new ol.Map({
        target: 'openLayersMap',

        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vectorLayer
        ],

        view: new ol.View({
            center: ol.proj.fromLonLat([24.753, 59.437]),
            zoom: 12
        })
    });


    // KML faili laadimine

    vectorLayer.getSource().once('change', function () {

        if (vectorLayer.getSource().getState() === 'ready') {

            const extent = vectorLayer.getSource().getExtent();

            openLayersMap.getView().fit(extent, {
                padding: [50, 50, 50, 50]
            });
        }
    });
}


// OpenLayers suurendamine

function openLayersZoomIn() {

    const view = openLayersMap.getView();

    view.setZoom(view.getZoom() + 1);
}


// OpenLayers vähendamine

function openLayersZoomOut() {

    const view = openLayersMap.getView();

    view.setZoom(view.getZoom() - 1);
}


// OpenLayers algvaade

function openLayersHome() {

    openLayersMap.getView().setCenter(
        ol.proj.fromLonLat([24.753, 59.437])
    );

    openLayersMap.getView().setZoom(12);
}


// Näita kogu KML faili

function showAll() {

    const source = openLayersMap.getLayers().item(1).getSource();

    const extent = source.getExtent();

    openLayersMap.getView().fit(extent, {
        padding: [50, 50, 50, 50]
    });
}


// Käivitame õige kaardi

document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById('leafletMap')) {
        startLeaflet();
    }

    if (document.getElementById('openLayersMap')) {
        startOpenLayers();
    }

});