import React from 'react';
import {
    Question,
    ConfigurationContext,
    Constants as SConstants
} from '@kbss-cvut/s-forms';

export interface CoordinateProps {
    question: object,
    coordValue: number,
    onInput: (coordinate: string) => void
}

export default class CoordinateComponent extends Question {

    constructor(props: CoordinateProps) {
        super(props);
        this.state = {
            coordValue: this.props.coordValue
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this._updateCoordValue();
    }

    componentDidUpdate() {
        if (this.props.coordValue !== this.state.coordValue) {
            this._updateCoordValue();
            this.setState({
                coordValue: this.props.coordValue
            })
        }
        return null;
    }

    handleAnswerChange = (answerIndex: number, change: any) => {
        if (change[SConstants.HAS_DATA_VALUE]) {
            const inputValue: string = change[SConstants.HAS_DATA_VALUE]["@value"];

            const regExp = new RegExp("^\\d{1,3}\\.\\d+?$");
            if (regExp.test(inputValue)) {
                this.props.onInput(inputValue);
                this._handleChange(SConstants.HAS_ANSWER, answerIndex, change);
            }
        }
    };

    _updateCoordValue() {
        const question = this.props.question;

        question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {
            '@value': this.props.coordValue
        };
    }
}

CoordinateComponent.contextType = ConfigurationContext;