import CompositeQuestion from "./components/CompositeQuestion"
import Constants from "./Constants";
import {Constants as SConstants} from "@kbss-cvut/s-forms";
import WizardStepComponent from "./components/WizardStepComponent";
import QuestionWithUnit from "./components/QuestionWithUnit";
import NullQuestion from "./components/NullQuestion";
import Utils from "./Utils";
import SectionComponent from "./components/SectionComponent";
import NiceComponent from "./components/NiceComponent";
import GeoComponent from "./components/GeoComponent";
import LongitudeComponent from "./components/LongitudeComponent";

export default class GeoComponents {

  static componentCache = {};

  static _cached(q, form, key, mapRule) {

    let cachedQuestion = GeoComponents.componentCache[q['@id']];
    if (cachedQuestion === undefined) {
      cachedQuestion = {};
      GeoComponents.componentCache[q['@id']] = {};
    }

    let cachedValue = cachedQuestion[key];
    if (cachedValue === undefined) {
      cachedValue = mapRule(q, form);
      GeoComponents.componentCache[q['@id']][key] = cachedValue;
    }

    return cachedValue;
  }

  static getComponentMapping() {
    return [
      {
        component: WizardStepComponent,
        mapRule: WizardStepComponent.mappingRule
      },
      {
        component: SectionComponent,
        mapRule: SectionComponent.mappingRule
      },
      {
        component: CompositeQuestion,
        mapRule: CompositeQuestion.mappingRule
      },
      {
        component: NiceComponent,
        mapRule: NiceComponent.mappingRule
      },
      {
        component: GeoComponent,
        mapRule: GeoComponent.mappingRule
      },
      {
        component: LongitudeComponent,
        mapRule: LongitudeComponent.mappingRule
      },
      {
        component: NullQuestion,
        mapRule: (q, form) => GeoComponents._cached(q, form, 'NullQuestion-unit-of-measure', () => {
          const parent = Utils.findParent(form?.root, q['@id']);
          return !!(parent && Utils.isReferencedByProperty(parent[SConstants.HAS_SUBQUESTION], q['@id'], Constants.HAS_UNIT_OF_MEASURE));
        })
      },
      {
        component: NullQuestion,
        mapRule: (q, form) => GeoComponents._cached(q, form, 'NullQuestion-type-question', () => {
          const parent = Utils.findParent(form?.root, q['@id']);
          return Utils.hasPropertyWithValue(parent, Constants.HAS_TYPE_QUESTION, q['@id']);
        })
      },
      {
        component: NullQuestion,
        mapRule: q => {
          return !!q[Constants.SHOW_ADVANCED_QUESTION]
        }
      },
      {
        component: QuestionWithUnit,
        mapRule: q => {
          return !!q[Constants.HAS_UNIT_OF_MEASURE]
        }
      }
    ];
  }

}
