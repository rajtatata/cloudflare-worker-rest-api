module.exports = class AppRes {
    constructor(request) {

    }

    send(data, status = 200) {
        return new Response(JSON.stringify(data), {
            status,
            headers: {
                "content-type": "application/json"
            }
        })
    }
}