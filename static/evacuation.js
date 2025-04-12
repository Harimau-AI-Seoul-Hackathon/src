document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("evacuation").setView([35.5384, 129.3114], 13); // Ulsan coordinates

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // Layer groups
  const floodAlerts = L.layerGroup();
  const evacuationZones = L.layerGroup();
  const shelters = L.layerGroup();
  const blockedRoads = L.layerGroup();

  // Example: Flood Alert Areas
  L.circle([35.54, 129.31], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 600
  }).bindPopup("⚠️ Flood Alert Zone").addTo(floodAlerts);

  // Example: Evacuation Zone Polygon
  L.polygon([
    [35.537, 129.305],
    [35.539, 129.308],
    [35.541, 129.304]
  ], {
    color: "blue",
    fillColor: "lightblue",
    fillOpacity: 0.4
  }).bindPopup("🚪 Evacuation Zone").addTo(evacuationZones);

  // Example: Shelters
  L.marker([35.536, 129.309])
    .bindPopup("🏠 Shelter: Community Hall")
    .addTo(shelters);
  L.marker([35.542, 129.313])
    .bindPopup("🏠 Shelter: School Gym")
    .addTo(shelters);

  // Example: Blocked Roads
  L.polyline([
    [35.538, 129.307],
    [35.5385, 129.312]
  ], {
    color: "black",
    dashArray: "5, 10"
  }).bindPopup("⛔ Blocked Road").addTo(blockedRoads);

  // Add all to map initially
  floodAlerts.addTo(map);
  evacuationZones.addTo(map);
  shelters.addTo(map);
  blockedRoads.addTo(map);

  // Layer toggle control
  const overlays = {
    "🌊 Flood Alerts": floodAlerts,
    "🚪 Evacuation Zones": evacuationZones,
    "🏠 Shelters": shelters,
    "⛔ Blocked Roads": blockedRoads
  };

  L.control.layers(null, overlays, { collapsed: false }).addTo(map);
});
