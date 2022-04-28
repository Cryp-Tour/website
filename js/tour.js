let opts = {
    map: {
        center: [41.4583, 12.7059],
        zoom: 5,
        fullscreenControl: false,
        resizerControl: true,
        preferCanvas: false,
        rotate: true,
        // bearing: 45,
        rotateControl: {
            closeOnZeroBearing: true
        },
    },
    elevationControl: {
        data: "https://raruto.github.io/leaflet-elevation/examples/demo.geojson",
        options: {
            theme: "lightblue-theme",
            collapsed: true,
            detached: true,
            closeBtn: true,
            elevationDiv: "#elevation-div",
            summary: false,
            downloadLink: false,
            almostOver: true,
        },
    },
    layersControl: {
        options: {
            collapsed: false,
        },
    },
};

let map = L.map('map', opts.map);
let controlElevation = L.control.elevation(opts.elevationControl.options).addTo(map);
let controlLayer = L.control.layers(null, null, opts.layersControl.options);
controlElevation.on('eledata_loaded', ({layer, name}) => controlLayer.addTo(map) && layer.eachLayer((trkseg) => trkseg.feature.geometry.type != "Point" && controlLayer.addOverlay(trkseg, trkseg.feature && trkseg.feature.properties && trkseg.feature.properties.name || name)));
controlElevation.load(opts.elevationControl.data);