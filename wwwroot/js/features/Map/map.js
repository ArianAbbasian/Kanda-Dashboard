let map;
let vectorLayer;
let vectorSource;
let mapInitialized = false;
let drawInteraction = null;
let drawnPolygonLayer = null;
let provinceChartsActive = false;
let markersIsActive = false;
let provinceChartInstances = [];
let provinceCenters = null;
let currentHoveredFeature = null;
const popup = document.getElementById('custom-map-popup');
// ==================== Markers Style ==================== 
const originalMarkerStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: "/images/locationIcon.png",
        scale: 0.2,
    }),
});
const SelectedMarkerStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: "/images/locationIcon2.png",
        scale: 0.2,
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
        //console.log(provinceCenters);
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

// ==================== Provinces Chart ToolTip Hover ==================== ✅
function chartToolTip(province, users, pixel) {
    if (!popup) {
        console.error("Element with id 'custom-map-popup' not found!");
        return;
    }

    if (!province || !users) {
        hideTooltip();
        return;
    }

    let totalUsers = Object.values(users).reduce((a, b) => a + b, 0);

    popup.querySelector('.map-popup-title').innerText = `استان ${province}`;
    popup.querySelector('.map-popup-text').innerHTML = `
        مدیران: ${users.admin}<br>
        کاربران ویژه : ${users.special}<br>
        کاربران پلاس : ${users.plus}<br>
        کاربران عادی: ${users.user}<br>
        مجموع کاربران: ${totalUsers}
    `;

    if (pixel) {
        const offsetX = 135;
        const offsetY = 450; 



        popup.style.left = `${pixel[0] + offsetX}px`;
        popup.style.top = `${pixel[1] + offsetY}px`;
    }
    popup.style.display = 'block';
}
function hideTooltip() {
    if (popup && popup.style.display === 'block') {
        popup.style.display = 'none';
        currentHoveredFeature = null; 
    }
}
// ==================== PolyGun Filltering ==================== ✅
function filterMarkersByPolygon(polygon) {
    const markers = vectorSource.getFeatures();
    const polygonGeometry = polygon.clone();
    clearLocalStorageSelection();

    markers.forEach(marker => {
        const coord = marker.getGeometry().getCoordinates();
        if (polygonGeometry.intersectsCoordinate(coord)) {
            addUserIdToLocalStorage(String(marker.values_.user.id));
            marker.setStyle(SelectedMarkerStyle);
            //console.log(marker.values_.user.id);
        }

    });

    loadMapUsers();
}

// ==================== Clear PolyGun Fillter ==================== ✅
window.clearPolygonFilter = function () {
    if (drawnPolygonLayer) {
        drawnPolygonLayer.getSource().clear();
    }
    if (markersIsActive) {
        loadMapUsers();
    }
    const drawBtn = document.getElementById('drawPolygonBtn');
    const clearBtn = document.getElementById('clearPolygonBtn');
    if (drawBtn && clearBtn) {
        drawBtn.style.display = 'inline-block';
        clearBtn.style.display = 'none';
    }
};

// ==================== Charts Refresh(If they are Active) ==================== ✅
window.refreshProvinceChartsIfActive = function () {
    if (provinceChartsActive && map) {
      addPieChart(map, vectorSource);        

    }
    if (markersIsActive && map) {
        loadMapUsers();
    }
};

