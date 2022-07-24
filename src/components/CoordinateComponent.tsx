import React from 'react';
import {
    Question,
    ConfigurationContext,
    Constants as SConstants
} from '@kbss-cvut/s-forms';

interface Props {
    question: object,
    coordValue: number
}

export default class CoordinateComponent extends Question {

    constructor(props: Props) {
        super(props);
        this.state = {
            coordValue: this.props.coordValue
        };
    }

    componentDidMount() {
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
        this._handleChange(SConstants.HAS_ANSWER, answerIndex, change);
        this._updateCoordValue();
    };

    _updateCoordValue() {
        const question = this.props.question;

        question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {
            '@value': this.props.coordValue
        };
    }
}

CoordinateComponent.contextType = ConfigurationContext;