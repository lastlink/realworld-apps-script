// paste this in to the live ide to enable
// var useMock = true;
const mock = {
    postMethod: false,
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
        parameter: {
            key: 'asdf'
        },
        contextPath: '',
        contentLength: 33,
        queryString: 'key=asdf',
        parameters: {
            key: ['asdf']
        },
        postData: {
            type: 'application/json',
            length: 33,
            contents:
                `{
                "func": "checkin",
                "deviceId": "asdf200",
                "os": "mock2",
                "ip": "192.168.1.5",
                "services": "resilio,pihole"
            }`,
            name: 'postData'
        }
    }
};

export { mock };
