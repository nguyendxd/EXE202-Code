import { useEffect, useState, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your Mapbox access token
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZHVjbmd1eWVuMTIwNDA0IiwiYSI6ImNtYmhvc25tMzBiejQybXB2bW5tNnQzcHEifQ.Qh9wsJMYKeAqe96lQJ_ZBA";

export default function RescueMapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize map and get user location/stations
  useEffect(() => {
    if (map.current) return; // initialize map only once

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [105.8342, 21.0285], // Default to Hanoi coordinates
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Wait for the map to load before getting user location and data
    map.current.on('load', () => {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });

            console.log("User location obtained:", { latitude, longitude });

            // Center map on user's location
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14
            });

            try {
              // Fetch nearby stations
              const response = await axios.get("http://localhost:3000/api/map/nearby-stations", {
                params: {
                  latitude,
                  longitude,
                  radius: 20
                }
              });

              if (response.data.success) {
                setStations(response.data.data);
              }
            } catch (err) {
              console.error("Failed to fetch nearby stations:", err);
              setError("Không thể tải dữ liệu các trạm thú y gần đây");
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setError("Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí.");
            setLoading(false);
          }
        );
      } else {
        setError("Trình duyệt của bạn không hỗ trợ định vị!");
        setLoading(false);
      }
    });

    // Cleanup map on component unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // End useEffect for map initialization

  // Add station markers when stations data changes or userAddress is updated
  useEffect(() => {
    if (!map.current || (!stations.length && !userLocation)) return; // Only proceed if map is ready and we have data/location

    // Clear existing markers, including user marker
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers for user and stations
    if (userLocation) {
      new mapboxgl.Marker({ color: "#4285F4" })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML("<h3>Vị trí của bạn</h3>"))
        .addTo(map.current);
    }

    stations.forEach((station) => {
      const [lng, lat] = station.location.coordinates;
      const markerColor = station.source === "database" ? "#FF5722" : "#4CAF50";

      const popupContent = `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 5px 0;">${station.name}</h3>
          <p style="margin: 0 0 5px 0;">${station.address}</p>
          ${station.phone ? `<p style="margin: 0 0 5px 0;">📞 ${station.phone}</p>` : ""}
          ${station.email ? `<p style="margin: 0 0 5px 0;">📧 ${station.email}</p>` : ""}
          <p style="margin: 0 0 5px 0;">📍 ${station.distance.text}</p>
          <p style="margin: 0;">⏱️ ${station.duration.text}</p>
        </div>
      `;

      new mapboxgl.Marker({ color: markerColor })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
        .addTo(map.current);
    });
  }, [stations, userLocation]);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />

      {loading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          Đang tải bản đồ...
        </div>
      )}

      {error && (
        <div style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#ff5252",
          color: "white",
          padding: "10px 20px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
