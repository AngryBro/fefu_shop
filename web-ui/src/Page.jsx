import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import './css/Page.css';
import { useNavigate } from "react-router-dom";

const Page = ({Content, title}) => {

    const navigate = useNavigate();

    var [cartCount, setCartCount] = React.useState(0);
    var [cartSum, setCartSum] = React.useState(0);
    var [infoPages, setInfoPages] = React.useState([]);
    var [contacts, setContacts] = React.useState([]);
    var [categories, setCategories] = React.useState([]);
    var [searchString, setSearchString] = React.useState('');
    var cartAction = {
        inc: () => {
            setCartCount(cartCount+1);
        },
        dec: () => {
            setCartCount(cartCount-1);
        },
        add: sum => {
            setCartSum(cartSum+sum);
        }
    };

    const search = () => {
        var trimedSearchString = searchString.trim();
        if(trimedSearchString.length) {
            navigate(`/catalog?search=${trimedSearchString}`);
        }
    }

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
            <Header categories={categories} cart={{count: cartCount, sum: cartSum}} contacts={contacts} infoPages={infoPages} search={search} searchString={{get: searchString, set: setSearchString}}></Header>
            <div className="content"><div className="contentBlock"><Content cartAction={cartAction} searchString={{get: searchString, set: setSearchString}} /></div></div>
            <Footer categories={categories} infoPages={infoPages} contacts={contacts}></Footer>
        </div>
    );
}
export default Page;