import React, {useState} from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position = [50.07627554166782, 14.419010682209004]

function LocationMarker(props) {
    const [markerCoords, setMarkerCoords] = useState(position);
    const map = useMapEvents({
        click(e) {
            setMarkerCoords([e.latlng.lat, e.latlng.lng]);
            props.onMarkerLocationChange(e.latlng.lat, e.latlng.lng);
        }
    });

    return markerCoords === null ? null : (
        <Marker position={markerCoords}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default class MapComponent extends React.Component {
    mapRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            coords: position,
        }

        navigator.geolocation.getCurrentPosition(geolocation => this.setState({
            coords: [geolocation.coords.latitude, geolocation.coords.longitude]
        }));

        props.onMarkerLocationChange(this.state.coords[0], this.state.coords[1]);
    }

    componentDidMount() {
        const mapEl =  document.querySelector("#map");
        // Clickable section label (Geometrie)
        const sectionParent = mapEl ? mapEl.closest("div.mb-3.card").firstChild : null;

        if (sectionParent) {
            sectionParent.addEventListener('click', (e) => {
                e.preventDefault();
                setTimeout(
                    () => {
                        this.mapRef.current.invalidateSize();
                    }, 50
                );
            });
        }
    }

    updateMapCenter = (latitude, longitude) => {
        this.setState({
            coords: [latitude, longitude]
        });
    }

    render() {
        if (this.state.coords) {
            return (
                <div>
                    <MapContainer id={"map"} center={this.state.coords} zoom={13} scrollWheelZoom={false}
                                  whenCreated={mapInstance => this.mapRef.current = mapInstance}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker {...this.props} onChange={this.updateMapCenter}/>
                    </MapContainer>
                </div>
            );
        } else
            return null;
    }
}