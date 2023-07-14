import { Map } from "./map/Map.js";

export const App = () => (
  <Map
    apiKey={import.meta.env.PUBLIC_MAP_API_KEY}
    mapName={import.meta.env.PUBLIC_MAP_NAME}
    region={import.meta.env.PUBLIC_AWS_REGION}
    placesIndexName={import.meta.env.PUBLIC_PLACES_INDEX_NAME}
  />
);
