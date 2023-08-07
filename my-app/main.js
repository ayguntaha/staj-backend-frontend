import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { get } from 'ol/proj.js';

const source = new VectorSource();

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

const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM({
                tileSize: 512,
            }),
        }),
    ],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2,
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
    map.addInteraction(draw);
    snap = new Snap({ source: source });
    map.addInteraction(snap);
}

typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
};

document.getElementById('undo').addEventListener('click', function () {
    draw.removeLastPoint();
});
document.querySelector("#show-login").addEventListener("click", function () {
    document.querySelector(".popup").classList.add("active");
});

document.querySelector(".popup .close-btn").addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
});



addInteractions();