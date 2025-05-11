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
    title: 'GoogleStreets',
    visible: true
});
const SatLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        maxZoom: 19
    }),
    title: 'SatLayer',
    visible:false
});

// ============== LAYER GROUPS =================
const baseLayerGroup = new ol.layer.Group({
    layers: [SatLayer, GoogleStreets],
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


// ============== MAP BUTTONS INTERACTIONS =================
$('.map-btn-box').click(function(){
    click_id = this.id;
    if ($(this).hasClass('active')){
        $(this).removeClass('active');
        $('#'+click_id+'-panel').removeClass('visible');
    } else{
        $('.map-btn-box').removeClass('active');
        $(this).addClass('active');
        $('.panel').removeClass('visible');
        $('#'+click_id+'-panel').addClass('visible');
    }
})



// ============== MAP INTERROGATION =================
map.on('pointermove', function (event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getViewport().style.cursor = hit ? 'pointer' : '';
})