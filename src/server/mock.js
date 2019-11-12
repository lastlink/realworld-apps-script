// paste this in to the live ide to enable
// var useMock = true;
import config from './config'
const mock = {
    postMethod: true,
    eGet: {
        "parameter": {
            "method": "/api/articles/"
        },
        "contextPath": "",
        "contentLength": -1,
        "queryString": "method=/api/articles",
        "parameters": {
            "method": [
                "/api/articles"
            ]
        }
    },
    ePost: {
        "parameter": {
            "method": "/api/user"
        },
        "contextPath": "",
        "contentLength": 107,
        "queryString": "method=/api/user",
        "parameters": {
            "method": [
                "/api/user"
            ]
        },
        postData: {
            "type": "application/json",
            "length": 107,
            contents: `{
                "Authorization": "Token `+ config.jwtToken + `"
            }`,
            name: 'postData'
        }
    }
};

export { mock };
