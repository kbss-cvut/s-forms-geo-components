import axios from "axios";

const spring_backend_api = axios.create({
    timeout: 1000
});

export default {
    getSuggestions: (searchString: string) => {
        return spring_backend_api.get("http://localhost:8080" + "/api/suggestions/suggest?searchString=" + searchString);
    }
}