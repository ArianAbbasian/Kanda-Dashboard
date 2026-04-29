let map;
let vectorLayer;
let vectorSource;
let mapInitialized = false;
let drawInteraction = null;
let drawnPolygonLayer = null;
let provinceChartsActive = false;
let provinceChartInstances = [];
let provinceOverlays = [];           
let provinceCenters = null;          
const originalMarkerStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        scale: 0.03,
    }),
});

// ==================== Getting Provinces Locations ==================== ✅
async function loadProvinceCenters() {
    if (provinceCenters) return provinceCenters;
    try {
        const response = await fetch('/User/GetProvinces');
        const provinces = await response.json();
        const centers = {};
        provinces.forEach(p => {
            if (p.lat && p.lon) {
                // [longitude, latitude]
                centers[p.name] = [parseFloat(p.lon), parseFloat(p.lat)];
            }
        });
        provinceCenters = centers;
        console.log(provinceCenters);
        return centers;
    } catch (error) {
        console.error('❌ خطا در دریافت مختصات استان‌ها:', error);
        return {};
    }
}

// ==================== Getting Fillterd Users ==================== ✅
async function fetchMapUsers() {
    const data = await getFilteredUsers(1, 1000);
    return data.users || [];
}

// ==================== User PoPup Information ==================== ✅
function showUserInfoPopup(user, pixel) {
    const popup = document.getElementById('custom-map-popup');
    if (!popup) return;
    if (!user) return;
    let userTypeString;
    switch (user.userType) {
        case 'plus':
            userTypeString = 'پلاس';
            break;
        case 'special':
            userTypeString = 'ویژه';
            break;
        case 'admin':
            userTypeString = 'مدیر';
            break;
        default:
            userTypeString = 'عادی';
            break;
    }
    

    //console.log('UserType (Switch)=>', userTypeString);

    popup.querySelector('.map-popup-title').innerText = `${user.firstName} ${user.lastName}`;
    popup.querySelector('.map-popup-text').innerHTML = `
        نوع کاربر: ${userTypeString}<br>
        تلفن : ${user.phone}<br>
        استان : ${user.provinceName}<br>
        شهر: ${user.cityName}
    `;
    if (pixel) {
        const offsetX = 135;
        const offsetY = 450;

        popup.style.left = `${pixel[0] + offsetX}px`;
        popup.style.top = `${pixel[1] + offsetY}px`;
    }
    popup.style.display = 'block';
}

// ==================== PolyGun Filltering ====================
function filterMarkersByPolygon(polygon) {
    const markers = vectorSource.getFeatures();
    const polygonGeometry = polygon.clone();

    markers.forEach(marker => {
        const coord = marker.getGeometry().getCoordinates();
        if (polygonGeometry.intersectsCoordinate(coord)) {
            marker.setStyle(originalMarkerStyle);
        } else {
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 0,
                    fill: new ol.style.Fill({ color: 'rgba(0,0,0,0)' })
                })
            }));
        }
    });
}

// ==================== Clear PolyGun Fillter ====================
window.clearPolygonFilter = function () {
    if (drawnPolygonLayer) {
        drawnPolygonLayer.getSource().clear();
    }
    loadMapUsers();
    const drawBtn = document.getElementById('drawPolygonBtn');
    const clearBtn = document.getElementById('clearPolygonBtn');
    if (drawBtn && clearBtn) {
        drawBtn.style.display = 'inline-block';
        clearBtn.style.display = 'none';
    }
};

