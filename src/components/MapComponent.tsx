import React, {useEffect, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {LatLng, LatLngExpression} from 'leaflet';
import {Map as LeafletMap } from 'leaflet';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [32, 44],
    iconAnchor: [16, 44]
});

L.Marker.prototype.options.icon = DefaultIcon;

const position = [50.07627554166782, 14.419010682209004];

interface Props {
    onMarkerLocationChange: (latitude: number, longitude: number) => void,
    onChange?: (latitude: number, longitude: number) => void
}

interface MarkerProps extends Props {
    readonly initPosition: LatLng
}

function LocationMarker(props: MarkerProps) {
    const [markerCoords, setMarkerCoords] = useState<LatLngExpression>(new LatLng(position[0], position[1]));

    const [init, setInit] = useState(false);
    if (!init && !props.initPosition?.equals(new LatLng(position[0], position[1]))) {
        setMarkerCoords(props.initPosition);
        setInit(true);
    }

    const map = useMapEvents({
        click(e) {
            setMarkerCoords(new LatLng(e.latlng.lat, e.latlng.lng));
            props.onMarkerLocationChange(e.latlng.lat, e.latlng.lng);
            props.onChange?.(e.latlng.lat, e.latlng.lng);
        }
    });

    return markerCoords === null ? null : (
        <Marker position={markerCoords}>
            <Popup>You are here</Popup>
        </Marker>
    )
}


interface MapState {
    coords: number[]
}

export default class MapComponent extends React.Component<Props, MapState> {
    private mapRef: React.MutableRefObject<LeafletMap | null>;

    constructor(props: Props) {
        super(props);
        this.state = {
            coords: position,
        }

        this.mapRef = React.createRef();

        navigator.geolocation.getCurrentPosition(geolocation => {
            this.setState({
                coords: [geolocation.coords.latitude, geolocation.coords.longitude]
            });
            props.onMarkerLocationChange(geolocation.coords.latitude, geolocation.coords.longitude);
            if (this.mapRef != null && this.mapRef.current != null)
                this.mapRef.current.setView(new LatLng(geolocation.coords.latitude, geolocation.coords.longitude));
        });
    }

    componentDidMount() {
        const mapEl =  document.querySelector("#map");
        // Clickable section label (Geometrie)
        let sectionParent;

        if (mapEl) {
            const cardParent = mapEl.closest("div.mb-3.card");
            sectionParent = cardParent ? cardParent.firstChild : null;
        }

        if (sectionParent) {
            sectionParent.addEventListener('click', (e) => {
                e.preventDefault();
                setTimeout(
                    () => {
                        if (this.mapRef.current) {
                            this.mapRef.current.invalidateSize();
                            this.mapRef.current.setView(new LatLng(this.state.coords[0], this.state.coords[1]));
                        }
                    }, 20
                );
            });
        }
    }

    updateMapCenter = (latitude: number, longitude: number) => {
        this.setState({
            coords: [latitude, longitude]
        });
        this.mapRef.current?.setView(new LatLng(this.state.coords[0], this.state.coords[1]));
    }

    render() {
        if (this.state.coords) {
            return (
                <div>
                    <MapContainer id={"map"} center={new LatLng(this.state.coords[0], this.state.coords[1])} zoom={13} scrollWheelZoom={false}
                                  whenCreated={mapInstance => this.mapRef.current = mapInstance}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker {...this.props} initPosition={new LatLng(this.state.coords[0], this.state.coords[1])} onChange={this.updateMapCenter}/>
                    </MapContainer>
                </div>
            );
        } else
            return null;
    }
}