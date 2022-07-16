import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import {
    Question,
    FormUtils,
    Constants as SFormsConstants,
    ConfigurationContext,
    Answer
} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import classNames from 'classnames';


export default class NiceComponent extends Question {
    
    static mappingRule = q => JsonLdUtils.hasValue(q, SFormsConstants.LAYOUT_CLASS, Constants.LAYOUT_TYPE);

    constructor(props) {
        super(props);
        console.log("Nice component init");
    }

    _renderAnswer(index, answer) {
        const question = this.props.question;

        let component = Answer;

        return React.createElement(component, {
            index: index,
            answer: answer,
            question: question,
            onChange: this.handleAnswerChange,
            onCommentChange: this.handleCommentChange,
            showIcon: this.state.showIcon,
            onSubChange: this.onSubQuestionChange,
            isInSectionHeader: true
        });
    }

    _getAnswerWidthStyle() {
        return super._getAnswerWidthStyle();
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
                'nice-layout',
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
                >
                    <div className="answer-content" style={this._getAnswerWidthStyle()}>
                        {this._renderAnswer(i, answers[i])}
                    </div>
                </div>
            );
        }
        return children;
    }

    renderSubQuestions() {
        return null;
    }

    _getSubQuestions() {
        const sub = super._getSubQuestions();

        return sub;
    }

}

NiceComponent.contextType = ConfigurationContext;