"use client";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import MapMouseCoordinates from "./MapMouseCoordinates";

const Map = ({ markerPositions, position, zoom }) => {
  return (
    <>
      <MapContainer
        center={position}
        zoom={zoom}
        maxZoom={20}
        minZoom={2}
        scrollWheelZoom
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPositions.map((markerData, index) => {
          return (
            <Marker
              position={markerData.position}
              key={index}
              onClick={() => {
                console.log(e);
              }}
            >
              <Tooltip>{markerData.tooltipContent}</Tooltip>
              <Popup>{markerData.popupContent}</Popup>
            </Marker>
          );
        })}
        <MapMouseCoordinates className="fixed z-[999] top-2 left-[50%]" />
      </MapContainer>
    </>
  );
};

export default Map;