// ==================== Updating Provinces Chart  ====================
async function updateProvinceCharts() {
    if (!map) return;

    // REmoving old Map Data
    provinceChartInstances.forEach(chart => chart.destroy());
    provinceChartInstances = [];
    provinceOverlays.forEach(overlay => map.removeOverlay(overlay));
    provinceOverlays = [];

    if (!provinceChartsActive) return;

    const centers = await loadProvinceCenters();
    if (Object.keys(centers).length === 0) return;

    const data = await getFilteredUsers(1, 1000);
    const users = data.users || [];

    // Grouping Users By Provinces
    const provinceGroups = {};
    users.forEach(u => {
        const province = u.provinceName;
        if (!province) return;
        if (!provinceGroups[province]) {
            provinceGroups[province] = { admin: 0, special: 0, plus: 0, user: 0 };
        }
        const type = u.userType || 'user';
        provinceGroups[province][type] = (provinceGroups[province][type] || 0) + 1;
    });
    console.log('provinceGroups =>' ,provinceGroups);
    for (const [province, counts] of Object.entries(provinceGroups)) {
        const center = centers[province];
        if (!center) continue;
        

        // Making Canvass For Charts
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.width = '80px';
        canvas.style.height = '80px';
        canvas.style.pointerEvents = 'none';

        // Preparing Datas
        const labels = [];
        const dataValues = [];
        const colors = [];
        if (counts.admin) { labels.push('مدیر'); dataValues.push(counts.admin); colors.push('#FF304F'); }
        if (counts.special) { labels.push('ویژه'); dataValues.push(counts.special); colors.push('#FF9F1C'); }
        if (counts.plus) { labels.push('پلاس'); dataValues.push(counts.plus); colors.push('#2A9D8F'); }
        if (counts.user) { labels.push('عادی'); dataValues.push(counts.user); colors.push('#8338EC'); }

        if (dataValues.length === 0) continue;
        //console.log('dataValues =>',dataValues);

        const chart = new Chart(canvas, {
            type: 'pie',
            data: {
                datasets: [{
                    data: dataValues,
                    backgroundColor: colors,
                    borderColor: '#ffffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 1 },
                        bodyFont: { size: 2 },
                        padding: 1,
                        cornerRadius: 5 }
                }
            }
        });
        provinceChartInstances.push(chart);

        //console.log(`Province: ${province}, Center: ${JSON.stringify(center)}, LonLat: ${JSON.stringify(ol.proj.fromLonLat(center))}`);


        // Making and inserting OverLayers
        const overlayElement = document.createElement('div');
        overlayElement.appendChild(canvas);
        overlayElement.style.pointerEvents = 'none';
        const overlay = new ol.Overlay({
            element: overlayElement,
            position: ol.proj.fromLonLat(center),
            positioning: 'center-center',
            offset: [-1500, 0] 
        });
        map.addOverlay(overlay);
        provinceOverlays.push(overlay);
    }
}

// ==================== Charts Refresh(If they are Active) ==================== ✅
window.refreshProvinceChartsIfActive = function () {
    if (provinceChartsActive && map) {
        updateProvinceCharts();
    }
};

// ==================== Setuping Draw Tool ====================
function setupDrawing() {
    const drawBtn = document.getElementById('drawPolygonBtn');
    const clearBtn = document.getElementById('clearPolygonBtn');

    if (!drawBtn || !clearBtn) return;

    drawBtn.addEventListener('click', () => {
        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
            drawInteraction = null;
        }

        if (drawnPolygonLayer) {
            drawnPolygonLayer.getSource().clear();
        }

        drawInteraction = new ol.interaction.Draw({
            source: drawnPolygonLayer.getSource(),
            type: 'Polygon'
        });

        map.addInteraction(drawInteraction);

        drawInteraction.on('drawend', (e) => {
            const polygon = e.feature.getGeometry();
            filterMarkersByPolygon(polygon);
            drawBtn.style.display = 'none';
            clearBtn.style.display = 'inline-block';
            map.removeInteraction(drawInteraction);
            drawInteraction = null;
        });
    });

    clearBtn.addEventListener('click', window.clearPolygonFilter);
}

