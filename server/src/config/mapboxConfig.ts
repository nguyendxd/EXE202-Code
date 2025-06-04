import mapboxSdk from '@mapbox/mapbox-sdk';
import geocoding from '@mapbox/mapbox-sdk/services/geocoding';
import directions from '@mapbox/mapbox-sdk/services/directions';

const baseClient = mapboxSdk({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN as string
});

const geocodingClient = geocoding(baseClient);
const directionsClient = directions(baseClient);

export { geocodingClient, directionsClient };