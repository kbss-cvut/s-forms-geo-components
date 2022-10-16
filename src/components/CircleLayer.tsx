import React from "react";
import {Circle, LayerGroup, Tooltip} from "react-leaflet";
import {LatLng} from "leaflet";

interface Props {
    center: number[]
}

export default class CircleLayer extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
        <LayerGroup>
            <Circle
                center={new LatLng(this.props.center[0], this.props.center[1])}
                pathOptions={{ fillColor: 'blue' }}
                radius={120}
            >
                <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                Zde se nacházíte
                </Tooltip>
            </Circle>
        </LayerGroup>
        );
    }
}