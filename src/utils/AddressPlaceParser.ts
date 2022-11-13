import AddressPlace from "../components/AddressPlace";

export default class AddressPlaceParser {
    /**
     * Function to parse GML response sent from INSPIRE AD endpoint.
     * @param gml response data
     */
    static parseINSPIREAddressPlace(gml: string) : AddressPlace | null {
        const parser = new DOMParser();
        let text = parser.parseFromString(gml,"text/xml");

        const featureCollection = text.getElementsByTagName("FeatureCollection")[0];
        if (featureCollection && featureCollection.getAttribute("numberReturned") === "0") {
            console.warn("No address place found!");
            return null;
        }

        const coordsString = text.getElementsByTagName("gml:pos")[0].textContent;
        if (!coordsString)
            throw new Error("Coordinates could not be parsed from INSPIRE AD GML response.")
        let coords: string[] = coordsString.split(" ");

        const addressComponentsArray = [...text.getElementsByTagName("ad:component")];
        const addressTitleComponent = addressComponentsArray.find(component => {
            if (component.getAttribute("xlink:href")?.includes("Id=TF."))
                return component;
        });
        if (!addressTitleComponent)
            console.warn("Address title could not be parsed from INSPIRE AD GML response.")

        let addressCode = text.getElementsByTagName("base:localId")[0].textContent;
        if (!addressCode)
            throw new Error("Address code could not be parsed from INSPIRE AD GML response.")
        addressCode = addressCode.substring(3);

        const cityComponent = addressComponentsArray.find(component => {
            if (component.getAttribute("xlink:href")?.includes("Id=AU.4."))
                return component;
        });
        if (!cityComponent)
            throw new Error("City could not be parsed from INSPIRE AD GML response.");


        const postalCodeComponent = addressComponentsArray.find(component => {
            if (component.getAttribute("xlink:href")?.includes("Id=PD."))
                return component;
        });
        if (!postalCodeComponent)
            throw new Error("Postal code could not be parsed from INSPIRE AD GML response.");


        const locatorDesignatorArray = [...text.getElementsByTagName("ad:LocatorDesignator")];
        const buildingIdentifierComponent = locatorDesignatorArray.find(component => {
            const typeComponent = component.getElementsByTagName("ad:type")[0];
            if (typeComponent && typeComponent.getAttribute("xlink:title") === "buildingIdentifier") {
                return component.getElementsByTagName("ad:designator")[0];
            }
        });
        if (!buildingIdentifierComponent)
            throw new Error("Building identifier could not be parsed from INSPIRE AD GML response.");

        const addressNumberComponent = locatorDesignatorArray.find(component => {
            const typeComponent = component.getElementsByTagName("ad:type")[0];
            if (typeComponent && typeComponent.getAttribute("xlink:title") === "addressNumber") {
                return component.getElementsByTagName("ad:designator")[0];
            }
        });
        if (!addressNumberComponent)
            console.warn("Address number could not be parsed from INSPIRE AD GML response.");

        return new AddressPlace(parseInt(addressCode), parseFloat(coords[0]), parseFloat(coords[1]), addressTitleComponent?.getAttribute("xlink:title"),
            cityComponent.getAttribute("xlink:title"), buildingIdentifierComponent.textContent, addressNumberComponent?.textContent, postalCodeComponent.getAttribute("xlink:title"));
    }
}