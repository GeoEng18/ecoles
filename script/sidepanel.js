// ============== TENNIS COURT LAYER =================
const iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.8, 0.3],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'img/tennis-ball.png',
        // the real size of your icon
        size: [2000, 2000],
        // the scale factor
        scale: 0.011
    }),
});
const tennisLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/tennis_courts_sherb_3857.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: iconStyle,
    title: 'tennisLayer'
});

// ============== BASEMAP LAYERS =================
const GoogleStreets = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
    }),
    title: 'GoogleStreets'
});
const SatLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        maxZoom: 19
    }),
    title: 'SatLayer',
    visible: true
});

// ============== LAYER GROUPS =================
const baseLayerGroup = new ol.layer.Group({
    layers: [SatLayer],
    title: 'baseLayerGroup'
});

// ============== MAP & VIEW =================
const scaleLine =  new ol.control.ScaleLine();
const view = new ol.View({
    center: [-8001428.120892, 5684163.171399],
    zoom: 13,
});
const map = new ol.Map({
    layers: [baseLayerGroup, tennisLayer],
    target: 'map',
    view: view
});
map.addControl(scaleLine);


// ============== SIDE PANEL INTERACTIONS =================
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function open_side_panel() {
    $(".side-panel").addClass('sp-open');
    $(".side-panel-button").css('left', '500px');
    $(".close-open-button").css('transform', 'rotate(0)');
    delay(500).then(function () {
        $(".side-panel-mainarea").css('display', 'block');
    })
}
function close_side_panel() {
    $(".side-panel").removeClass('sp-open');
    $(".side-panel-button").css('left', '0px');
    $(".close-open-button").css('transform', 'rotate(180deg)');
    delay(200).then(function () {
        $(".side-panel-mainarea").css('display', 'none');
    })
}
$('.side-panel-button').click(function () {
    var hasclass = $(".side-panel").hasClass('sp-open');
    if (hasclass == false) {
        open_side_panel();
    }
    else {
        close_side_panel();
    }
})


// ============== MAP INTERROGATION =================
map.on('pointermove', function (event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getViewport().style.cursor = hit ? 'pointer' : '';
})
map.on('click', function (event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    if (hit == true) {
        var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            if (layer.get('title') == 'tennisLayer'){
                return feature
            }
        })
        let id = feature.get('id');
        let court_img_name = 'tennis-court-'+id+'.jpg';
        let path = "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(241, 249, 251, 0.1), rgba(241, 249, 251, 1)), url('img/" + court_img_name;
        let name = feature.get('nom');
        let surface = feature.get('surface');
        let nb_court = feature.get('nb_terrain');
        let eclairage = feature.get('eclairage');
        $("#court-name-val").html(name);
        $("#court-surface-val").html(surface);
        $("#court-nbcourt-val").html(nb_court);
        $("#court-eclairage-val").html(eclairage);
        $(".side-panel-top-picture").css("background-image", path);
        open_side_panel();
    }
    else {
        // pass
    }
})