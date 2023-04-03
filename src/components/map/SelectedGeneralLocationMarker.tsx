import L, { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import { Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet";

const customIcon = new L.Icon({
  iconUrl: require('../../img/selected-location-icon.svg'),
  iconRetinaUrl: require('../../img/selected-location-icon.svg'),
  iconSize: [38, 50],
  iconAnchor: [22, 50],
  popupAnchor: [0,-44]
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