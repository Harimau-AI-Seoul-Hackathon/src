document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("typhoonMap").setView([33.4996, 126.5312], 11); // Example: Jeju Island
  window.typhoonMap = map; // Expose for resize fix

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // Layer groups
  const typhoonAlerts = L.layerGroup();
  const evacuationZones = L.layerGroup();
  const shelters = L.layerGroup();
  const floodRoads = L.layerGroup();

  // Example: Typhoon Alert Zone
  L.circle([33.51, 126.52], {
    color: "purple",
    fillColor: "#d69eff",
    fillOpacity: 0.4,
    radius: 800
  }).bindPopup("🌪️ Typhoon Alert Area").addTo(typhoonAlerts);

  // Example: Evacuation Zone
  L.polygon([
    [33.496, 126.528],
    [33.498, 126.532],
    [33.500, 126.526]
  ], {
    color: "blue",
    fillColor: "#a3cfff",
    fillOpacity: 0.4
  }).bindPopup("🚪 Typhoon Evacuation Zone").addTo(evacuationZones);

  // Example: Shelters
  L.marker([33.497, 126.534])
    .bindPopup("🏠 Shelter: Jeju Middle School")
    .addTo(shelters);
  L.marker([33.502, 126.529])
    .bindPopup("🏠 Shelter: Jeju Community Center")
    .addTo(shelters);

  // Example: Flood-Prone Road
  L.polyline([
    [33.499, 126.530],
    [33.5005, 126.537]
  ], {
    color: "darkred",
    dashArray: "5, 10"
  }).bindPopup("🌊 Flood-Prone Road").addTo(floodRoads);

  // Add layers to map
  typhoonAlerts.addTo(map);
  evacuationZones.addTo(map);
  shelters.addTo(map);
  floodRoads.addTo(map);

  // Layer control toggle
  const overlays = {
    "🌪️ Typhoon Alerts": typhoonAlerts,
    "🚪 Evacuation Zones": evacuationZones,
    "🏠 Shelters": shelters,
    "🌊 Flood-Prone Roads": floodRoads
  };

  L.control.layers(null, overlays, { collapsed: false }).addTo(map);
});

function showTyphoonSafetyTab() {
  document.getElementById("tab-container").classList.remove("hidden");
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.getElementById("info-typhoon").classList.remove("hidden");

  setTimeout(() => {
    if (window.typhoonMap) {
      window.typhoonMap.invalidateSize();
    }
  }, 100);
}
