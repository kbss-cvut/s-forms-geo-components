import L, { LatLng, LeafletMouseEventHandlerFn } from "leaflet";
import AddressPlace from "../../model/AddressPlace";
import React, { MouseEventHandler, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Button } from "react-bootstrap";
// @ts-ignore
import icon from "leaflet/dist/images/marker-icon.png";
// @ts-ignore
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Constants from "../../Constants";

/*let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -45]
});

L.Marker.prototype.options.icon = DefaultIcon;*/

interface MarkerProps {
  pickedLocationCoords: LatLng | null,
  handleMarkerClick: (coords: LatLng) => void
}

export default function GeneralLocationMarker(props: MarkerProps) {
  const [markerCoords, setMarkerCoords] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setMarkerCoords(new LatLng(e.latlng.lat, e.latlng.lng));
    }
  });

  if (props.pickedLocationCoords && markerCoords?.lat === props.pickedLocationCoords.lat && markerCoords.lng === props.pickedLocationCoords.lng)
     return null;

  return markerCoords === null ? null : (
    <Marker position={markerCoords}
            eventHandlers = {{click: () => props.handleMarkerClick(markerCoords)}}>
    </Marker>
  )
}

export function getMarkerPopupHTML(markerCoords: LatLng) {
  let htmlString = "";
  htmlString += markerCoords.lat.toFixed(7) + " z. š." + "<br/>";
  htmlString += markerCoords.lng.toFixed(7) + " z. d." + "<br/>";

  htmlString += "<button id=" + Constants.LOCATION_PICK_BUTTON + " type=\"button\" class=\"btn btn-primary popup-btn\">Select location</button> <br/>";
  htmlString += "<button id=" + Constants.LOCATION_CLOSE_BUTTON + " type=\"button\" class=\"btn btn-secondary popup-btn\">Close</button>";

  return htmlString;
}