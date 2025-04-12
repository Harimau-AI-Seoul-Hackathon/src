document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("flood-map").setView([37.5665, 126.978], 12); // Centered on Seoul
  window.floodMap = map; // 👈 expose globally for resize fix

  // Base map layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // Layer groups
  const floodAlerts = L.layerGroup();
  const evacuationZones = L.layerGroup();
  const shelters = L.layerGroup();
  const blockedRoads = L.layerGroup();

  // Example: Flood Alert Zone
  L.circle([37.568, 126.98], {
    color: "blue",
    fillColor: "#72c1ff",
    fillOpacity: 0.5,
    radius: 700
  }).bindPopup("🌊 Flood Alert Area").addTo(floodAlerts);

  // Example: Evacuation Zone Polygon
  L.polygon([
    [37.565, 126.976],
    [37.567, 126.980],
    [37.569, 126.974]
  ], {
    color: "navy",
    fillColor: "#cceeff",
    fillOpacity: 0.4
  }).bindPopup("🚪 Flood Evacuation Zone").addTo(evacuationZones);

  // Example: Shelters
  L.marker([37.564, 126.982])
    .bindPopup("🏠 Shelter: Seoul City Emergency Shelter")
    .addTo(shelters);
  L.marker([37.570, 126.976])
    .bindPopup("🏠 Shelter: Han River Flood Relief Hub")
    .addTo(shelters);

  // Example: Blocked Roads
  L.polyline([
    [37.566, 126.978],
    [37.5665, 126.984]
  ], {
    color: "black",
    dashArray: "5, 10"
  }).bindPopup("⛔ Blocked Road (Flooded)").addTo(blockedRoads);

  // Add all layers to the map
  floodAlerts.addTo(map);
  evacuationZones.addTo(map);
  shelters.addTo(map);
  blockedRoads.addTo(map);

  // Layer control toggle
  const overlays = {
    "🌊 Flood Alerts": floodAlerts,
    "🚪 Evacuation Zones": evacuationZones,
    "🏠 Shelters": shelters,
    "⛔ Blocked Roads": blockedRoads
  };

  L.control.layers(null, overlays, { collapsed: false }).addTo(map);
});

// Show Flood Tab & Fix Map Resize
function showFloodSafetyTab() {
  document.getElementById("tab-container").classList.remove("hidden");
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.getElementById("info4").classList.remove("hidden");

  setTimeout(() => {
    if (window.floodMap) {
      window.floodMap.invalidateSize();
    }
  }, 100);
}
