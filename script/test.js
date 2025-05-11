
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
const styleESC = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'red'
        }),
    })
});


const styleESU = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'orange'
        }),
    })
});

const stylePPSG = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'purple'
        }),
    })
});

const stylePPS_priv = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'blue'
        }),
    })
});


const ESC = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/ES_Collegial.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'ESC',
    style: styleESC,
    visible: false
});

const ESU = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/ES_Universitaire.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'ESU',
    style: styleESU,
    visible: false
});

const PPSG = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/PPS_Gouvernemental.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'PPSG',
    style: stylePPSG,
    visible: false
});


const PPS_Priv = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/PPS_Prive_Etablissement.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'PPS_Priv',
    style: stylePPS_priv,
    visible: false
});


const stylePPS_Pub= new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'green'
        }),
    })
});


const PPS_Pub = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/PPS_Public_Ecole.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'PPS_Pub',
    style: stylePPS_Pub,
    visible: false
});

const styleQC = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'red', // Contour noir
        width: 2
    }),
    fill: new ol.style.Fill({
        color: 'transparent' // Remplissage vide
    })
});

const QC = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/quebec.geojson',
        format: new ol.format.GeoJSON()
    }),
    title: 'QC',
    style : styleQC,
    visible: false // Définir la visibilité à false pour la couche quebec
});

// ----------------------------------------------------------------------------------------//


// ----------------------------------------------------------------------------------------//


// ============== LAYER GROUPS =================

const vectorLayerGroup = new ol.layer.Group({
    layers: [PPS_Pub,PPS_Priv,PPSG,ESC,ESU,QC],
    title: 'vectorLayerGroup'

});


const GoogleStreets = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: '	https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
            }),
            title: 'GoogleStreets'
});

const SatLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
            url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
            maxZoom: 19
          }),
            title: 'SatLayer',
            visible: false
});

const TerrLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 19
  }),
    title: 'TerrLayer',
    visible: false
});

// ============== LAYER GROUPS =================

const baseLayerGroup = new ol.layer.Group({
    layers: [TerrLayer, SatLayer, GoogleStreets],
    title: 'baseLayerGroup'
});


// ============== BASEMAP SWITCHER =================
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


    const vectorLayerElements = document.querySelectorAll('input[name=vectorLayerCheckboxButton]');
    for(let vectorLayerElement of vectorLayerElements){
        vectorLayerElement.addEventListener('change', function(){
            let vectorLayerElement = this.value;
            // console.log(baseLayerElementValue);
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
var view = new ol.View({
center: ol.proj.fromLonLat([-71.2, 46.8]),
zoom: 12
});

const map = new ol.Map({
    layers: [baseLayerGroup,vectorLayerGroup],
    target: 'map',
    view: view,
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.ZoomToExtent(),
        ]),
});
       
var mousePosition = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(5),
    projection: 'EPSG:4326',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
  });

  map.addControl(mousePosition);

//map.addControl(mousePosition);

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



// ----------------------------------------------------------------------------------------//


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
















// ----------------------------------------------------------------------------------------//


function open_info_panel(){
    $('.panel').removeClass('visible');
    $('.map-btn-box').removeClass('active');
    $('#info-panel').addClass('visible');
    $('#info').addClass('active');
}


function showMetadataModal(layerName) {
    var modal = document.getElementById("metadataModal");
    var title = document.getElementById("metadataTitle");
    var content = document.getElementById("metadataContent");
    
    // Ici, vous pouvez définir les métadonnées appropriées en fonction du nom de la couche
    // Exemple de contenu fictif
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

// Fonction pour fermer le modal des métadonnées
function closeMetadataModal() {
    var modal = document.getElementById("metadataModal");
    modal.style.display = "none";
}


