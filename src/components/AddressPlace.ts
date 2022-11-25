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
}