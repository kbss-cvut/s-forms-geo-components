import React, {useState} from "react";
import {LayersControl, MapContainer, Marker, TileLayer, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {LatLng, LatLngExpression, Map as LeafletMap} from 'leaflet';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Constants from '../Constants.js';
import Control from "react-leaflet-custom-control";
import LocateIcon from "./LocateIcon";
import CircleLayer from "./CircleLayer";
import CheckboxAnswer from "@kbss-cvut/s-forms/dist/components/answer/CheckboxAnswer";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [32, 44],
    iconAnchor: [16, 44]
});

L.Marker.prototype.options.icon = DefaultIcon;

const position = Constants.DEFAULT_COORDINATES;

interface Props {
    onMarkerLocationChange: (latitude: number, longitude: number) => void,
    onChange?: (latitude: number, longitude: number) => void
}

interface MarkerProps extends Props {
}

function LocationMarker(props: MarkerProps) {
    const [markerCoords, setMarkerCoords] = useState<LatLngExpression | null>(null);

    const map = useMapEvents({
        click(e) {
            setMarkerCoords(new LatLng(e.latlng.lat, e.latlng.lng));
            props.onMarkerLocationChange(e.latlng.lat, e.latlng.lng);
            props.onChange?.(e.latlng.lat, e.latlng.lng);
        }
    });

    return markerCoords === null ? null : (
        <Marker position={markerCoords}>
        </Marker>
    )
}


interface MapState {
    coords: number[],
    showUserLocationCircle: boolean,
    userLocationCoords: number[]
}

export default class MapComponent extends React.Component<Props, MapState> {
    private readonly mapRef: React.MutableRefObject<LeafletMap | null>;

    constructor(props: Props) {
        super(props);
        this.state = {
            coords: position,
            showUserLocationCircle: false,
            userLocationCoords: [0,0]
        }

        this.mapRef = React.createRef();
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

    onLocateIconClicked = () => {
        navigator.geolocation.getCurrentPosition(geolocation => {
            this.setState({
                coords: [geolocation.coords.latitude, geolocation.coords.longitude]
            });
            this.setState({ showUserLocationCircle: true, userLocationCoords: [geolocation.coords.latitude, geolocation.coords.longitude]});
            if (this.mapRef != null && this.mapRef.current != null)
                this.mapRef.current.setView(new LatLng(geolocation.coords.latitude, geolocation.coords.longitude), 15);
        });
    }

    relocateBasedOnUserInput = (latitude: string, longitude: string) => {
        this.updateMapCenter(parseFloat(latitude), parseFloat(longitude));
    }

    updateMapCenter = (latitude: number, longitude: number) => {
        this.setState({
            coords: [latitude, longitude]
        });
        this.mapRef.current?.setView(new LatLng(latitude, longitude));
    }

    canRenderStreetMap() {
        const checkbox: HTMLInputElement | null = document.querySelector(".leaflet-control-layers-selector");

        return checkbox != null && !checkbox.checked;
    }

    render() {
        if (this.state.coords) {
            return (
                <div>
                    <MapContainer id={"map"} center={new LatLng(this.state.coords[0], this.state.coords[1])} zoom={7} scrollWheelZoom={true}
                                  whenCreated={mapInstance => this.mapRef.current = mapInstance}>
                        <LayersControl position="bottomleft">

                            <LayersControl.Overlay name="Satellite">
                                <TileLayer
                                    url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                    maxZoom= {20}
                                    subdomains={['mt1','mt2','mt3']}
                                />
                            </LayersControl.Overlay>

                            {
                                this.canRenderStreetMap() &&
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            }

                        <LocationMarker {...this.props} onChange={this.updateMapCenter}/>
                        {
                            this.state.showUserLocationCircle && <CircleLayer center={this.state.userLocationCoords}/>
                        }
                        <Control position='topright'>
                            <LocateIcon onClick={this.onLocateIconClicked}/>
                        </Control>
                        </LayersControl>
                    </MapContainer>
                </div>
            );
        } else
            return null;
    }
}