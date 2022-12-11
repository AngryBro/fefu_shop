const Api = (routeName) => {
    
    const host = 'http://localhost/api';
    
    const routes = {
        getSms: '/sms.send',
        sendSms: '/sms.verify',
        logout: '/logout',
        productsMeta: '/products.meta',
        mydataGet: '/mydata.get',
        productGet: '/product.get',
        products: '/products.get',
        newProducts: '/products.new',
        cartInfo: '/cart.info',
        cartAdd: '/cart.add',
        cartIds: '/cart.getIds',
        cartGet: '/cart.get',
        cartInc: '/cart.increment',
        cartDec: '/cart.decrement',
        cartDelete: '/cart.delete',
        orderCreate: '/order.create'
    };

    var _method = 'get';
    var _headers = {};
    var _callback = null;
    var _getParams = '';
    var _postJson = null;

    var makeObject = () => {
        return Object.freeze({
            get,
            post,
            auth,
            callback,
            headers,
            send,
            session,
            img
        });
    };

    var img = name => {
        return `${host}/img.get?file=${name}`;
    }

    var get = (params) => {
        _method = 'get';
        if(params !== undefined) {
            var temp = [];
            for(var i in params) {
                temp.push(`${i}=${params[i]}`);
            }
            _getParams = `?${temp.join('&')}`;
        }
        return makeObject();
    };

    var post = (obj) => {  
        _method = 'post';
        _postJson = JSON.stringify(obj);
        _headers['Content-Type'] = 'application/json';
        return makeObject();
    };

    var callback = (fn) => {
        _callback = fn;
        return makeObject();
    };

    var send = async () => {
        var fetchParams = {
            method: _method,
            headers: _headers
        };
        if(_method === 'post') {
            fetchParams.body = _postJson;
        }
        try {
            var promise = await fetch(host+routes[routeName]+_getParams, fetchParams);
            var response = undefined;
            response = await promise.json();
            _callback({ok: promise.ok, status: promise.status, array: response});
        }
        catch (err) {
            _callback({ok: false, status: undefined, array: undefined, error: err})
            console.log(err);
        }
    };

    var auth = () => {
        var token = localStorage.getItem('Authorization');
        if(token !== null) {
            _headers['Authorization'] = `Bearer ${token}`;
        }
        return makeObject();
    };

    var session = () => {
        var sess = localStorage.getItem('session');
        if(sess !== null) {
            _headers['X-Session'] = sess;
        }
        return makeObject();
    }

    var headers = (obj) => {
        for(var i in obj) {
            _headers[i] = obj[i];
        }
        return makeObject();
    };

    return makeObject();
};

export default Api;