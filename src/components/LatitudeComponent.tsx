import React from 'react';
import {
    Question,
    FormUtils,
    ConfigurationContext,
    Answer, Constants as SConstants
} from '@kbss-cvut/s-forms';
import classNames from 'classnames';


interface Props {
    question: object
}

export default class LatitudeComponent extends Question {

    constructor(props: Props) {
        super(props);
        console.log("Latitude component init");
    }

    renderAnswers() {
        const question = this.props.question,
            children = [],
            answers = this._getAnswers();
        let cls;

            cls = classNames(
                'answer',
                Question._getQuestionCategoryClass(question),
                Question.getEmphasizedOnRelevantClass(question)
            );
            children.push(
                <div
                    key={'row-item-0'}
                    className={cls}
                    id={question['@id']}
                    onMouseEnter={this._onMouseEnterHandler}
                    onMouseLeave={this._onMouseLeaveHandler}
                >
                  <Answer
                      index={0}
                      answer={answers[0]}
                      question={question}
                      onChange={this.handleAnswerChange}
                      onCommentChange={this.handleCommentChange}
                      showIcon={this.state.showIcon}
                  />
                </div>
            );

        return children;
    }
}

LatitudeComponent.contextType = ConfigurationContext;