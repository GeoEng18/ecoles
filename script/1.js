// Get the modal
var modal = document.getElementById('modal');

// Function to open the modal
function openModal() {
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Open the modal when the page loads
window.onload = function() {
    openModal();
}


// ============== ES COLLEGIAL LAYER =================
// Style for ES Collegial layer
const styleESC = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'red'
        }),
    })
});

// Style for ES Universitaire layer
const styleESU = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'orange'
        }),
    })
});

// Style for PPS Gouvernemental layer
const stylePPSG = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'purple'
        }),
    })
});

// Style for PPS Prive layer
const stylePPS_priv = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'blue'
        }),
    })
});

// Vector layer for ES Collegial
const ESC = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/ES_Collegial.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'ESC',
    style: styleESC,
    visible: false
});

// Vector layer for ES Universitaire
const ESU = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/ES_Universitaire.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'ESU',
    style: styleESU,
    visible: false
});

// Vector layer for PPS Gouvernemental
const PPSG = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/PPS_Gouvernemental.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'PPSG',
    style: stylePPSG,
    visible: false
});

// Vector layer for PPS Prive
const PPS_Priv = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/PPS_Prive_Etablissement.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'PPS_Priv',
    style: stylePPS_priv,
    visible: false
});

// Style for PPS Publique layer
const stylePPS_Pub= new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'green'
        }),
    })
});

// Vector layer for PPS Publique
const PPS_Pub = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/PPS_Public_Ecole.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'PPS_Pub',
    style: stylePPS_Pub,
    visible: false
});

// Style for QC layer
const styleQC = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'red', // Black outline
        width: 2
    }),
    fill: new ol.style.Fill({
        color: 'transparent' // Transparent fill
    })
});

// Vector layer for QC
const QC = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/quebec.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'QC',
    style : styleQC,
    visible: false // Set visibility to false for Quebec layer
});

// ----------------------------------------------------------------------------------------//


// ============== LAYER GROUPS =================

// Layer group for vector layers
const vectorLayerGroup = new ol.layer.Group({
    layers: [PPS_Pub, PPS_Priv, PPSG, ESC, ESU, QC],
    title: 'vectorLayerGroup'
});

// Layer for Google Streets
const GoogleStreets = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
    }),
    title: 'GoogleStreets'
});

// Layer for Satellite imagery
const SatLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        maxZoom: 19
    }),
    title: 'SatLayer',
    visible: false
});

// Layer for Terrain
const TerrLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        maxZoom: 19
    }),
    title: 'TerrLayer',
    visible: false
});

// ============== LAYER GROUPS =================

// Layer group for base layers
const baseLayerGroup = new ol.layer.Group({
    layers: [TerrLayer, SatLayer, GoogleStreets],
    title: 'baseLayerGroup'
});


// ============== BASEMAP SWITCHER =================
// Event listeners for base layer switcher
const baseLayerElements = document.querySelectorAll('input[name=baseLayerRadioButton]');
for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        baseLayerGroup.getLayers().forEach(function(element, index, array){
            let baseLayerTitle = element.get('title');
            element.setVisible(baseLayerTitle === baseLayerElementValue);
        })  
    })
}

// Event listeners for vector layer checkboxes
const vectorLayerElements = document.querySelectorAll('input[name=vectorLayerCheckboxButton]');
for(let vectorLayerElement of vectorLayerElements){
    vectorLayerElement.addEventListener('change', function(){
        let vectorLayerElement = this.value;
        vectorLayerGroup.getLayers().forEach(function(element, index, array){
            let vectorLayerTitle = element.get('title');
            if (vectorLayerTitle == vectorLayerElement){
                if (element.getVisible() == true){
                    element.setVisible(false);
                } else {
                    element.setVisible(true);
                }
            }
        })  
    })
}

// ================ VUE ET MAP ================
// Define view
var view = new ol.View({
    center: ol.proj.fromLonLat([-71.2, 46.8]),
    zoom: 12
});

// Create map instance
const map = new ol.Map({
    layers: [baseLayerGroup, vectorLayerGroup],
    target: 'map',
    view: view,
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.ZoomToExtent(),
    ]),
});

// Add mouse position control
var mousePosition = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(5),
    projection: 'EPSG:4326',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});

map.addControl(mousePosition);

// ============== MAP BUTTONS INTERACTIONS =================

// Toggle map buttons
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

// Change cursor on hover over feature
map.on('pointermove', function (event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getViewport().style.cursor = hit ? 'pointer' : '';
})

// Open info panel on feature click
map.on('click', function (event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    if (hit == true) {
        var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            if (layer.get('title') == 'ESC'){
                return feature
            }
        })
        console.log(feature);
        let nom = feature.get('NOM_OFFCL');
        let adresse = feature.get('ADRS_GEO_L1_GDUNO');
        let muni = feature.get('NOM_MUNCP');
        let org = feature.get('TYPE_ORGNS');
        let reseau = feature.get('RESEAU');
        let ordre = feature.get('ORDRE_ENS');
        let web = feature.get('SITE_WEB');
        $("#court-nom-val").html(nom);
        $("#court-adresse-val").html(adresse);
        $("#court-muni-val").html(muni);
        $("#court-org-val").html(org);
        $("#court-reseau-val").html(reseau);
        $("#court-ordre-val").html(ordre);
        $("#court-web-val").html(web);
        open_info_panel();
    }
    else {
        // pass
    }
})

// Open info panel
function open_info_panel(){
    $('.panel').removeClass('visible');
    $('.map-btn-box').removeClass('active');
    $('#info-panel').addClass('visible');
    $('#info').addClass('active');
}

// Show metadata modal
function showMetadataModal(layerName) {
    var modal = document.getElementById("metadataModal");
    var title = document.getElementById("metadataTitle");
    var content = document.getElementById("metadataContent");
    
    // Here you can set appropriate metadata based on the layer name
    // Example dummy content
    var metadata = {
        "ESC": "Établissements collégiaux (publics, privés et gouvernementaux) du Québec localisés à partir d’AQ. Cette donnée provienne du Ministère de l'éducation du Québec",
        "QC": "Limite administrative de la ville de Québec",
        "ESU": "Établissements universitaires du Québec localisés à partir d’AQ. ",
        "PPSG": "Écoles gouvernementales (PPS) du Québec localisées à partir d’AQ",
        "PPS_Priv": "Établissements privés (PPS) du Québec localisés à partir d’AQ. Les établissements représentent le siège social (école mère) d’une école privée. Ces établissements peuvent avoir plus d’une installation privée.",
        "PPS_Pub": "Écoles publique du Québec localisés à partir d’AQ",
        "SS": "Sièges sociaux des centres de services scolaires et des commissions scolaires du Québec localisés à partir d’AQ"
    };

    title.textContent = "Métadonnées pour " + layerName;
    content.textContent = metadata[layerName];

    modal.style.display = "block";
}

// Function to close metadata modal
function closeMetadataModal() {
    var modal = document.getElementById("metadataModal");
    modal.style.display = "none";
}
