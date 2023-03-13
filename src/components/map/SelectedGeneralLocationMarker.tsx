import L, { LatLng, LatLngExpression } from "leaflet";
import AddressPlace from "../../model/AddressPlace";
import React, { useState } from "react";
import { Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: require('../../img/geo-fill-selected.svg'),
  iconRetinaUrl: require('../../img/geo-fill-selected.svg'),
  iconSize: [36, 48],
  iconAnchor: [20, 48],
  popupAnchor: [0,-40]
});

interface Props {
  coords: LatLng
}

export default function SelectedGeneralLocationMarker(props: Props) {
  const map = useMap();
  return(
    <Marker position={props.coords} icon={customIcon} eventHandlers={{click: () => map.getZoom() < 15 ? map.setView(props.coords, 15) : null}}>
      <Tooltip className={"cursor-pointer"} direction="bottom" offset={[0, 1]} opacity={1} interactive>
        {props.coords.lat.toFixed(7) + " z. š."} <br/>
        {props.coords.lng.toFixed(7) + " z. d."} <br/>
      </Tooltip>
      <Popup closeButton={false} position={new LatLng(props.coords.lat+0.00565, props.coords.lng)}>
        {props.coords.lat.toFixed(7) + " z. š."} <br/>
        {props.coords.lng.toFixed(7) + " z. d."} <br/>
      </Popup>
    </Marker>
  )
}