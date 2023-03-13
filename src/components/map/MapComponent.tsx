import React from "react";
import { LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng, Map as LeafletMap } from "leaflet";
// @ts-ignore
import icon from "leaflet/dist/images/marker-icon.png";
// @ts-ignore
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Constants from "../../Constants.js";
import Control from "react-leaflet-custom-control";
import LocateIcon from "./LocateIcon";
import CircleLayer from "./CircleLayer";
import AddressPlaceMarkersList from "../address/AddressPlaceMarkersList";
import AddressPlace from "../../model/AddressPlace";
import { Button } from "react-bootstrap";
import SelectedAddressPlaceMarker from "../address/SelectedAddressPlaceMarker";
import GeneralLocationMarker from "./GeneralLocationMarker";

const defaultPosition = Constants.DEFAULT_COORDINATES;

interface Props {
    onAddressPlacePicked: (addressPlace: AddressPlace) => void,
    onMarkerLocationPicked: (latitude: number, longitude: number) => void,
    onAddressPlaceReset: () => void
}

interface MapState {
    coords: number[],
    showUserLocationCircle: boolean,
    showLocationMarker: boolean,
    pickedAddressPlace: AddressPlace | null,
    userLocation: GeolocationPosition | null,
    canRenderClosestAddressPlace: boolean
}

export default class MapComponent extends React.Component<Props, MapState> {
    private readonly mapRef: React.MutableRefObject<LeafletMap | null>;

    constructor(props: Props) {
        super(props);
        this.state = {
            coords: defaultPosition,
            showLocationMarker: true,
            showUserLocationCircle: false,
            pickedAddressPlace: null,
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

            let zoomValue;
            geolocation.coords.accuracy <= 1000 ? zoomValue = 17 : zoomValue = 15;

            this.mapRef.current?.setView(new LatLng(geolocation.coords.latitude, geolocation.coords.longitude), zoomValue);
        }, error => console.warn(error.message));
    }

    relocateBasedOnUserInput = (latitude: string, longitude: string) => {
        this.updateMapCenter(parseFloat(latitude), parseFloat(longitude));
    }

    onAddressPlacePicked = (addressPlace: AddressPlace) => {
        this.updateMapCenter(addressPlace.lat, addressPlace.lng);
        this.setState({
            pickedAddressPlace: addressPlace
        });
        this.mapRef.current?.closePopup();
    }

    onAddressPlaceReset() {
        this.props.onAddressPlaceReset();
        if (this.state.pickedAddressPlace)
            this.setState({
                pickedAddressPlace: null
            });
        this.updateMapCenter(defaultPosition[0], defaultPosition[1], 7);
    }

    updateMapCenter = (latitude: number, longitude: number, zoom: number = this.mapRef.current?.getZoom()) => {
        this.setState({
            coords: [latitude, longitude]
        });
        this.mapRef.current?.setView(new LatLng(latitude, longitude), zoom);
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
            this.mapRef.current?.closePopup();
        }
    }

    flyToPoint = (addressPlace: AddressPlace) => {
        this.mapRef.current?.setView(new LatLng(addressPlace.lat, addressPlace.lng), 18);
    }


    /**
     * Manual creation of Leaflet popup by DOM manipulation, because when Popup component was used to show address place info, it was not smooth. Might create custom popup for this specific situation.
     * @param addressPlace
     */
    handleAddressPlaceMarkerClick = (addressPlace: AddressPlace) => {
        /*this.mapRef.current?.flyTo(new LatLng(addressPlace.lat, addressPlace.lng), this.mapRef.current?.getZoom(), {
            animate: true,
            duration: 0.375
        });*/
        document.querySelector(".leaflet-popup")?.remove();
        this.mapRef.current?.openPopup(addressPlace.toHTMLString(), new LatLng(addressPlace.lat+0.000065, addressPlace.lng), {closeButton:false});
        document.getElementById(Constants.ADDRESS_PLACE_PICK_BUTTON)?.addEventListener('click', () => this.props.onAddressPlacePicked(addressPlace));
        document.getElementById(Constants.ADDRESS_PLACE_CLOSE_BUTTON)?.addEventListener('click', () => document.querySelector(".leaflet-popup")?.remove());
    }

    onMarkerLocationPicked = () => {
        this.mapRef.current?.closePopup();
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
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    maxNativeZoom={19}
                                    maxZoom={21}
                                />

                            {
                                //Try to render address place near the center of the map only when zoomed 19 and more
                                this.state.canRenderClosestAddressPlace && this.mapRef.current &&
                                <AddressPlaceMarkersList coords={this.mapRef.current.getCenter()} onPick={this.props.onAddressPlacePicked} handleMarkerClick={this.handleAddressPlaceMarkerClick} pickedAddressPlace={this.state.pickedAddressPlace}/>

                            }

                            {
                                this.state.pickedAddressPlace && !this.state.canRenderClosestAddressPlace &&
                                <SelectedAddressPlaceMarker addressPlace={this.state.pickedAddressPlace} recenterMap={this.flyToPoint}/>
                            }

                            {
                                this.state.showLocationMarker &&
                                <GeneralLocationMarker {...this.props}/>
                            }

                            {
                                this.state.showUserLocationCircle && this.state.userLocation && <CircleLayer coords={[this.state.userLocation.coords.latitude, this.state.userLocation.coords.longitude]} radius={this.state.userLocation.coords.accuracy} color={"blue"}/>
                            }
                            <Control position='topright'>
                                <LocateIcon onClick={this.onLocateIconClicked}/>
                            </Control>

                            <Control position='bottomleft'>
                                <Button size='sm' className={'btn-custom'} onClick={() => this.onAddressPlaceReset()}>Clear form</Button>
                            </Control>
                    </MapContainer>
                </div>
            );
        } else
            return null;
    }
}