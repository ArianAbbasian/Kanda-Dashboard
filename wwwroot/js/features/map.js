let map;
let vectorLayer;
let vectorSource;
let mapInitialized = false;
let popupChart = null;

// ==================== Getting Filtered Users From Server ====================
async function fetchAllFilteredUsers() {
    const filters = window.filterState || {};
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.username) params.append('username', filters.username);
    if (filters.email) params.append('email', filters.email);
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);
    if (filters.cityId) params.append('cityId', filters.cityId);
    params.append('pageSize', '1000');

    const url = `/User/GetFilteredUsers?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.users || [];
}

// ==================== Making PopUp ====================
function createCustomPopup() {
    const existingPopup = document.getElementById('custom-map-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'custom-map-popup';
    popup.style.position = 'fixed';
    popup.style.display = 'none';
    popup.style.background = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '8px';
    popup.style.padding = '15px';
    popup.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    popup.style.zIndex = '20000';
    popup.style.width = '250px';
    popup.style.height = '280px';
    popup.style.direction = 'rtl';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';

    const title = document.createElement('div');
    title.id = 'popup-title';
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    title.style.fontWeight = 'bold';
    title.style.fontFamily = 'IRANYekan';
    title.style.fontSize = '14px';
    popup.appendChild(title);

    const text = document.createElement('div');
    text.id = 'popup-text';
    text.style.textAlign = 'center';
    text.style.marginBottom = '10px';
    text.style.fontFamily = 'IRANYekan';
    text.style.fontSize = '11px';
    popup.appendChild(text);

    const canvas = document.createElement('canvas');
    canvas.id = 'popup-chart-canvas';
    canvas.width = 220;
    canvas.height = 220;
    canvas.style.width = '220px';
    canvas.style.height = '220px';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    popup.appendChild(canvas);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.left = '5px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#666';
    closeBtn.onclick = function () {
        popup.style.display = 'none';
    };
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);
    return popup;
}

// ==================== Showing Chart ====================
function showPopupWithChart(user) {
    let popup = document.getElementById('custom-map-popup');

    if (!popup) {
        popup = createCustomPopup();
    }

    document.getElementById('popup-title').innerText = `${user.firstName} ${user.lastName}`;
    document.getElementById('popup-text').innerHTML = `نوع کاربر: ${user.userType}<br>شماره تلفن : ${user.phone}<br>استان : ${user.provinceName}<br>شهر: ${user.cityName}`;

    const canvas = document.getElementById('popup-chart-canvas');
    if (!canvas) {
        console.error('❌ کانواس پیدا نشد');
        return;
    }

    if (popupChart) {
        popupChart.destroy();
        popupChart = null;
    }

    setTimeout(() => {
        try {
            popupChart = new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: ['کاربران عادی', 'مدیران', 'کاربران ویژه', 'کاربران پلاس'],
                    datasets: [{
                        data: [55, 5, 15, 25],
                        backgroundColor: ['#3498db', '#e74c3c', '#e59f2e', '#a63bdd'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            rtl: true,
                            labels: { font: { family: 'IRANYekan', size: 11 } }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('❌ خطا در ایجاد نمودار:', error);
        }
    }, 50);

    popup.style.display = 'block';
}

// ==================== Initialazing Map ====================
function initMap() {
    if (mapInitialized) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('❌ المنت نقشه پیدا نشد');
        return;
    }

    mapInitialized = true;

    vectorSource = new ol.source.Vector();

    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({ color: 'red' }),
                stroke: new ol.style.Stroke({ color: 'white', width: 2 })
            })
        })
    });

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([51.45, 35.75]),
            zoom: 6
        })
    });

    map.addLayer(vectorLayer);

    // ===== Clicking on Markers(MAP) =====
    map.on('singleclick', function (evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
            return feat;
        });

        if (feature) {
            const user = feature.get('user');
            if (user) {
                showPopupWithChart(user);
            }
        }
    });

    loadMapUsers();
}

// ==================== Loading Users ====================
async function loadMapUsers() {
    try {
        const users = await fetchAllFilteredUsers();

        if (users.error) {
            console.error('خطای سرور:', users.error);
            return;
        }

        if (vectorSource) vectorSource.clear();

        users.forEach(user => {
            if (user.lat && user.lon) {
                const marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([user.lon, user.lat])),
                    name: `${user.firstName} ${user.lastName} (${user.username})`,
                    user: user
                });

                marker.setStyle(new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 8,
                        fill: new ol.style.Fill({ color: '#ff6b6b' }),
                        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
                    }),
                    text: new ol.style.Text({
                        text: user.firstName + ' ' + user.lastName,
                        font: 'bold 12px IRANYekan',
                        fill: new ol.style.Fill({ color: 'white' }),
                        stroke: new ol.style.Stroke({ color: 'black', width: 1 }),
                        offsetY: -15
                    })
                }));

                vectorSource.addFeature(marker);
            }
        });

        if (users.length > 0) {
            const extent = vectorSource.getExtent();
            if (extent.every(isFinite)) {
                if (vectorSource.getFeatures().length === 1) {
                    const singleUser = users.find(u => u.lat && u.lon);
                    if (singleUser) {
                        map.getView().setCenter(ol.proj.fromLonLat([singleUser.lon, singleUser.lat]));
                        map.getView().setZoom(10);
                    }
                } else {
                    map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500, maxZoom: 15 });
                }
            }
        }
    } catch (error) {
        console.error('خطا در بارگذاری کاربران روی نقشه:', error);
    }
}

// ==================== Start ====================
function loadMap() {

    const oldOverlay = document.querySelector('.ol-overlaycontainer');
    if (oldOverlay) {
        oldOverlay.style.display = 'none';
    }
    if (!mapInitialized) {
        initMap();
    } else {
        loadMapUsers();
    }
}