import React from 'react';
import {
    Question,
    FormUtils,
    ConfigurationContext,
    Answer, FormQuestionsContext
} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import classNames from 'classnames';
import Utils from "../Utils";
import MapComponent from "./MapComponent";
import PropTypes from "prop-types";
import LongitudeComponent from "./LongitudeComponent";
import LatitudeComponent from "./LatitudeComponent";

class _GeoComponent extends Question {

    constructor(props) {
        super(props);
        console.log("Geo component init");
    }

    _getAnswerWidthStyle() {
        return super._getAnswerWidthStyle();
    }

    getLongitudeProps(question) {
        return {
            question: question.q,
            index: question.index,
            collapsible: this.props.collapsible,
            formData: this.props.formData,
            onChange: this.props.onChange,
            withoutCard: this.props.withoutCard
        }
    }

    renderAnswers() {
        const question = this.props.question;
        let cls;

        const parent = Utils.findParent(this.props.formData.root, question['@id']);
        if (!parent) {
            return null;
        }

        const longitudeQuestionId = question[Constants.HAS_PRECEDING_QUESTION]['@id'];
        const longitudeQuestion = Utils.findDirectChild(parent, longitudeQuestionId);

        if (!longitudeQuestion) {
            console.error('question with preceding question: cannot find question ' + longitudeQuestionId);
            return null;
        }

        const answers = this._getAnswers();
        cls = classNames(
            'answer',
            Question._getQuestionCategoryClass(question),
            Question.getEmphasizedOnRelevantClass(question)
        );
        return [
            <div>
            <MapComponent/>
                    { Utils.hasPropertyWithValue(this.props.question, Constants.HAS_PRECEDING_QUESTION, this.props.question.id)
                    &&
                        <div className="base-question">
                    <LongitudeComponent {...this.getLongitudeProps(longitudeQuestion)}/>
                        </div>
                    }
                <div className="unit-question">
                    <LatitudeComponent {...this.props}/>
                </div>
            </div>
        ];
    }
}

_GeoComponent.propTypes.formData = PropTypes.object;
_GeoComponent.contextType = ConfigurationContext;

const GeoComponent = (props) => {
    const formQuestionsContext = React.useContext(FormQuestionsContext);
    const formData = formQuestionsContext.getData();

    return (
        <_GeoComponent formData={formData} {...props} />
    );
};

export default GeoComponent;