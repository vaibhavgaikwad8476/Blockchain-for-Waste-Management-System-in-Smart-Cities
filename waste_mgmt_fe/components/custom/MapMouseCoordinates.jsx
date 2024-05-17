"use client";
import React, { useState } from "react";
import { useMapEvents } from "react-leaflet";

const MapMouseCoordinates = ({ className }) => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const map = useMapEvents({
    mousemove: (e) => {
      setPosition(e.latlng);
    },
  });
  return (
    <div className={className} style={{ textShadow: "0 0 10px #fff" }}>
      Lat: {position.lat.toFixed(3)}, Long: {position.lng.toFixed(3)}
    </div>
  );
};

export default MapMouseCoordinates;
