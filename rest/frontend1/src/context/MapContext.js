import { createContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const URL =
    window.location.host === "localhost:3000"
      ? process.env.REACT_APP_LURL
      : process.env.REACT_APP_PURL;

  const [map, SetMap] = useState(
    "https://storage.googleapis.com/django_media_biteam/public/maps/default_map.html"
  );
  const [routes, SetRoutes] = useState(
    "https://storage.googleapis.com/django_media_biteam/public/maps/default_map.html"
  );

  const [loading, SetLoading] = useState(false);
  // const [mapLoading, SetMapLoading] = useState(false)
  const fetchMaps = async (mapdata) => {
    SetLoading(true);
    const response = await fetch(`${URL}/map/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapdata),
    });

    if (response.ok) {
      SetLoading(false);
      const data = await response.json(); // or .json() or whatever
      SetMap(data.map_string);
      console.log(data);
    } else {
      void 0;
      SetLoading(false);
    }
  };

  const fetchRoutes = async (routesdata) => {
    SetLoading(true);
    const response = await fetch(`${URL}/routes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routesdata),
    });

    if (response.ok) {
      SetLoading(false);
      const data = await response.json(); // or .json() or whatever
      SetRoutes(data.map_string);
      console.log(data);
    } else {
      void 0;
      SetLoading(false);
    }
  };

  return (
    <MapContext.Provider
      value={{
        SetLoading,
        loading,
        map,
        fetchMaps,
        routes,
        fetchRoutes,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
