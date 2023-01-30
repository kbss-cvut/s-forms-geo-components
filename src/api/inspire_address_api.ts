import axios from "axios";

const inspire_ad_api = axios.create({
    timeout: 1500
});

export default {
    /**
     * Send HTTP GET request to INSPIRE AD endpoint for getting geographic feature by point (latitude, longitude - EPSG4326).
     * @param lat
     * @param lng
     */
    getFeatureByPoint: (lat: number, lng: number) => {
        return axios.create().get(getFeatureByPointRequest(lat,lng));
    },

    getAddressesByBBOX: (long1: number, lat1: number, long2: number, lat2: number) => {
        return axios.create().get(getAddressesByBBOX(long1, lat1, long2, lat2));
    }
}


const getFeatureByPointRequest = (lat: number, lng: number) : string  => {
    return `https://services.cuzk.cz/wfs/inspire-ad-wfs.asp?service=wfs&version=2.0.0&request=getFeature&storedQuery_id=GetFeatureByPoint&POINT=<gml:Point srsName="http://www.opengis.net/def/crs/EPSG/0/4326" xmlns:gml="http://www.opengis.net/gml/3.2"><gml:pos>${lat} ${lng}</gml:pos></gml:Point>&&srsName=http://www.opengis.net/def/crs/EPSG/0/4326&FEATURE_TYPE=Address`;
}

const getAddressesByBBOX = (long1: number, lat1: number, long2: number, lat2: number) => {
    return `https://services.cuzk.cz/wfs/inspire-ad-wfs.asp?service=wfs&version=2.0.0&request=getFeature&typeNames=Address&BBOX=`+long1+`,`+lat1+`,`+long2+`,`+ lat2+`&srsName=srsName=http://www.opengis.net/def/crs/EPSG/0/4326`;
}