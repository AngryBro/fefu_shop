import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import './css/Page.css';
import { useNavigate } from "react-router-dom";
import PhoneModal from "./PhoneModal";
import SmsModal from "./SmsModal";
import Api from "./Api";

const Page = ({Content, title}) => {

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

    var [cartCount, setCartCount] = React.useState(0);
    var [cartSum, setCartSum] = React.useState(0);
    var [cartUpdateFlag, setCartUpdateFlag] = React.useState(false);
    var [cartIds, setCartIds] = React.useState({position_ids:{}, product_ids:{}});
    var [infoPages, setInfoPages] = React.useState([]);
    var [contacts, setContacts] = React.useState([]);
    var [categories, setCategories] = React.useState([]);
    var [searchString, setSearchString] = React.useState('');
    var [userData, setUserData] = React.useState({authed: false, name:''});
    var [userDataUpdateFlag, setUserDataUpdateFlag] = React.useState(false);
    var [openedModalWindow, setOpenedModalWindow] = React.useState(closedModalWindow);
    var [productsMeta, setProductsMeta] = React.useState(undefined);

    React.useEffect(() => {
        if(localStorage.getItem('Authorization') !== null) {
            Api('mydataGet').auth().callback(({ok, array}) => {
                if(ok) {
                    setUserData({
                        authed: true,
                        name: array.name,
                        phone: array.phone_number,
                        email: array.email
                    });
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
        var pages = [];
        for(let i = 0; i<3; i++) {
            pages.push({
                name: 'Страница'+i,
                link: '/',
                id: i
            });
        }
        setInfoPages(pages);
        var temp = [];
        for(let i = 0; i<5; i++) {
            temp.push({
                name: 'контакт'+i,
                id: i
            });
        }
        setContacts(temp);
        temp = [];
        for(let i = 0; i < 8; i++) {
            temp.push({
                name: 'категория'+i,
                id: i,
                children: []
            });
        }
        setCategories(temp);
        Api('productsMeta').callback(({ok, array}) => {
            if(ok) {
                setProductsMeta(array);
            }
        }).send();
    }, [title]);


    return (
        <div>
            <Header
                categories={categories}
                cart={{count: cartCount, sum: cartSum}}
                contacts={contacts}
                infoPages={infoPages}
                search={search}
                searchString={{get: searchString, set: setSearchString}}
                userData={userData}
                setOpenedModalWindow={setOpenedModalWindow}
                >
            </Header>
            <PhoneModal
                close={() => setOpenedModalWindow(closedModalWindow)}
                type={openedModalWindow.type}
                phone={openedModalWindow.phone}
                setOpenedModalWindow={setOpenedModalWindow} 
            />
            <SmsModal
                close={() => setOpenedModalWindow(closedModalWindow)} 
                type={openedModalWindow.type} 
                phone={openedModalWindow.phone} 
                setOpenedModalWindow={setOpenedModalWindow}
                updateUserData={updateUserData}
            />
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
                    />
                </div>
            </div>
            <Footer categories={categories} infoPages={infoPages} contacts={contacts}></Footer>
        </div>
    );
}
export default Page;