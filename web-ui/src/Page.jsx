import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import './css/Page.css';
import { useNavigate } from "react-router-dom";
import PhoneModal from "./PhoneModal";
import SmsModal from "./SmsModal";
import Api from "./Api";

const Page = ({Content, title}) => {

    const errorMsg = (err) => alert('Ошибка сервера '+err);
    const navigate = useNavigate();
    const closedModalWindow = {type: null, phone: ''};

    const cartUpdate = () => {
        setCartUpdateFlag(!cartUpdateFlag);
    }
    const cartButtonText = (count,inCart) => {
        if(inCart) return 'в корзине';
        if(count > 0) return 'в корзину';
        if(count === 0) return 'нет в наличии';
        return 'на примерке';
    }
    const cartButtonDisabled = (count,inCart) => {
        if(!inCart && (count > 0)) return false;
        return true;
    }
    const updateUserData = () => {
        setUserDataUpdateFlag(!userDataUpdateFlag);
    }
    const search = () => {
        var trimedSearchString = searchString.trim();
        if(trimedSearchString.length) {
            navigate(`/catalog?search=${trimedSearchString}`);
        }
    }
    const addToCart = (id, size) => {
        Api('cartAdd').session().auth().post({product_id: id, size})
        .callback(({ok, array}) => {
            if(ok) {
                if('session' in array) {
                    localStorage.setItem('session',array.session);
                }
                cartUpdate();
            }
            else {
                document.location.reload();
            }
        }).send();
    }
    const infoPagesWithPlaces = array => {
        var temp1 = [];
        var temp2 = [];
        var temp3 = [];
        var inPlace = (number, array_i) => {
            return String(array_i.place).indexOf(String(number))!==-1;
        }
        for(let i = 0; i < array.length; i++) {
            if(inPlace(1,array[i])) {
                temp1.push(array[i]);
            }
            if(inPlace(2, array[i])) {
                temp2.push(array[i]);
            }
            if(inPlace(3, array[i])) {
                temp3.push(array[i]);
            }
            
        }
        return {
            header: temp1,
            footerLeft: temp2,
            footerRight: temp3,
            all: array
        };
    }
    const contactsWithKeys = array => {
        var temp = {};
        array.forEach(item => temp[item.name_internal] = item);
        return temp;
    }

    var [cartCount, setCartCount] = React.useState(0);
    var [cartSum, setCartSum] = React.useState(0);
    var [cartUpdateFlag, setCartUpdateFlag] = React.useState(false);
    var [cartIds, setCartIds] = React.useState({position_ids:{}, product_ids:{}});
    var [infoPages, setInfoPages] = React.useState([]);
    var [contacts, setContacts] = React.useState({});
    var [categories, setCategories] = React.useState([]);
    var [searchString, setSearchString] = React.useState('');
    var [userData, setUserData] = React.useState({authed: false});
    var [userDataUpdateFlag, setUserDataUpdateFlag] = React.useState(false);
    var [openedModalWindow, setOpenedModalWindow] = React.useState(closedModalWindow);
    var [productsMeta, setProductsMeta] = React.useState(undefined);
    var [sendSmsTime, setSendSmsTime] = React.useState(0);
    var [favouriteProductIds, setFavouriteProductIds] = React.useState({});

    React.useEffect(() => {
        if(localStorage.getItem('Authorization') !== null) {
            Api('mydataGet').auth().callback(({ok, array}) => {
                if(ok) {
                    var userParams = {};
                    if(array.name!==null) {
                        userParams.name = array.name;
                    }
                    if(array.email!==null) {
                        userParams.email = array.email;
                    }
                    userParams.phone = array.phone_number;
                    userParams.authed = true;
                    setUserData(userParams);
                }
            }).send();
        }
    }, [userDataUpdateFlag]);

    React.useEffect(() => {
        Api('cartInfo').auth().session().callback(({ok, array}) => {
            if(ok) {
                setCartCount(array.count);
                setCartSum(array.sum);
            }
        }).send();
        Api('cartIds').auth().session().callback(({ok, array}) => {
            if(ok) {
                setCartIds(array);
            }
        }).send(); 

    }, [cartUpdateFlag]);

    React.useEffect(() => {
        
        document.title = title===undefined?'LOGO':title;

        Api('infoPagesAll')
        .callback(({ok,array}) => {
            if(ok) {
                setInfoPages(array);
            }
        })
        .send();

        Api('contacts')
        .callback(({ok, array}) => {
            if(ok) {
                setContacts(contactsWithKeys(array));
            }
        })
        .send();
        
        Api('productsMeta')
        .callback(({ok, array}) => {
            if(ok) {
                setProductsMeta(array);
                setCategories(array.categories);
            }
        })
        .send();

        Api('favouriteIds')
        .callback(({ok, array}) => {
            if(ok) {
                setFavouriteProductIds(array.product_ids);
            }
        })
        .auth()
        .send();

    }, [title]);


    return (
        <div>
            <Header
                categories={categories}
                cart={{count: cartCount, sum: cartSum}}
                contacts={contacts}
                infoPages={infoPagesWithPlaces(infoPages)}
                search={search}
                searchString={{get: searchString, set: setSearchString}}
                userData={userData}
                setOpenedModalWindow={setOpenedModalWindow}
                >
            </Header>
            {
                openedModalWindow.type==='phone'?
                <PhoneModal
                    close={() => setOpenedModalWindow(closedModalWindow)}
                    type={openedModalWindow.type}
                    phone={openedModalWindow.phone}
                    setOpenedModalWindow={setOpenedModalWindow} 
                    smsTime={{get: sendSmsTime, set: setSendSmsTime}}
                    errorMsg={errorMsg}
                />:
                <></>
            }
            {
                openedModalWindow.type==='sms'?
                <SmsModal
                    close={() => setOpenedModalWindow(closedModalWindow)} 
                    type={openedModalWindow.type} 
                    phone={openedModalWindow.phone} 
                    setOpenedModalWindow={setOpenedModalWindow}
                    updateUserData={updateUserData}
                    errorMsg={errorMsg}
                    cartUpdate={cartUpdate}
                />:
                <></>
            }
            <div className="content">
                <div className="contentBlock">
                    <Content 
                    cartUpdate={cartUpdate}
                    addToCart={addToCart}
                    cart={{
                        sum: cartSum, 
                        count: cartCount, 
                        update: cartUpdate, 
                        add: addToCart, 
                        ids: cartIds,
                        buttonText: cartButtonText,
                        buttonDisabled: cartButtonDisabled
                    }}
                    searchString={{get: searchString, set: setSearchString}}
                    userData={userData}
                    setOpenedModalWindow={setOpenedModalWindow}
                    productsMeta={productsMeta}
                    categories={categories}
                    favouriteProductIds={favouriteProductIds}
                    />
                </div>
            </div>
            <Footer 
                categories={categories} 
                infoPages={infoPagesWithPlaces(infoPages)} 
                contacts={contacts}></Footer>
        </div>
    );
}
export default Page;