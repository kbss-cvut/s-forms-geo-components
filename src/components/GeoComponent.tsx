import React from 'react';
import {ConfigurationContext, FormQuestionsContext, Question} from '@kbss-cvut/s-forms';
import Constants from '../Constants';
import classNames from 'classnames';
import Utils from "../utils/Utils";
import MapComponent from "./MapComponent";
import PropTypes from "prop-types";
import CoordinateComponent from "./CoordinateComponent";
import AddressPlace from "./AddressPlace";

interface Props {
    index: number,
    onChange: object,
    question: object,
    collapsible: boolean,
    withoutCard: boolean
}

class _GeoComponent extends Question {
    private mapComponentRef = React.createRef<MapComponent>();

    constructor(props: Props) {
        super(props);
        this.state = {
            latitude: Constants.DEFAULT_COORDINATES[0],
            longitude: Constants.DEFAULT_COORDINATES[1],
        };
        console.log("Geo component init");
    }

    getLongitudeProps(question: any) {
        return {
            question: question.q,
            index: question.index,
            collapsible: this.props.collapsible,
            formData: this.props.formData,
            onChange: this.props.onChange,
            withoutCard: this.props.withoutCard
        }
    }

    onMarkerLocationChange = (latitude: number, longitude: number) => {
        this.setState({
            latitude: latitude,
            longitude: longitude
        });
    }

    onUserLongitudeInput = (longitudeInput: string) => {
        this.setState({
            longitude: longitudeInput
        });
        this.mapComponentRef.current?.relocateBasedOnUserInput(this.state.latitude, longitudeInput);
    }

    onUserLatitudeInput = (latitudeInput: string) => {
        this.setState({
            latitude: latitudeInput
        });
        this.mapComponentRef.current?.relocateBasedOnUserInput(latitudeInput, this.state.longitude);

    }

    onAddressPlacePicked = (addressPlace : AddressPlace) => {
        this.setState({
            latitude: addressPlace.lat,
            longitude: addressPlace.lng
        });
        this.mapComponentRef.current?.relocateBasedOnUserInput(String(addressPlace.lat), String(addressPlace.lng));
    }


    render(): Element | any {
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
                <MapComponent onMarkerLocationChange={this.onMarkerLocationChange} onAddressPlacePicked={this.onAddressPlacePicked} ref={this.mapComponentRef}/>

                <div className={'coordinate'}>
                    <CoordinateComponent
                        coordValue={this.state.longitude} onInput={this.onUserLongitudeInput} {...this.getLongitudeProps(longitudeQuestion)}/>
                </div>

                <div className={'coordinate'}>
                    <CoordinateComponent coordValue={this.state.latitude} onInput={this.onUserLatitudeInput} {...this.props}/>
                </div>
            </div>
        ];
    }
}

_GeoComponent.propTypes.formData = PropTypes.object;
_GeoComponent.contextType = ConfigurationContext;

const GeoComponent = (props: Props) => {
    const formQuestionsContext = React.useContext(FormQuestionsContext);
    const formData = formQuestionsContext.getData();

    return (
        <_GeoComponent formData={formData} {...props} />
    );
};

export default GeoComponent;