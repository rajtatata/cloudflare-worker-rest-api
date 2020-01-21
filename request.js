module.exports = class AppReq {
    constructor(request) {
        this.request = request
        this.params = {}
    }

    async body() {
        try {
            return await this.request.json()
        } catch (error) {
            return {} // cases when body is null, but still json in content header
        }
    }

    query() {
        try {
            let query = {}
            let queryString = this.request.url.split('?')[1]

            queryString.split('&').forEach(el => {
                const temp = el.split('=')
                if (temp.length === 2) {
                    query[temp[0]] = temp[1]
                }
            })
            return query
        } catch (error) {
            return {}
        }
    }
}