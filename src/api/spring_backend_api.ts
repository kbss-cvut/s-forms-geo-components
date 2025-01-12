import axios from "axios";

const spring_backend_api = axios.create({
    timeout: 1500
});

export default {
    getSuggestions: (searchString: string) => {
        return spring_backend_api.get("https://kbss.felk.cvut.cz/ruian-search" + "/api/suggestions/suggest?searchString=" + searchString);
    },

    getAddressPlaceByCode: (addressCode: number) => {
        return spring_backend_api.get("https://kbss.felk.cvut.cz/ruian-search" + "/api/addresses/" + addressCode);
    }
}