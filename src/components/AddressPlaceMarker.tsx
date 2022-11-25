import React from "react";
import L, {LatLng} from 'leaflet';
import {Marker, Popup} from "react-leaflet";
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
}

export default class AddressPlaceMarker extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            inputCoords: null,
            addressPlace: null
        }
    }

    getFeatureByPoint() {
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

    componentDidMount() {
        //Try to initially render address place, when user is zoomed in accordingly.
        this.getFeatureByPoint();
    }

    componentDidUpdate() {
        //Try to request feature by point when component updates - props change => user interacts with map
        if (this.props.coords.lng != this.state.inputCoords?.lng || this.props.coords.lat != this.state.inputCoords?.lat) {
            this.getFeatureByPoint()
        }
    }

    render() {
        return this.state.addressPlace && (
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
        )
    }
}