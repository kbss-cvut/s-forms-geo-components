import L, { LatLng, LeafletMouseEventHandlerFn } from "leaflet";
import AddressPlace from "../../model/AddressPlace";
import React, { MouseEventHandler, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Button } from "react-bootstrap";
// @ts-ignore
import icon from "leaflet/dist/images/marker-icon.png";
// @ts-ignore
import iconShadow from "leaflet/dist/images/marker-shadow.png";

/*let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -45]
});

L.Marker.prototype.options.icon = DefaultIcon;*/

interface Props {
  onAddressPlacePicked: (addressPlace: AddressPlace) => void,
  onMarkerLocationPicked: (latitude: number, longitude: number) => void,
  onAddressPlaceReset: () => void
}

interface MarkerProps extends Props {
}

export default function GeneralLocationMarker(props: MarkerProps) {
  const [markerCoords, setMarkerCoords] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setMarkerCoords(new LatLng(e.latlng.lat, e.latlng.lng));
    }
  });

  return markerCoords === null ? null : (
    <Marker position={markerCoords}>
      <Popup closeButton={false}>
        {markerCoords.lat.toFixed(7) + " z. š."} <br/>
        {markerCoords.lng.toFixed(7) + " z. d."} <br/>
        <Button className={"btn-primary popup-btn"}
                onClick={(e) => {
          e.stopPropagation();
          props.onMarkerLocationPicked(markerCoords.lat, markerCoords.lng)}}>Fill in the form</Button>
        <Button className={"btn-secondary popup-btn"} onClick={() => map.closePopup()}>Close</Button>
      </Popup>
    </Marker>
  )
}