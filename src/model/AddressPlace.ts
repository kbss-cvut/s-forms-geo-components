import Constants from "../Constants";

export default class AddressPlace {
    //kod adresniho mista
    readonly addressCode: number;
    readonly lat: number;
    readonly lng: number;
    //nazev ulice - optional
    readonly addressTitle: string | null | undefined;
    //cislo popisne
    readonly buildingIdentifier: number;
    //cislo orientacni - optional
    readonly addressNumber: number | null;
    //PSC
    readonly postalCode: number;
    readonly city: string;
    //todo other properties (MOP, MOMC)

    constructor(addressCode: number, lat: number, lng: number, addressTitle: string | null, city: string, buildingIdentifier: number, addressNumber: number | null, postalCode: number) {
        this.addressCode = addressCode;
        this.lat = lat;
        this.lng = lng;
        this.addressTitle = addressTitle;
        this.buildingIdentifier = buildingIdentifier;
        this.addressNumber = addressNumber;
        this.postalCode = postalCode;
        this.city = city.trim();
    }

    toHTMLString() {
        let html = "";
        html += (this.addressCode + "<br/>\n");

        this.addressTitle != null ? html += this.addressTitle : html += this.city;

        html += " " + this.buildingIdentifier;

        this.addressNumber != null ? html += "/" + this.addressNumber : null;

        html += "<br/>\n";
        html += this.lat + " z.š.<br/>\n";
        html += this.lng + " z.d.<br/>\n";
        html += this.city + "<br/>\n";
        html += this.postalCode + "<br/>\n";

        html += "<button id=" + Constants.ADDRESS_PLACE_PICK_BUTTON + " type=\"button\" class=\"btn btn-primary popup-btn\">Fill in the form</button> <br/>";
        html += "<button id=" + Constants.ADDRESS_PLACE_CLOSE_BUTTON + " type=\"button\" class=\"btn btn-secondary popup-btn\">Close</button>";

        return html;
    }
}