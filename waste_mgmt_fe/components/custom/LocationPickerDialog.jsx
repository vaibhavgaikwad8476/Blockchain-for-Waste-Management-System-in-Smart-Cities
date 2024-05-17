"use client";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import MapMouseCoordinates from "./MapMouseCoordinates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
      },
    });
    return position ? <Marker position={position}></Marker> : null;
  };

  return (
    <MapContainer
      center={[18.5, 73.8]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapMouseCoordinates className="fixed z-[999] top-[5.5rem] left-[37.5%]" />
      <MapEvents />
    </MapContainer>
  );
};

export function LocationPickerDialog({ onLocationSelect }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="block w-full" variant="outline">
          Choose your location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tap to choose your location</DialogTitle>
          <DialogDescription>
            Your waste will be collected from this selected location
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <LocationPicker onLocationSelect={onLocationSelect} />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LocationPickerDialog;
