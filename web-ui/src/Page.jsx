import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import './css/Page.css';
import { useNavigate } from "react-router-dom";
import PhoneModal from "./PhoneModal";
import SmsModal from "./SmsModal";

const Page = ({Content, title}) => {

    const navigate = useNavigate();
    const closedModalWindow = {type: null, phone: ''};

    const cartUpdate = () => {
        setCartUpdateFlag(!cartUpdateFlag);
    }
    const search = () => {
        var trimedSearchString = searchString.trim();
        if(trimedSearchString.length) {
            navigate(`/catalog?search=${trimedSearchString}`);
        }
    }

    var [cartCount, setCartCount] = React.useState(0);
    var [cartSum, setCartSum] = React.useState(0);
    var [cartUpdateFlag, setCartUpdateFlag] = React.useState(false);
    var [infoPages, setInfoPages] = React.useState([]);
    var [contacts, setContacts] = React.useState([]);
    var [categories, setCategories] = React.useState([]);
    var [searchString, setSearchString] = React.useState('');
    var [userData, setUserData] = React.useState({authed: false, name:'123'});
    var [openedModalWindow, setOpenedModalWindow] = React.useState(closedModalWindow);

    React.useEffect(() => {
        if(localStorage.getItem('Authorization') !== null) {
            setUserData({authed: true});
        }
    }, []);

    React.useEffect(() => {
        //
        setCartCount(0);
        setCartSum(0); 
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
            />
            <div className="content">
                <div className="contentBlock">
                    <Content 
                    cartUpdate={cartUpdate}
                    cart={{sum: cartSum, count: cartCount}}
                    searchString={{get: searchString, set: setSearchString}}
                    userData={userData}
                    setOpenedModalWindow={setOpenedModalWindow}
                    />
                </div>
            </div>
            <Footer categories={categories} infoPages={infoPages} contacts={contacts}></Footer>
        </div>
    );
}
export default Page;