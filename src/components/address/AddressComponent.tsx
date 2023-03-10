import React from 'react';
import {
    Question,
    ConfigurationContext, Constants as SConstants
} from '@kbss-cvut/s-forms';
import AddressPlace from "../../model/AddressPlace";
import Utils from "../../utils/Utils";
import Constants from "../../Constants";
import AddressPlaceParser from "../../utils/AddressPlaceParser";

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

        if (this.props.addressPlace.addressCode !== this.state.code) {
            try {
                const question = this.props.question;
                const addressTitleQuestion = Utils.getSubQuestionByPropertyValue(question, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.ADDRESS_TEXT);
                const addressText = AddressPlaceParser.getAddressText(this.props.addressPlace);
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