const useMock = false;
const mock = {
    postMethod: true,
    eGet: {
        parameter: {
            key: 'asdf'
        },
        contextPath: '',
        contentLength: -1,
        queryString: 'key=asdf',
        parameters: {
            key: ['asdf']
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

export { useMock, mock };
