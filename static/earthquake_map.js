document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("earthquakeMap").setView([37.5665, 126.978], 6); // Center on Seoul, Korea
    window.earthquakeMap = map; // 👈 expose globally for resize fix
  
    // Add tile layer to the map (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);
  
    // Layer groups for different earthquake-related data
    const earthquakeMarkers = L.layerGroup();
  
    // Earthquake data (from the provided data)
    const earthquakeData = [
      [19, "2/4/2025 22:47", 2.4, 8, "Ⅰ", "35.56 N", "124.43 E"],
      [18, "31/3/2025 21:19", 2.0, 12, "Ⅰ", "41.36 N", "129.43 E"],
      [17, "29/3/2025 5:37", 2.5, 20, "Ⅱ", "33.90 N", "126.93 E"],
      [16, "20/3/2025 16:26", 2.5, 15, "Ⅰ", "36.49 N", "124.68 E"],
      [15, "17/3/2025 11:39", 2.2, 12, "Ⅰ", "38.67 N", "125.62 E"],
      [14, "13/3/2025 0:40", 2.2, 22, "Ⅰ", "35.62 N", "129.96 E"],
      [13, "22/2/2025 6:30", 2.0, 8, "Ⅰ", "36.71 N", "125.93 E"],
      [12, "17/2/2025 11:20", 2.1, 21, "Ⅰ", "33.91 N", "126.93 E"],
      [11, "16/2/2025 13:42", 2.2, 20, "Ⅱ", "33.91 N", "126.94 E"],
      [10, "15/2/2025 6:49", 2.6, 5, "Ⅲ", "37.28 N", "129.33 E"],
      [9, "13/2/2025 12:06", 2.3, 8, "Ⅱ", "35.70 N", "126.73 E"],
      [8, "9/2/2025 17:49", 2.1, null, "Ⅰ", "38.49 N", "126.15 E"],
      [7, "7/2/2025 2:35", 3.1, 9, "Ⅴ", "37.14 N", "127.76 E"],
      [6, "29/1/2025 2:15", 2.1, 11, "Ⅰ", "38.47 N", "126.19 E"],
      [5, "14/1/2025 16:33", 2.5, 10, "Ⅰ", "39.01 N", "126.53 E"],
      [4, "11/1/2025 22:35", 2.2, 13, "Ⅰ", "33.49 N", "125.85 E"],
      [3, "5/1/2025 9:54", 2.1, 10, "Ⅱ", "35.48 N", "128.31 E"],
      [2, "5/1/2025 2:43", 2.2, 5, "Ⅰ", "38.00 N", "125.39 E"],
      [1, "3/1/2025 15:28", 2.9, 8, "Ⅴ", "35.56 N", "127.94 E"]
    ];
  
    // Loop through each earthquake data and add it to the map
    earthquakeData.forEach(function (earthquake) {
      // Extract latitude and longitude
      const latitude = parseFloat(earthquake[5].split(" ")[0]);
      const longitude = parseFloat(earthquake[6].split(" ")[0]);
  
      // Create a circle marker based on earthquake magnitude
      L.circle([latitude, longitude], {
        color: getMagnitudeColor(earthquake[2]),
        radius: earthquake[2] * 20000, // Size based on magnitude
        fillOpacity: 0.5
      }).addTo(earthquakeMarkers)
        .bindPopup(`
          <strong>Date:</strong> ${earthquake[1]}<br>
          <strong>Magnitude:</strong> ${earthquake[2]}<br>
          <strong>Depth:</strong> ${earthquake[3]} km<br>
          <strong>Intensity:</strong> ${earthquake[4]}<br>
          <strong>Location:</strong> ${earthquake[5]} ${earthquake[6]}
        `);
    });
  
    // Add the earthquake markers layer to the map
    earthquakeMarkers.addTo(map);
  
    // Layer toggle control
    const overlays = {
      "🌍 Earthquakes": earthquakeMarkers
    };
  
    L.control.layers(null, overlays, { collapsed: false }).addTo(map);
  });
  
  // Helper function to determine the color of the earthquake marker based on its magnitude
  function getMagnitudeColor(magnitude) {
    if (magnitude >= 7) return 'red';
    if (magnitude >= 6) return 'orange';
    if (magnitude >= 5) return 'yellow';
    return 'green';
  }
  
  // Function to show the earthquake safety tab (if triggered)
  function showEarthquakeSafetyTab() {
    document.getElementById("tab-container").classList.remove("hidden");
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    document.getElementById("info2").classList.remove("hidden");
  
    setTimeout(() => {
      if (window.earthquakeMap) {
        window.earthquakeMap.invalidateSize(); // Fix map size after tab switch
      }
    }, 100);
  }
  