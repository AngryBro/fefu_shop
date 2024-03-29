const Api = (routeName) => {
    
    // const host = 'http://localhost/api';
    const host = 'http://logoshop.sytes.net:8888/api';
    
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
        orderCreate: '/order.create',
        infopagesAll: '/infopages.all',
        contacts: '/contacts.get',
        favouriteIds: '/favourite.getIds',
        ordersAll: '/orders.all',
        ordersItem: '/order.get',
        usersAll: '/users.all',
        adminsAll: '/admins.all',
        adminEdit: '/admin.update',
        adminCreate: '/admin.create',
        adminDelete: '/admin.delete',
        configUpdate: '/shopConfig.update',
        configAll: '/shopConfig.getAll',
        contactsUpdate: '/contacts.update',
        materials: '/materials.get',
        materialsUpdate: '/material.update',
        materialCreate: '/material.create',
        materialDelete: '/material.delete',
        brands: '/brands.get',
        brandUpdate: '/brand.update',
        brandCreate: '/brand.create',
        brandDelete: '/brand.delete',
        colors: '/colors.all',
        colorCreate: '/color.create',
        colorUpdate: '/color.update',
        colorDelete: '/color.delete',
        adminProducts: '/admin/products.search',
        adminProduct: '/admin/product.get',
        adminCategories: '/categories.all',
        adminProductUpdate: '/product.update',
        adminProductDelete: '/product.delete',
        adminProductCreate: '/product.create',
        imageUpload: '/img.upload',
        imageDelete: '/img.delete',
        categoryUpdate: '/category.update',
        categoryCreate: '/category.create',
        config: '/shopConfig.get',
        infopage: '/infopage.get',
        adminInfopagesAll: '/admin/infopages.all',
        adminInfopageGet: '/admin/infopage.get',
        infopageUpdate: '/infopage.update',
        infopageCreate: '/infopage.create',
        infopageDelete: '/infopage.delete',
        favouriteGet: '/favourite.get',
        favouriteAdd: '/favourite.add',
        favouriteDelete: '/favourite.delete',
        callbackCreate: '/callbacks.create',
        callbacksGet: '/callbacks.get'
    };

    var _method = 'get';
    var _headers = {};
    var _callback = ()=>1;
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
            img,
            imgUpload,
            cssimg
        });
    };

    var img = name => {
        return `${host}/img.get?file=${name}`;
    }

    var cssimg = name => {
        return `url(${host}/img.get?file=${name})`;
    }

    var imgUpload = (name, ref) => {
        _method = 'post';
        var form = new FormData();
        form.set(name, ref.current.files[0]);
        _postJson = form;
        return makeObject();
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
        if(routes[routeName]===undefined) {
            return alert(`API маршрута ${routeName} не существует`);
        }
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
            console.log(err, routeName, routes[routeName]);
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