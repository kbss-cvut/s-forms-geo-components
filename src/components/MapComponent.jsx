import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position = [50.07627554166782, 14.419010682209004]

export default class MapComponent extends React.Component {
    mapRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = { coords: null};

        navigator.geolocation.getCurrentPosition(geolocation =>
            this.setState({
                coords: [geolocation.coords.latitude, geolocation.coords.longitude]
            }), err => {
            console.log("Cannot get current geolocation, using default coords...");
            this.setState({
                coords: position
            })
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.mapRef.current)
            this.mapRef.current.invalidateSize();
    }

    render() {
        if (this.state.coords)
            return (
                <MapContainer center={this.state.coords} zoom={13} scrollWheelZoom={false} whenCreated={mapInstance => this.mapRef.current = mapInstance}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={this.state.coords}>
                        <Popup>
                            A pretty CSS3 popup. <br/> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            );
        return null;
    }
}