import React from 'react';
import {ConfigurationContext, FormQuestionsContext, Question, Constants as SConstants} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import Utils from "../utils/Utils";
import MapComponent from "./MapComponent";
import PropTypes from "prop-types";
import CoordinateComponent from "./CoordinateComponent";
import AddressPlace from "./AddressPlace";
import AddressComponent from "./AddressComponent";
import AddressTextComponent from "./AddressTextComponent";

interface Props {
    index: number,
    onChange: object,
    question: object,
    collapsible: boolean,
    withoutCard: boolean
}

class _GeoComponent extends Question {
    private mapComponentRef = React.createRef<MapComponent>();
    private locationQuestionsCache = Utils.getAllQuestionsWithPropertyWithValue(this.props.formData.root, Constants.IS_PART_OF_LOCATION, this.props.question[Constants.IS_PART_OF_LOCATION]);

    constructor(props: Props) {
        super(props);

        console.log(this.props.question);

        this.state = {
            latitude: Constants.DEFAULT_COORDINATES[0],
            longitude: Constants.DEFAULT_COORDINATES[1]
        };

        console.log("Geo component init");
    }

    findRelatedQuestionByPropertyValue(root: Question, property: string, id: string): Question | null {
        if (!root[Constants.HAS_RELATED_QUESTIONS])
            return null;
        for (const question of root[Constants.HAS_RELATED_QUESTIONS]) {
            if (question[property] && question[property]['@id'] && question[property]['@id'] === id) {
                return question;
            }
            const result = this.findRelatedQuestionByPropertyValue(question, property, id);
            if (result)
                return result;
        }

        return null;
    }

    getCoordinateProps(coordinateQuestion: any) {
        return {
            question: coordinateQuestion,
            //index: question.index,
            collapsible: this.props.collapsible,
            formData: this.props.formData,
            onChange: this.props.onChange,
            withoutCard: this.props.withoutCard
        }
    }

    getAddressQuestionProps(addressQuestion: any) {
        return {
            question: addressQuestion,
            //index: addressQuestion.index,
            collapsible: this.props.collapsible,
            formData: this.props.formData,
            onChange: this.props.onChange,
            withoutCard: this.props.withoutCard,
            addressPlace: this.state.addressPlace
        }
    }

    getAddressTextQuestionProps(addressTextQuestion: any) {
        return {
            question: addressTextQuestion,
            //index: addressQuestion.index,
            collapsible: this.props.collapsible,
            formData: this.props.formData,
            onChange: this.props.onChange,
            withoutCard: this.props.withoutCard,
            addressPlace: this.state.addressPlace
        }
    }

    onMarkerLocationPicked = (latitude: number, longitude: number) => {
        this.setState({
            latitude: latitude,
            longitude: longitude,
            addressPlace: null,
        });
    }

    onUserLongitudeInput = (longitudeInput: string) => {
        this.setState({
            longitude: longitudeInput
        });
        this.mapComponentRef.current?.relocateBasedOnUserInput(this.state.latitude, longitudeInput);
    }

    onUserLatitudeInput = (latitudeInput: string) => {
        this.setState({
            latitude: latitudeInput
        });
        this.mapComponentRef.current?.relocateBasedOnUserInput(latitudeInput, this.state.longitude);

    }

    onAddressPlacePicked = (addressPlace : AddressPlace) => {
        this.setState({
            latitude: addressPlace.lat,
            longitude: addressPlace.lng,
            addressPlace: addressPlace
        });
        this.mapComponentRef.current?.onAddressPlacePicked(addressPlace.lat, addressPlace.lng);
    }

    isAddressComponentQuestion = () => {
        return this.props.question[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] == Constants.ADDRESS_IRI;
    }
    locationContainsAddress = () => {
        return this.locationQuestionsCache.find(q => q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.ADDRESS_IRI);
    }

    locationContainsCoordinates = () => {
        return this.locationQuestionsCache.find(q => q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.LONGITUDE_IRI || q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.LATITUDE_IRI);
    }


    render(): Element | any {

        return [
            <div>
                {
                    this.isAddressComponentQuestion() &&
                    <AddressComponent {...this.getAddressQuestionProps(this.props.question)} />
                }

                <MapComponent onMarkerLocationPicked={this.onMarkerLocationPicked} onAddressPlacePicked={this.onAddressPlacePicked} ref={this.mapComponentRef}/>

                {
                    this.isAddressComponentQuestion() && this.locationContainsCoordinates() &&
                    <>
                    <div className={'coordinate'}>
                        <CoordinateComponent
                            coordValue={this.state.longitude}
                            onInput={this.onUserLongitudeInput} {...this.getCoordinateProps(this.locationQuestionsCache.find(q => q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.LONGITUDE_IRI))}/>
                    </div>
                    <div className={'coordinate'}>
                        <CoordinateComponent coordValue={this.state.latitude}
                                             onInput={this.onUserLatitudeInput} {...this.getCoordinateProps(this.locationQuestionsCache.find(q => q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.LATITUDE_IRI))}/>
                    </div>
                        {this.isAddressComponentQuestion() &&
                            <div className={'address-text'}>
                                <AddressTextComponent {...this.getAddressTextQuestionProps(this.props.question[SConstants.HAS_SUBQUESTION].find(q => q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.ADDRESS_TEXT))}/>
                            </div>
                        }
                    </>
                }
                {
                    !this.isAddressComponentQuestion() && this.locationContainsAddress() &&
                    <AddressComponent {...this.getAddressQuestionProps(this.locationQuestionsCache.find(q => q[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]['@id'] === Constants.ADDRESS_IRI))} />
                }
            </div>
        ];
    }
}

_GeoComponent.propTypes.formData = PropTypes.object;
_GeoComponent.contextType = ConfigurationContext;

const GeoComponent = (props: Props) => {
    const formQuestionsContext = React.useContext(FormQuestionsContext);
    const formData = formQuestionsContext.getData();

    return (
        <_GeoComponent formData={formData} {...props} />
    );
};

export default GeoComponent;