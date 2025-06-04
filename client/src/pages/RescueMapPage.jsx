import React, { useState, useEffect, useRef } from 'react';
import goongjs from '@goongmaps/goong-js';
import axios from 'axios'; // Import axios for API calls

function RescueMapPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [rescueStations, setRescueStations] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);
  const mapContainerRef = useRef(null); // Ref for the map container div
  const mapRef = useRef(null); // Ref to store the map instance
  const markersRef = useRef([]); // Ref to store rescue station markers

  // Replace with your actual Goong API Key
  const GOONG_API_KEY = 'Cy3luLPV7Lyy1gwTh7YnjU2yEkvWv9tWfpZLqjyc';

  // Effect to initialize the Goong Map
  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    // Initialize the map
    mapRef.current = new goongjs.Map({
      container: mapContainerRef.current, // Container ID
      style: 'https://tiles.goong.io/assets/goong_map_web.json', // Goong Map style URL
      center: [106.69019216100008, 10.792578281000033], 
      zoom: 12, 
      apiKey: GOONG_API_KEY, // Your Goong API Key
    });

    // Add navigation control (optional)
    mapRef.current.addControl(new goongjs.NavigationControl());

    // Clean up the map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [GOONG_API_KEY]); // Depend on API key just in case

  // Effect to get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLoading(false); // Stop loading after getting location
      },
      (err) => {
        setError(`Error getting user location: ${err.message}`);
        setLoading(false); // Stop loading on error
      }
    );
  }, []); // Empty dependency array means this runs once on mount

  // Effect to fetch rescue stations when userLocation is available
  useEffect(() => {
    if (!userLocation) {
      // Don't fetch if user location is not yet available
      // We might want to show a message asking for location access here
      return;
    }

    // Clear previous markers before adding new ones
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];


    // Move map center to user location once available
    if (mapRef.current) {
       mapRef.current.setCenter([userLocation.lng, userLocation.lat]);
       mapRef.current.setZoom(13); // Zoom in a bit on the user
    }


    const fetchRescueStations = async () => {
      setLoading(true); // Start loading for data fetch
      setError(null); // Clear previous errors
      const radiusInMeters = 30000; // 30 km in meters

      try {
        // Assuming your backend is running locally on port 5000
        const response = await axios.get('http://localhost:5000/map/nearby-stations', { // Đây là dòng gọi API
          params: {
            latitude: userLocation.lat,
            longitude: userLocation.lng,
             radius: 30 // Assuming backend expects km based on the previous screenshot
          }
        });

        // Check if the response structure matches the success case JSON
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
             setRescueStations(response.data.data);
        } else {
            // Handle cases where success is true but data is not an array or missing
             console.error("API response data is not in expected format:", response.data);
             setRescueStations([]); // Clear previous stations if data is bad
             setError("Received unexpected data format from the server.");
        }


      } catch (err) {
        console.error("Error fetching rescue stations:", err);
        setError(`Error fetching rescue stations: ${err.message}`);
        setRescueStations([]); // Clear stations on error
      } finally {
        setLoading(false); // Stop loading after fetch (success or error)
      }
    };

    fetchRescueStations();

  }, [userLocation]); // This effect runs whenever userLocation changes

  // Effect to add markers to the map when rescueStations data is updated
  useEffect(() => {
    if (!mapRef.current || rescueStations.length === 0) {
        // Clear markers if station list is empty
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        return;
    }


    // Clear previous markers before adding new ones
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    rescueStations.forEach(station => {
      // Ensure station has location and coordinates in the expected format [lng, lat]
      if (station.location && station.location.type === 'Point' && Array.isArray(station.location.coordinates) && station.location.coordinates.length === 2) {
        const [lng, lat] = station.location.coordinates;

        // Create a new marker
        const marker = new goongjs.Marker()
          .setLngLat([lng, lat]) // Set marker position [lng, lat]
          .setPopup(new goongjs.Popup().setHTML(`<h3>${station.name}</h3><p>${station.address}</p>`)) // Add a popup with station info
          .addTo(mapRef.current); // Add the marker to the map

        markersRef.current.push(marker); // Store marker reference
      } else {
        console.warn("Skipping station due to invalid location data:", station);
      }
    });

  }, [rescueStations]); // This effect runs whenever rescueStations changes

  return (
    <div style={{ height: 'calc(100vh - 90px)', position: 'relative' }}> {/* Added position: 'relative' for overlay */}
      <h1>Trang Bản Đồ Trạm Cứu Hộ</h1>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading and Error Overlay */}
      {(loading || error) && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10 // Ensure it's above the map
        }}>
          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
           {!userLocation && !loading && !error && <p>Đang chờ vị trí người dùng...</p>}
        </div>
      )}

       {/* Message when location is pending */}
      {!userLocation && !loading && !error && (
         <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10 // Ensure it's above the map
        }}>
           <p>Vui lòng cho phép truy cập vị trí để xem các trạm cứu hộ gần đó.</p>
         </div>
      )}


    </div>
  );
}

export default RescueMapPage; 