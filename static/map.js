// Initialize map centered on South Korea
const map = L.map('map').setView([36.5, 127.8], 7); // South Korea center

// Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ===== Layer Groups =====
const hospitalLayer = L.layerGroup();
const policeLayer = L.layerGroup();
const fireStationLayer = L.layerGroup();

// === Sample Markers ===
// Hospitals
L.marker([37.5665, 126.9780]).bindPopup("Seoul National University Hospital").addTo(hospitalLayer);
L.marker([35.1796, 129.0756]).bindPopup("Busan Medical Center").addTo(hospitalLayer);

// Police
L.marker([37.5714, 126.9910]).bindPopup("Jongno Police Station").addTo(policeLayer);
L.marker([35.1600, 129.0545]).bindPopup("Busan Central Police Station").addTo(policeLayer);

// Fire Stations
L.marker([37.5509, 126.9901]).bindPopup("Seoul Fire Station").addTo(fireStationLayer);
L.marker([35.1537, 129.0595]).bindPopup("Busan Fire Station").addTo(fireStationLayer);

// ===== Layer Control =====
const overlayMaps = {
  "🏥 Hospitals": hospitalLayer,
  "🚓 Police Stations": policeLayer,
  "🔥 Fire Stations": fireStationLayer
};

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);