// ==================== Initilazing Map ==================== ✅
function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    vectorSource = new ol.source.Vector();
    vectorLayer = new ol.layer.Vector({ source: vectorSource });

    const drawnPolygonSource = new ol.source.Vector();
    drawnPolygonLayer = new ol.layer.Vector({
        source: drawnPolygonSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.2)' }),
            stroke: new ol.style.Stroke({ color: '#ff0000', width: 2 })
        })
    });

    map = new ol.Map({
        target: 'map',
        //layers: [
        //    new ol.layer.Tile({ source: new ol.source.OSM() }),
        //    drawnPolygonLayer,
        //    vectorLayer
        //],
        // فعلا بخاطر نبود دسترسی به اینترنت OSM هارو از TileMap نمیگیریم
        layers: [
            drawnPolygonLayer,
            vectorLayer,

        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([51.45, 35.75]),
            zoom: 6,
            minZoom: 5,
            maxZoom: 18
        })
    });

    map.on("singleclick", function (e) {
        map.forEachFeatureAtPixel(e.pixel, function (feature) {
            showUserInfoPopup(feature.values_.user , e.pixel);
            console.log("You clicked:", feature.values_.user);
        });
    });
    map.on("pointermove", function (e) {
        const hit = map.hasFeatureAtPixel(e.pixel);
        map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
    

    setupDrawing();
    loadMapUsers();

    
    if (provinceChartsActive) {
        updateProvinceCharts();
    }

    initPopupEvents();
}

// ====================  Markers ====================
async function loadMapUsers() {
    try {
        const users = await fetchMapUsers();
        if (vectorSource) vectorSource.clear();

        users.forEach(user => {
            if (user.lat && user.lon) {
                const marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([user.lon, user.lat])),
                    name: `${user.firstName} ${user.lastName}`,
                    user: user
                });
                marker.setStyle(originalMarkerStyle);
                vectorSource.addFeature(marker);
            }
        });
        // For finding and zoom on a single User
        if (users.length > 0) {
            const extent = vectorSource.getExtent();
            if (extent.every(isFinite)) {
                if (vectorSource.getFeatures().length === 1) {
                    const singleUser = users.find(u => u.lat && u.lon);
                    if (singleUser) {
                        map.getView().setCenter(ol.proj.fromLonLat([singleUser.lon, singleUser.lat]));
                        map.getView().setZoom(7);
                    }
                } else {
                    map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500, maxZoom: 15 });
                }
            }

        }
    } catch (error) {
        console.error('خطا در بارگذاری مارکرها:', error);
    }
}

// ==================== Setuping PopUp ACtion ====================
function initPopupEvents() {
    const popup = document.getElementById('custom-map-popup');
    if (!popup) return;

    const closeBtn = popup.querySelector('.map-popup-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.style.display = 'none';
        });
    }

    document.addEventListener('click', function closePopupOnClickOutside(e) {
        if (popup.style.display === 'block' && !popup.contains(e.target)) {
            popup.style.display = 'none';
        }
    });
}

// ==================== Load/Updating The Map ====================
function loadMap() {
    const oldOverlay = document.querySelector('.ol-overlaycontainer');
    if (oldOverlay) oldOverlay.style.display = 'none';
    if (!mapInitialized) {
        initMap();
    } else {
        loadMapUsers();
        if (provinceChartsActive) {
            updateProvinceCharts();
        }
    }
}

// ====================  Provinces Charts Button (New Task) ====================
document.addEventListener('DOMContentLoaded', () => {
    initPopupEvents();

    const provinceBtn = document.getElementById('provinceChartsBtn');
    if (provinceBtn) {
        provinceBtn.addEventListener('click', async () => {
            provinceChartsActive = !provinceChartsActive;
            if (provinceChartsActive) {
                provinceBtn.classList.add('active');
                if (mapInitialized) {
                    await updateProvinceCharts();
                } else {
                    toast.info('برای دیدن نمودارها ابتدا تب نقشه را باز کنید');
                }
            } else {
                provinceBtn.classList.remove('active');
                if (mapInitialized) {
                    provinceChartInstances.forEach(chart => chart.destroy());
                    provinceChartInstances = [];
                    provinceOverlays.forEach(overlay => map.removeOverlay(overlay));
                    provinceOverlays = [];
                }
            }
        });
    }
});


window.loadMap = loadMap;
window.clearPolygonFilter = clearPolygonFilter;
window.refreshProvinceChartsIfActive = refreshProvinceChartsIfActive;