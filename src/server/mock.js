// paste this in to the live ide to enable
// var useMock = true;
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
            "method": "/api/users/login"
        },
        "contextPath": "",
        "contentLength": 107,
        "queryString": "method=/api/users",
        "parameters": {
            "method": [
                "/api/users/login"
            ]
        },
        postData: {
            "type": "application/json",
            "length": 107,
            contents: `{
                "user": {
                    "username": "Jacob",
                    "email": "jake@jake.jake",
                    "password": "jakejake"
                }
            }`,
            name: 'postData'
        }
    }
};

export { mock };
