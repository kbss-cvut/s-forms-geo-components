import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import {
    Question,
    FormUtils,
    ConfigurationContext,
    Answer, Constants as SConstants
} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import classNames from 'classnames';


interface Props {
    question: object
}

class LongitudeComponent extends Question {

    static mappingRule = (q: Question) => JsonLdUtils.hasValue(q, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.LONGITUDE);

    constructor(props: Props) {
        super(props);
        console.log("Longitude component init");
    }

    _renderAnswer(index: number, answer: object) {
        const question = this.props.question;

        let component: Answer = Answer;

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

    onSubQuestionChange = (subQuestionIndex: number, change: any) => {
        this._handleChange(SConstants.HAS_SUBQUESTION, subQuestionIndex, change);
    };

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
}

LongitudeComponent.contextType = ConfigurationContext;
export default LongitudeComponent;
