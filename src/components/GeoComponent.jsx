import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import {
    Question,
    FormUtils,
    ConfigurationContext,
    Answer, FormQuestionsContext
} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import classNames from 'classnames';
import Utils from "../Utils";
import PopupExample from "./MapComponent";
import PropTypes from "prop-types";
import LongitudeComponent from "./LongitudeComponent";
import LatitudeComponent from "./LatitudeComponent";

class _GeoComponent extends Question {

    static mappingRule = q => JsonLdUtils.hasValue(q, Constants.HAS_MAIN_PROCESSING_ASPECT_TARGET, Constants.LATITUDE);

    constructor(props) {
        super(props);
        console.log("Geo component init");
    }

    _getAnswerWidthStyle() {
        return super._getAnswerWidthStyle();
    }

    renderAnswers() {
        const question = this.props.question;
        let cls;

        //const parent = Utils.findParent(this.props, question["@id"]);
        console.log(this.props.formData);
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

        console.log(longitudeQuestion);

        const answers = this._getAnswers();
        cls = classNames(
            'answer',
            Question._getQuestionCategoryClass(question),
            Question.getEmphasizedOnRelevantClass(question)
        );
        return [
            <div>
            <PopupExample/>
                    { Utils.hasPropertyWithValue(this.props.question, Constants.HAS_PRECEDING_QUESTION, this.props.question.id)
                    &&
                        <div className="base-question">
                    <LongitudeComponent question={longitudeQuestion.q} index={longitudeQuestion.index}/>
                        </div>
                    }
                <div className="unit-question">
                    <LatitudeComponent {...this.props}/>
                </div>
            </div>
        ];
        //return children;
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
