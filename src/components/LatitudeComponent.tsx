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

class LatitudeComponent extends Question {

    //static mappingRule = (q: Question) => JsonLdUtils.hasValue(q, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.LONGITUDE);

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
export default LatitudeComponent;
