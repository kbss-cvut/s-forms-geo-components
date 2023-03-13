import React from "react";
import L, {LatLng} from 'leaflet';
import {CircleMarker, Marker, Popup} from "react-leaflet";
import inspire_address_api from "../../api/inspire_address_api";
import AddressPlace from "../../model/AddressPlace";
import AddressPlaceParser from "../../utils/AddressPlaceParser";
import {Button} from "react-bootstrap";

const iconAddressPlace = L.icon({
    iconUrl: require("../../img/geo-fill.svg"),
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0,-40]
});

const iconPickedAddressPlace = L.icon({
    iconUrl: require("../../img/geo-fill-selected.svg"),
    iconSize: [36, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0,-40]
});


interface Props {
    coords: LatLng,
    onPick: (addressPlace: AddressPlace) => void,
    handleMarkerClick: (addressPlace: AddressPlace) => void,
    pickedAddressPlace: AddressPlace | null
}

interface State {
    inputCoords: LatLng | null
    addressPlace: AddressPlace | null
    addressPlaces: AddressPlace[] | null
}

export default class AddressPlaceMarkersList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            inputCoords: null,
            addressPlace: this.props.pickedAddressPlace,
            addressPlaces: null
        };
        console.log(this.props.pickedAddressPlace?.addressCode);
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
        if (this.props.pickedAddressPlace && this.state.addressPlace?.addressCode !== this.props.pickedAddressPlace.addressCode) {
            this.setState({
                addressPlace: this.props.pickedAddressPlace
            })
        }
        //Try to request feature by point when component updates - props change => user interacts with map
        if (this.props.coords.lng != this.state.inputCoords?.lng || this.props.coords.lat != this.state.inputCoords?.lat) {
            this.getAddressesByBBOX()
            //this.getFeatureByPoint();
        }
    }

    render() {
        if (!this.state.addressPlaces)
            return null;

        const addressPlacesMarkers = this.state.addressPlaces.map((addressPlace, index) => {
            return (
                <Marker key={index} position={new LatLng(addressPlace.lat, addressPlace.lng)} icon={this.state.addressPlace?.addressCode === addressPlace.addressCode ? iconPickedAddressPlace : iconAddressPlace} eventHandlers={{
                        click: () => this.props.handleMarkerClick(addressPlace),
                    }}>
                    {
                        /**
                         * Popup gets added in MapComponent due to better modifiability and control. Might create custom popup component later for needed behaviour.
                         */
                    }
                </Marker>
            )
        });

        return addressPlacesMarkers;
    }
}