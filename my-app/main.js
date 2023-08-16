import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { get } from 'ol/proj.js';
import WKT from 'ol/format/WKT';
import { stopPropagation } from './node_modules/ol/events/Event';

const source = new VectorSource();
const raster = new TileLayer({
    source: new OSM(),
});

const vector = new VectorLayer({
    source: source,
    style: {
        'fill-color': 'rgba(215, 215, 215, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
    },
});

const parselKaydetBtn = document.querySelector('#parsel-kaydet-btn');
const ilParselGirdisi = document.querySelector('#ilParseli');
const ilceParselGirdisi = document.querySelector('#ilceParseli');
const mahalleParselGirdisi = document.querySelector('#mahalleParseli');
const parselContainer = document.querySelector('#table__container');

let parselId = null;
let wktGeometry = null;
let clickedParsel = null;

const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];

const map = new Map({
    layers: [raster, vector],
    target: 'map',
    view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
        extent,
    }),
});

const modify = new Modify({ source: source });
map.addInteraction(modify);

let draw, snap;
const typeSelect = document.getElementById('type');

function addInteractions() {
    const value = typeSelect.value;
    if (value !== 'None') {
        draw = new Draw({
            source: source,
            type: typeSelect.value,
        });
        map.addInteraction(draw);
    }
    snap = new Snap({ source: source });
    map.addInteraction(snap);
    if (value !== 'None') {
        draw.on('drawend', function (event) {

            var feature = event.feature;

            var format = new WKT();

            wktGeometry = format.writeFeature(feature)

            const parselCizim = format.readFeature(wktGeometry, {
                dataProjection: 'EPSG:3857',
                featureProjection: 'EPSG:4326',
            });

            document.querySelector(".popup").classList.add("active");

        });
    }

}
function deleteWktGeometryOnMap(wktGeometry) {
    var featureToRemove = source.getFeatures().find(function (feature) {
        var format = new WKT();
        var featureWktGeometry = format.writeFeature(feature, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857',
        });
        return featureWktGeometry === wktGeometry;
    });

    if (featureToRemove) {
        source.removeFeature(featureToRemove);
    }
}


function drawWktGeometryOnMap(wktGeometry) {
    var format = new WKT();

    var feature = format.readFeature(wktGeometry, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857',
    });

    source.addFeature(feature);
}

function formuTemizle() {
    ilParselGirdisi.value = "";
    ilceParselGirdisi.value = "";
    mahalleParselGirdisi.value = "";
}

function parseliFormdaGoster(parsel) {
    ilParselGirdisi.value = parsel.ilParsel;
    ilceParselGirdisi.value = parsel.ilceParsel;
    mahalleParselGirdisi.value = parsel.mahalleParsel;
}

function parseliIdAl(id) {

    fetch(`https://localhost:7272/api/Parsel/${id}`)
        .then(data => data.json())
        .then(response => parseliFormdaGoster(response));
}

function formuDoldur(id) {
    parseliIdAl(id);
}

function parseliGuncelle(id, ilParsel, ilceParsel, mahalleParsel, wktGeometry) {

    var body = {
        ilParsel: ilParsel,
        ilceParsel: ilceParsel,
        mahalleParsel: mahalleParsel,
        wkt: wktGeometry
    }

    fetch(`https://localhost:7272/api/Parsel/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
        .then(data => data.json())
        .then(response => {
            parselleriListele();
        });
}

function addParsel(ilParsel, ilceParsel, mahalleParsel, wktGeometry) {

    var body = {
        ilParsel: ilParsel,
        ilceParsel: ilceParsel,
        mahalleParsel: mahalleParsel,
        wkt: wktGeometry
    }

    fetch(`https://localhost:7272/api/Parsel`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {

            "content-type": "application/json"
        }
    })
        .then(data => data.json())
        .then(response => {
            formuTemizle();
            parselleriListele();
        });
}

