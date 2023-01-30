import React from "react";
import L, {LatLng} from 'leaflet';
import {CircleMarker, Marker, Popup} from "react-leaflet";
import inspire_address_api from "../api/inspire_address_api";
import AddressPlace from "./AddressPlace";
import AddressPlaceParser from "../utils/AddressPlaceParser";
import {Button} from "react-bootstrap";

const iconAddressPlace = L.icon({
    iconUrl: require("../img/geo-fill.svg"),
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0,-40]
});

interface Props {
    coords: LatLng,
    onPick: (addressPlace: AddressPlace) => void
}

interface State {
    inputCoords: LatLng | null
    addressPlace: AddressPlace | null
    addressPlaces: AddressPlace[] | null
}

export default class AddressPlaceMarker extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            inputCoords: null,
            addressPlace: null,
            addressPlaces: null
        }
    }

    getFeatureByPoint() {
        if (this.state.inputCoords?.lng !== this.props.coords.lng || this.state.inputCoords?.lat !== this.props.coords.lat) {
            inspire_address_api.getFeatureByPoint(this.props.coords.lat, this.props.coords.lng)
                .then(response => {
                    const addressPlace = AddressPlaceParser.parseINSPIREAddressPlace(response.data);

                    if (this.state.addressPlace == null || addressPlace?.addressCode !== this.state.addressPlace.addressCode) {
                        this.setState({
                            inputCoords: new LatLng(this.props.coords.lat, this.props.coords.lng),
                            addressPlace: addressPlace
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }


    getAddressesByBBOX() {
        if (this.state.inputCoords?.lng !== this.props.coords.lng || this.state.inputCoords?.lat !== this.props.coords.lat) {
            inspire_address_api.getAddressesByBBOX(this.props.coords.lng + 0.001612, this.props.coords.lat + 0.000416, this.props.coords.lng - 0.00168, this.props.coords.lat - 0.000447)
                .then(response => {
                    const addressPlaces1 = AddressPlaceParser.parseAdressesFromBBOXRequest(response.data);

                    this.setState({
                        inputCoords: new LatLng(this.props.coords.lat, this.props.coords.lng),
                        addressPlace: addressPlaces1[0],
                        addressPlaces: addressPlaces1
                    });

                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    componentDidMount() {
        //Try to initially render address place, when user is zoomed in accordingly.
        this.getAddressesByBBOX();
        //this.getFeatureByPoint();
    }

    componentDidUpdate() {
        //Try to request feature by point when component updates - props change => user interacts with map
        if (this.props.coords.lng != this.state.inputCoords?.lng || this.props.coords.lat != this.state.inputCoords?.lat) {
            this.getAddressesByBBOX()
            //this.getFeatureByPoint()
        }
    }

    render() {
        if (!this.state.addressPlaces)
            return null;

        const addressPlacesMarkers = this.state.addressPlaces.map((addressPlace, index) => {
            return (
                <Marker key={index} position={new LatLng(addressPlace.lat, addressPlace.lng)} icon={iconAddressPlace}>
                    <Popup closeOnClick={true} autoClose={true} autoPan={false} keepInView={true}>
                        {addressPlace.addressCode} <br/>
                        {addressPlace.addressTitle != null ? addressPlace.addressTitle : addressPlace.city} {" "} {addressPlace.buildingIdentifier}
                        {addressPlace.addressNumber && "/" + addressPlace.addressNumber}
                        <br/>
                        {addressPlace.lat} <br/>
                        {addressPlace.lng} <br/>
                        {addressPlace.city} <br/>
                        {addressPlace.postalCode} <br/><br/>
                        <Button onClick={() => {
                            this.props.onPick(addressPlace)
                        }}>Fill in the form</Button>
                    </Popup>
                </Marker>
            )
        });

        if (!addressPlacesMarkers)
            return null;

        return addressPlacesMarkers;

        /*if (!this.state.addressPlace)
            return null;

        const element = (
            <Marker position={new LatLng(this.state.addressPlace.lat, this.state.addressPlace.lng)}
                    icon={iconAddressPlace}>
                <Popup closeOnClick={true} autoClose={true} autoPan={false} keepInView={true}>
                    {this.state.addressPlace.addressCode} <br/>
                    {this.state.addressPlace.addressTitle != null ? this.state.addressPlace.addressTitle : this.state.addressPlace.city} {" "} {this.state.addressPlace.buildingIdentifier}
                    {this.state.addressPlace.addressNumber && "/" + this.state.addressPlace.addressNumber}
                    <br/>
                    {this.state.addressPlace.lat} <br/>
                    {this.state.addressPlace.lng} <br/>
                    {this.state.addressPlace.city} <br/>
                    {this.state.addressPlace.postalCode} <br/><br/>
                    <Button onClick={() => {this.props.onPick(this.state.addressPlace)}}>Fill in the form</Button>
                </Popup>
            </Marker>
        );

        console.log(element);

        return element;*/
    }
}