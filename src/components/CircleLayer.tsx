import React from "react";
import {Circle, LayerGroup, Tooltip} from "react-leaflet";
import {LatLng} from "leaflet";

interface Props {
    userLocation: GeolocationPosition
}

export default class CircleLayer extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
        <Circle
            center={new LatLng(this.props.userLocation.coords.latitude, this.props.userLocation.coords.longitude)}
            pathOptions={{ fillColor: 'blue' }}
            radius={this.props.userLocation.coords.accuracy}
            className={"location-circle"}
        >
        </Circle>
        );
    }
}