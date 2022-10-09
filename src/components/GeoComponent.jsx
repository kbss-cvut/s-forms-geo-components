import React from 'react';
import {ConfigurationContext, FormQuestionsContext, Question} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import classNames from 'classnames';
import Utils from "../Utils";
import MapComponent from "./MapComponent";
import PropTypes from "prop-types";
import CoordinateComponent from "./CoordinateComponent";

class _GeoComponent extends Question {

    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0
        };
        console.log("Geo component init");
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

    onMarkerLocationChange = (latitude, longitude) => {
        this.setState({
            latitude: latitude,
            longitude: longitude
        });
    }

    render() {
        const question = this.props.question;

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

        const cls = classNames(
            'answer',
            Question._getQuestionCategoryClass(question),
            Question.getEmphasizedOnRelevantClass(question)
        );

        return [
            <div>
                <MapComponent onMarkerLocationChange={this.onMarkerLocationChange}/>
                {Utils.hasPropertyWithValue(this.props.question, Constants.HAS_PRECEDING_QUESTION, this.props.question.id)
                    &&
                    <div>
                        <div className={'coordinate'}>

                            <CoordinateComponent
                                coordValue={this.state.longitude} {...this.getLongitudeProps(longitudeQuestion)}/>
                        </div>

                        <div className={'coordinate'}>
                            <CoordinateComponent coordValue={this.state.latitude} {...this.props}/>
                        </div>
                    </div>
                }
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