// ==================== Setuping Draw Tool ==================== ✅
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
        let clickedFeature = null;
        map.forEachFeatureAtPixel(e.pixel, function (feature) {
            clickedFeature = feature;
            return true;
        });

        if (clickedFeature) {
            const user = clickedFeature.values_.user;
            if (user) {
                showUserInfoPopup(user, e.pixel);
                userSelectToggle(user.id);
            }
        }
    });

    map.on("pointermove", function (e) {
        let currentFeature = null;
        map.forEachFeatureAtPixel(e.pixel, function (feature) {
            
            currentFeature = feature;
            return true; 
        });

        if (currentFeature) {
           
            if (currentFeature !== currentHoveredFeature) {
                const province = currentFeature.values_.province;
                const users = currentFeature.values_.users;
               
                if (province && users) {
                    chartToolTip(province, users, e.pixel);
                    currentHoveredFeature = currentFeature; 
                } else {
                   
                    hideTooltip();
                    currentHoveredFeature = null;
                }
            }
        } else {
           
            if (currentHoveredFeature) { 
                hideTooltip();
            }
        }
    })

    map.on("pointermove", function (e) {
        const hit = map.hasFeatureAtPixel(e.pixel);
        map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
    setupDrawing();

    if (markersIsActive) {
    loadMapUsers();
    }

    if (provinceChartsActive) {
        addPieChart(map, vectorSource);
    }
    updateSelectedUserCount();
    initPopupEvents();
}
// ====================  Select User Toggle Handler ==================== ✅
function userSelectToggle(userId) {
    const selectedUserIds = getSelectedUserIdsFromLocalStorage();
    const userIsSelected = selectedUserIds.includes(String(userId));

    if (userIsSelected) {
        removeUserIdFromLocalStorage(String(userId));
        const marker = findMarkerByUserId(String(userId)); 
        if (marker) {
            marker.setStyle(originalMarkerStyle);
        }
    } else {
        addUserIdToLocalStorage(String(userId));
        const marker = findMarkerByUserId(String(userId));
        if (marker) {
            marker.setStyle(SelectedMarkerStyle);
        }
    }
}


// ====================  Markers ==================== ✅
async function loadMapUsers() {
    try {
        const users = await fetchMapUsers();
        if (markersIsActive) !markersIsActive;

        users.forEach(user => {
            if (user.lat && user.lon) {
                const marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([user.lon, user.lat])),
                    name: `${user.firstName} ${user.lastName}`,
                    user: user
                });
                const selectedUserIds = getSelectedUserIdsFromLocalStorage();
                if (selectedUserIds.includes(String(user.id))) {
                    marker.setStyle(SelectedMarkerStyle);
                } else {
                    marker.setStyle(originalMarkerStyle);
                }
                
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

// ==================== Setuping PopUp ACtion ==================== ✅
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

// ==================== Load/Updating The Map ==================== ✅
function loadMap() {
    const oldOverlay = document.querySelector('.ol-overlaycontainer');
    if (oldOverlay) oldOverlay.style.display = 'none';
    if (!mapInitialized) {
        initMap();
    } else {
        if (markersIsActive) {
            loadMapUsers();
        }
        if (provinceChartsActive) {
            addPieChart(map, vectorSource);
        }
    }
}

// ====================   Buttons Show/Hide Hadnler ==================== ✅
document.addEventListener('DOMContentLoaded', () => {
    initPopupEvents();

    const provinceBtn = document.getElementById('provinceChartsBtn');
    if (provinceBtn) {
        provinceBtn.addEventListener('click', async () => {
            provinceChartsActive = !provinceChartsActive;
            if (provinceChartsActive) {
                provinceBtn.classList.add('active');
                if (mapInitialized) {
                    await addPieChart(map, vectorSource);
                } else {
                    toast.info('برای دیدن نمودارها ابتدا تب نقشه را باز کنید');
                }
            } else {
                provinceBtn.classList.remove('active');
                if (markersIsActive) {
                    vectorSource.clear();
                    await loadMapUsers();
                } else {
                    vectorSource.clear();
                    clearPolygonFilter();
                }
            }
        });
    }
    const UserBtn = document.getElementById('UserBtn');
    if (UserBtn) {
        UserBtn.addEventListener('click', async () => {
            markersIsActive = !markersIsActive;
            if (markersIsActive) {
                UserBtn.classList.add('active');
                if (mapInitialized) {
                    await loadMapUsers();
                } else {
                    toast.info('برای دیدن کاربران ابتدا تب نقشه را باز کنید');
                }
            } else {
                UserBtn.classList.remove('active');
                if (mapInitialized) {
                    if (provinceChartsActive) {
                        vectorSource.clear();
                        await addPieChart(map, vectorSource);
                    } else {
                        vectorSource.clear();
                        clearPolygonFilter();
                    }
                }
            }
        });
    }
});

// ====================  Provinces Chart  ==================== ✅
async function addPieChart(map, vectorSource) {
    if (!map) return;

    const centers = await loadProvinceCenters();
    if (!centers || Object.keys(centers).length === 0) return;

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
        provinceGroups[province][type] += 1;
    });

    for (const [province, counts] of Object.entries(provinceGroups)) {
        const center = centers[province];
        if (!center) continue;

        const projectedCenter = ol.proj.fromLonLat(center);


        const dataValues = [];

        dataValues.push(counts.admin);
        dataValues.push(counts.special);
        dataValues.push(counts.plus);
        dataValues.push(counts.user);
        //let user = dataValues[0];
        //let plus = dataValues[1];
        //let admin = dataValues[2];
        //let special = dataValues[3];
        //console.log('user =>' , user);
        //console.log('plus =>' , plus);
        //console.log('admin  =>' , admin);
        //console.log('special =>', special);




        if (dataValues.length === 0) continue;

        // Create PieChart
        const pieChartStyle = new ol.style.Chart({
            type: 'pie',
            radius: 30,
            data: [1, 2, 2.5, 4],
            colors: ['#FF304F', '#FF9F1C', '#2A9D8F', '#8338EC'],
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 0.5
            })
        });
        //console.log("Pie chart added for:", province, dataValues);

        const featureStyle = new ol.style.Style({
            image: pieChartStyle
        });

        const pieChartFeature = new ol.Feature({
            geometry: new ol.geom.Point(projectedCenter),
            province: `${province}`,
            users: counts
        });
        provinceChartInstances.push(pieChartStyle);
        pieChartFeature.setStyle(featureStyle);
        vectorSource.addFeature(pieChartFeature);

    }

}

// ====================  Update SelectedUser Count  ==================== ✅
function updateSelectedUserCount() {
    const users = getSelectedUserIdsFromLocalStorage();
    document.getElementById('selectedUserCount').innerHTML = `: ${users.length}`;
}

window.loadMap = loadMap;
window.clearPolygonFilter = clearPolygonFilter;
window.refreshProvinceChartsIfActive = refreshProvinceChartsIfActive;