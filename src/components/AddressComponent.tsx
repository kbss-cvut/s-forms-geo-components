import React from 'react';
import {
    Question,
    ConfigurationContext, Constants as SConstants
} from '@kbss-cvut/s-forms';
import AddressPlace from "./AddressPlace";
import Utils from "../utils/Utils";
import Constants from "../Constants";
import AddressPlaceParser from "../utils/AddressPlaceParser";

export interface AddressProps {
    question: object,
    addressPlace: AddressPlace
}

export default class AddressComponent extends Question {

    constructor(props: AddressProps) {
        super(props);
        this.state = {
            code: 0
        };
    }

    componentDidUpdate() {
        if (!this.props.addressPlace)
            return;

        if (this.props.addressPlace.addressCode !== this.state.code) {
            const question = this.props.question;
            const addressTitleQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ADDRESS_TEXT);
            const addressText = AddressPlaceParser.getAddressText(this.props.addressPlace);

            try {
                addressTitleQuestion[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {"@value": addressText};
                this.setState({
                    code: this.props.addressPlace.addressCode
                });
            } catch (e) {
                console.error("Cannot set address text when address question is not rendered.")
            }
        }

        return null;
    }
}

AddressComponent.contextType = ConfigurationContext;