import React from 'react';
import {
    Question,
    ConfigurationContext,
    Constants as SConstants, FormUtils, Answer
} from '@kbss-cvut/s-forms';
import AddressPlace from "../../model/AddressPlace";
import spring_backend_api from "../../api/spring_backend_api";
import classNames from "classnames";
import Utils from "../../utils/Utils";

export interface AddressTextProps {
    question: object,
    addressPlace: AddressPlace | null
}

export default class AddressTextComponent extends Question {

    constructor(props: AddressTextProps) {
        super(props);
        this.state = {
            addressPlace: null,
            suggestions: [],
            isFocused: false
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this._updateTextValue();
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this._updateTextValue();
        return null;
    }

    handleAnswerChange = (answerIndex: number, change: any) => {
        if (change[SConstants.HAS_DATA_VALUE]) {
            const inputValue: string = change[SConstants.HAS_DATA_VALUE]["@value"];

            if (inputValue.length <= 3) {
                this.setState({
                    suggestions: null
                })
                this._handleChange(SConstants.HAS_ANSWER, answerIndex, change);
                return;
            }

            this._handleChange(SConstants.HAS_ANSWER, answerIndex, change);

            spring_backend_api.getSuggestions(inputValue)
                .then(response => {
                    const addressPlaces = response.data;

                    this.setState({
                        suggestions: addressPlaces
                    })

                })
                .catch(error => {
                    console.error(error);
                    this.setState({
                        suggestions: Utils.getAddressPlacesTestingSample()
                    })
                })
        }
    }

    _updateTextValue() {
        if (this.state.addressPlace && !this.props.addressPlace) {
            this.setState({
                addressPlace: null
            });
            return;
        }

        if (this.props.addressPlace && this.state.addressPlace?.addressCode !== this.props.addressPlace.addressCode) {
            this.setState({
                addressPlace: this.props.addressPlace
            });
            this.props.question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = { '@value': this.props.addressPlace.getAddressText()};
        }
    }

    _renderAnswer(index, answer) {
        let component = Answer;
        return React.createElement(component, {
            index: index,
            answer: answer,
            question: this.props.question,
            onChange: this.handleAnswerChange,
            onCommentChange: this.handleCommentChange,
            showIcon: this.state.showIcon,
            isInSectionHeader: true
        });
    }

    _renderSuggestions() {
        if (!this.state.suggestions || this.state.suggestions.length === 0 || !this.state.isFocused)
            return null;

        let children = [];

        for (const suggestion of this.state.suggestions) {
            children.push(

                <div key={suggestion.admCode} className={"suggestion"} onMouseDown={(e) =>  {
                    this.props.onAddressPlaceSuggestionClick(suggestion.admCode);
                    this.setState({
                        isFocused: false
                    });
                }}>
                    {suggestion.addressText}
                </div>
            )
        }

        return (
            <div className={"autocomplete"}>
                {children}
            </div>
        );
    }

    renderAnswers() {
        const question = this.props.question,
            children = [],
            answers = this._getAnswers();
        let cls;
        let isTextarea;

        for (let i = 0, len = answers.length; i < len; i++) {
            isTextarea =
                FormUtils.isTextarea(question, FormUtils.resolveValue(answers[i])) ||
                FormUtils.isSparqlInput(question) ||
                FormUtils.isTurtleInput(question);
            cls = classNames(
                'answer',
                Question._getQuestionCategoryClass(question),
                Question.getEmphasizedOnRelevantClass(question)
            );
            children.push(
                <div
                    key={'row-item-' + i}
                    className={cls}
                    id={question['@id']}
                    onMouseEnter={this._onMouseEnterHandler}
                    onMouseLeave={this._onMouseLeaveHandler}
                    onFocus={() => this.setState({isFocused: true})}
                    onBlur={() => this.setState({isFocused: false})}
                >
                    <div className="answer-content" style={this._getAnswerWidthStyle()}>
                        {this._renderAnswer(i, answers[i])}
                    </div>
                        {this._renderSuggestions()}
                </div>
            );
        }
        return children;
    }
}

AddressTextComponent.contextType = ConfigurationContext;