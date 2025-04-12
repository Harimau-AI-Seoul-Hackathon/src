function openModal() {
    document.getElementById('shelterModal').classList.remove('hidden');
    setTimeout(initializeMap, 200); // Ensure modal renders before loading map
  }

  function closeModal() {
    document.getElementById('shelterModal').classList.add('hidden');
  }

  let mapInitialized = false;

  function initializeMap() {
    if (mapInitialized) return;

    const map = L.map('map').setView([37.5665, 126.9780], 11); // Seoul default

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    fetch("http://localhost:5000/api/disaster-data")
      .then(res => res.json())
      .then(data => {
        const items = data.response.body.items;
        if (!items || items.length === 0) {
          alert("No disaster data found.");
          return;
        }

        items.forEach(item => {
          const lat = parseFloat(item.lat || item.latitude);
          const lon = parseFloat(item.lon || item.longitude);
          const info = item.msg || item.content || "Disaster Alert";

          if (lat && lon) {
            L.marker([lat, lon])
              .addTo(map)
              .bindPopup(info);
          }
        });
      })
      .catch(err => console.error("Error loading data:", err));

    mapInitialized = true;
  }