const res = require('./response')
const req = require('./request')

module.exports = class App {
    constructor() {
        this.routes = []
        this.middlewares = []
    }

    async handleRequest(request) {
        this.response = new res(request)
        this.request = new req(request)

        let method = request.method
        let url = '/' + request.url.split('/').slice(3).join('/').split('?')[0]

        let route = this.routes.find(elem => this.routeCheck(elem.url, url) && elem.method === method)
        // if no route found, try to find with any method
        if (!route) route = this.routes.find(elem => this.routeCheck(elem.url, url) && elem.method === '*')

        if (route) {
            // run the middlewares first
            for (var i = 0; i < this.middlewares.length; i++) {
                await this.middlewares[i].callback(this.request, this.response)
            }

            // run the callback function
            return await route.callback(this.request, this.response)
        }

        return this.response.send({ status: 0, message: "Method not found!" }, 404)
    }

    get(url, callback) {
        this.routes.push({
            url: url,
            method: 'GET',
            callback
        })
    }

    post(url, callback) {
        this.routes.push({
            url: url,
            method: 'POST',
            callback
        })
    }

    put(url, callback) {
        this.routes.push({
            url: url,
            method: 'PUT',
            callback
        })
    }

    patch(url, callback) {
        this.routes.push({
            url: url,
            method: 'PATCH',
            callback
        })
    }

    delete(url, callback) {
        this.routes.push({
            url: url,
            method: 'DELETE',
            callback
        })
    }

    any(url, callback) {
        this.routes.push({
            url: url,
            method: '*',
            callback
        })
    }

    use(var1, var2) {
        if (arguments.length == 2) {
            this.useRouter(var1, var2)
        } else if (arguments.length === 1) {
            this.useMiddleware(var1)
        }
    }

    useMiddleware(callback) {
        arguments.length
        this.middlewares.push({
            callback
        })
    }

    useRouter(path, router) {
        router.routes.forEach(element => {
            this.routes.push({
                url: path + (element.url === '/' ? '' : element.url),
                method: element.method,
                callback: element.callback
            })
        })

        router.middlewares.forEach(element => {
            this.middlewares.push({
                callback: element.callback
            })
        })
    }

    routeCheck(route, requestRoute) {
        // implementing route params

        // split actual route from this.routes
        // and the route from the request
        let routeArray = route.split('/')
        let requestRouteArray = requestRoute.split('/')

        if (routeArray.length !== requestRouteArray.length) {
            return false
        }
        
        try {
            let flag = true
            // compare each element from both routes
            routeArray.forEach((elem, index) => {
                // check if we have url parameters
                // and if there is actually a value in request url
                // then insert to request.params
                if (elem.includes(':') && requestRouteArray[index] && requestRouteArray[index] !== "") {
                    this.request.params[elem.substring(1)] = requestRouteArray[index]
                } else {
                    if (elem !== requestRouteArray[index]) {
                        flag = false
                        return
                    }
                }
            })
            return flag
        } catch (error) {
            return false
        }
    }
}