function parseliSil(id) {
    return fetch(`https://localhost:7272/api/Parsel/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
        .then(response => {
            parselleriListele();
        })
        .catch(error => {
            console.error("Hata olu�tu:", error);
            throw error;
        });
}
function parselleriGoruntule(parseller) {

    let tumParseller = "";

    parseller.forEach(parsel => {
        const parselElement = `
        <div data-id="${parsel.id}">
        <table class="table" >
            <thead>
                <tr>
                    <th>Parsel il</th>
                    <th>Parsel ilce</th>
                    <th>Parsel Mahalle</th>
                    <th>Duzenleme</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${parsel.ilParsel}</td>
                    <td>${parsel.ilceParsel}</td>
                    <td>${parsel.mahalleParsel}</td>
                    <td>
                        <button class="btn btn-primary edit-btn" id="edit-btn">Edit</button>
                        <button class="btn btn-danger delete-btn" id="delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
        `;
        tumParseller += parselElement;
    });

    parselContainer.innerHTML = tumParseller;

    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(editButton => {
        editButton.addEventListener("click", function (event) {
            event.stopPropagation();

            const tr = editButton.closest("tr");
            const ilParsel = tr.querySelector("td:nth-child(1)").textContent;
            const ilceParsel = tr.querySelector("td:nth-child(2)").textContent;
            const mahalleParsel = tr.querySelector("td:nth-child(3)").textContent;

            parselId = tr.closest("div").getAttribute("data-id");

            const clickedParselId = parselId;

            clickedParsel = (parseller.find(parsel => parsel.id === clickedParselId).wkt);

            drawWktGeometryOnMap(clickedParsel);

            modify.on('modifyend', function (event) {

                const modifiedFeature = event.features.getArray()[0];
                const modifiedGeometry = modifiedFeature.getGeometry();
                const formatModify = new WKT();


                wktGeometry = formatModify.writeGeometry(modifiedGeometry);

                parseliGuncelle(parselId, ilParsel, ilceParsel, mahalleParsel, wktGeometry);
            });

            document.querySelector(".popup").classList.add("active");

            formuDoldur(parselId);
            parseliGuncelle(parselId, ilParsel, ilceParsel, mahalleParsel, clickedParsel, wktGeometry);
        });
    });


    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const tr = deleteButton.closest("tr");
            const parselIdToDelete = tr.closest("div").getAttribute("data-id");

            deleteButton.disabled = true;
            parseliSil(parselIdToDelete)
                .then(response => {
                    deleteButton.disabled = false;
                    parselleriListele();
                    deleteWktGeometryOnMap(clickedParsel);
                })
                .catch(error => {
                    deleteButton.disabled = false;
                    console.error("Hata olustu:", error);
                });
        });
    });
    const tableRows = document.querySelectorAll("table tbody tr");
    tableRows.forEach(row => {
        row.addEventListener("click", function (event) {
            const tr = event.currentTarget;
            const parselIdToShow = tr.closest("div").getAttribute("data-id");
            const clickedParselId = parselIdToShow;
            clickedParsel = parseller.find(parsel => parsel.id === clickedParselId).wkt;

            drawWktGeometryOnMap(clickedParsel);
        });
    });
}


function parselleriListele() {
    fetch(`https://localhost:7272/api/Parsel`)
        .then(data => data.json())
        .then(response => parselleriGoruntule(response));
}

typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
};

document.getElementById('undo').addEventListener('click', function () {
    draw.removeLastPoint();
});


document.querySelector(".popup .close-btn").addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
    formuTemizle();
});

document.querySelector("#parsel-kaydet-btn").addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
});


parselKaydetBtn.addEventListener('click', function () {

    if (parselId) {
        parseliGuncelle(parselId, ilParselGirdisi.value, ilceParselGirdisi.value, mahalleParselGirdisi.value, wktGeometry);
        parselId = null;
        formuTemizle();
    }
    else {
        addParsel(ilParselGirdisi.value, ilceParselGirdisi.value, mahalleParselGirdisi.value, wktGeometry);
    }
});

parselleriListele();

addInteractions();