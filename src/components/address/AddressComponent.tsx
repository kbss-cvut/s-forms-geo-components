import React from 'react';
import {
    Question,
    ConfigurationContext, Constants as SConstants
} from '@kbss-cvut/s-forms';
import AddressPlace from "../../model/AddressPlace";
import Utils from "../../utils/Utils";
import Constants from "../../Constants";
import AddressPlaceParser from "../../utils/AddressPlaceParser";
import QuestionEntity from "../../model/QuestionEntity";

export interface AddressProps {
    question: object,
    addressPlace: AddressPlace
}

export default class AddressComponent extends Question {

    constructor(props: AddressProps) {
        super(props);
        this.state = {
            code: 0,
            addressPlace: this.props.addressPlace
        };
    }

    componentDidUpdate() {
        if (!this.props.addressPlace) {
            const subquestions = this.props.question[SConstants.HAS_SUBQUESTION];

            for (const subquestion of subquestions) {
                if (subquestion[Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET]["@id"] === Constants.ADDRESS_TEXT)
                    continue;
                if (subquestion[SConstants.HAS_ANSWER] && subquestion[SConstants.HAS_ANSWER][0])
                    subquestion[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {"@value": ""};
            }

            //const addressTitleQuestion = Utils.getSubQuestionByPropertyValue(this.props.question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ADDRESS_TEXT);
            /*if (addressTitleQuestion[SConstants.HAS_ANSWER] && addressTitleQuestion[SConstants.HAS_ANSWER][0])
                addressTitleQuestion[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {"@value": ""};*/
            return;
        }

        // Data mapping from component to questions
        if (this.props.addressPlace.addressCode !== this.state.code) {
            try {
                this.setState({
                    code: this.props.addressPlace.addressCode
                });

                const question = this.props.question;

                const addressTextQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ADDRESS_TEXT);
                const addressText = this.props.addressPlace.getAddressText();
                addressTextQuestion[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {"@value": addressText};

                const streetQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.STREET_NAME);
                const streetQ = new QuestionEntity(streetQuestion);
                streetQ.setAnswerValue(this.props.addressPlace.streetName);

                const houseNumberQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.HOUSE_NUMBER);
                const houseNumberQ = new QuestionEntity(houseNumberQuestion);
                houseNumberQ.setAnswerValue(this.props.addressPlace.buildingIdentifier);

                const houseNumberPrefixQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.HOUSE_NUMBER_TYPE);
                const houseNumberPrefixQ= new QuestionEntity(houseNumberPrefixQuestion);
                houseNumberPrefixQ.setAnswerValue(this.props.addressPlace.buildingIdentifierType);

                const postalCodeQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.POSTAL_CODE);
                const postalCodeQ = new QuestionEntity(postalCodeQuestion);
                postalCodeQ.setAnswerValue(this.props.addressPlace.postalCode);

                const addressCodeQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ADDRESS_PLACE_CODE);
                const addressCodeQ = new QuestionEntity(addressCodeQuestion);
                addressCodeQ.setAnswerValue(this.props.addressPlace.addressCode);

                const orientationNumberQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ORIENTATION_NUMBER);
                const orientationNumberQ= new QuestionEntity(orientationNumberQuestion);
                orientationNumberQ.setAnswerValue(this.props.addressPlace.orientationNumber);

                //Getting info about subQuestion of orientation number question
                const orientationNumberExtensionQuestion = Utils.getSubQuestionByPropertyValue(orientationNumberQuestion, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ORIENTATION_NUMBER_EXTENSION);
                const orientationNumberExtensionQ= new QuestionEntity(orientationNumberExtensionQuestion);
                orientationNumberExtensionQ.setAnswerValue(this.props.addressPlace.orientationNumberExtension);

            } catch (e) {
                console.error(e);
                console.error("Cannot set address text when address question is not rendered.")
            }
        }

        return null;
    }
}

AddressComponent.contextType = ConfigurationContext;