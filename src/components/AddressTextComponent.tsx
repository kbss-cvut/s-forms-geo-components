import React from 'react';
import {
    Question,
    ConfigurationContext,
    Constants as SConstants
} from '@kbss-cvut/s-forms';
import AddressPlace from "./AddressPlace";
import AddressPlaceParser from "../utils/AddressPlaceParser";

export interface AddressTextProps {
    question: object,
    addressPlace: AddressPlace | null
}

export default class AddressTextComponent extends Question {

    constructor(props: AddressTextProps) {
        super(props);
        this.state = {
            addressPlace: this.props.addressPlace,
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this._updateTextValue();
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.props.addressPlace !== this.state.addressPlace) {
            this._updateTextValue();
            this.setState({
                addressPlace: this.props.addressPlace
            });
        }
        return null;
    }

    /*handleAnswerChange = (answerIndex: number, change: any) => {
        if (change[SConstants.HAS_DATA_VALUE]) {
            const inputValue: string = change[SConstants.HAS_DATA_VALUE]["@value"];

            const regExp = new RegExp("^\\d{1,3}\\.?\\d+$");
            if (regExp.test(inputValue)) {
                this.props.onInput(inputValue);
                this._handleChange(SConstants.HAS_ANSWER, answerIndex, change);
            }
        }
    };*/

    _updateTextValue() {
        if (this.props.addressPlace && this.props.addressPlace !== this.state.addressPlace) {
            const question = this.props.question;

            question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {
                '@value': AddressPlaceParser.getAddressText(this.props.addressPlace)
            };
        }
    }
}

AddressTextComponent.contextType = ConfigurationContext;