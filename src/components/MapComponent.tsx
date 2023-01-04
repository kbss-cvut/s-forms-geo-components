import React, {useState} from "react";
import {Circle, LayersControl, MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from 'react-leaflet';
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
import AddressPlaceMarker from "./AddressPlaceMarker";
import AddressPlace from "./AddressPlace";
import {Button} from "react-bootstrap";
import inspire_address_api from "../api/inspire_address_api";
import AddressPlaceParser from "../utils/AddressPlaceParser";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [32, 44],
    iconAnchor: [16, 44]
});

L.Marker.prototype.options.icon = DefaultIcon;

const position = Constants.DEFAULT_COORDINATES;

interface Props {
    onAddressPlacePicked: (addressPlace: AddressPlace) => void,
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
            <Popup>
                <Button onClick={() => {this.props.onPick(this.state.addressPlace)}}>Fill in the form</Button>
            </Popup>
        </Marker>
    )
}


interface MapState {
    coords: number[],
    showUserLocationCircle: boolean,
    showLocationMarker: boolean,
    isAddressPlacePicked: boolean,
    pickedAddressPlaceCoords: number[] | null,
    userLocation: GeolocationPosition | null,
    canRenderClosestAddressPlace: boolean
}

export default class MapComponent extends React.Component<Props, MapState> {
    private readonly mapRef: React.MutableRefObject<LeafletMap | null>;

    constructor(props: Props) {
        super(props);
        this.state = {
            coords: position,
            showLocationMarker: true,
            showUserLocationCircle: false,
            isAddressPlacePicked: false,
            pickedAddressPlaceCoords: null,
            userLocation: null,
            canRenderClosestAddressPlace: false
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
            this.setState({ showUserLocationCircle: true, userLocation: geolocation});
            if (this.mapRef != null && this.mapRef.current != null) {
                let zoomValue;
                geolocation.coords.accuracy <= 1000 ? zoomValue = 17 : zoomValue = 15;
                this.mapRef.current.setView(new LatLng(geolocation.coords.latitude, geolocation.coords.longitude), zoomValue);
            }
        }, error => console.warn(error.message));
    }

    relocateBasedOnUserInput = (latitude: string, longitude: string) => {
        this.updateMapCenter(parseFloat(latitude), parseFloat(longitude));
    }

    onAddressPlacePicked = (latitude: string, longitude: string) => {
        this.updateMapCenter(parseFloat(latitude), parseFloat(longitude));
        this.setState({
            isAddressPlacePicked: true,
            pickedAddressPlaceCoords: [parseFloat(latitude), parseFloat(longitude)]
        });
    }

    onMapClick = (latitude: number, longitude: number) => {
        this.updateMapCenter(latitude, longitude);
        if (this.state.isAddressPlacePicked) {
            this.setState({isAddressPlacePicked: false});
        }
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

    handleMapInteractionEnd = () => {
        if (!this.mapRef.current)
            return;

        const zoom = this.mapRef.current.getZoom();
        if (zoom && zoom >= 19) {
            this.setState({
                canRenderClosestAddressPlace: true
            });
        } else {
            this.setState({
                canRenderClosestAddressPlace: false
            })
        }
    }

    render() {
        if (this.state.coords) {
            return (
                <div>
                    <MapContainer id={"map"} center={new LatLng(this.state.coords[0], this.state.coords[1])} zoom={7} scrollWheelZoom={true}
                                  whenCreated={mapInstance => {
                                      this.mapRef.current = mapInstance;
                                      this.mapRef.current.addEventListener("zoomend", this.handleMapInteractionEnd);
                                      this.mapRef.current.addEventListener("moveend", this.handleMapInteractionEnd);
                                  }} >
                        <LayersControl position="bottomleft">

                            <LayersControl.Overlay name="Satellite">
                                <TileLayer
                                    url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                    subdomains={['mt1','mt2','mt3']}
                                    maxNativeZoom={19}
                                    maxZoom={21}
                                />
                            </LayersControl.Overlay>

                            {
                                this.canRenderStreetMap() &&
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    maxNativeZoom={19}
                                    maxZoom={21}
                                />
                            }

                            {
                                //Try to render address place near the center of the map only when zoomed 19 and more
                                this.state.canRenderClosestAddressPlace && this.mapRef.current &&
                                <AddressPlaceMarker coords={this.mapRef.current.getCenter()} onPick={this.props.onAddressPlacePicked}/>

                            }

                            {
                                this.state.isAddressPlacePicked &&
                                <CircleLayer coords={this.state.pickedAddressPlaceCoords} radius={10} color={"green"} tooltipText={"Chosen address place"}/>

                            }

                            {
                                this.state.showLocationMarker &&
                                <LocationMarker {...this.props} onChange={this.updateMapCenter}/>
                            }

                            {
                                this.state.showUserLocationCircle && this.state.userLocation && <CircleLayer coords={[this.state.userLocation.coords.latitude, this.state.userLocation.coords.longitude]} radius={this.state.userLocation.coords.accuracy} color={"blue"}/>
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