import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import './css/Page.css';

const Page = ({Content}) => {
    var [cartCount, setCartCount] = React.useState(0);
    var [cartSum, setCartSum] = React.useState(0);
    var [infoPages, setInfoPages] = React.useState([]);
    var [contacts, setContacts] = React.useState([]);
    var [categories, setCategories] = React.useState([]);
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
    React.useEffect(() => {
        var pages = [];
        for(let i = 0; i<3; i++) {
            pages.push({
                name: 'инфа'+i,
                link: '/nahui',
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
    }, []);
    return (
        <div>
            <Header categories={categories} cart={{count: cartCount, sum: cartSum}} contacts={contacts} infoPages={infoPages}></Header>
            <div className="content"><div className="contentBlock"><Content cartAction={cartAction}/></div></div>
            <Footer categories={categories} infoPages={infoPages} contacts={contacts}></Footer>
        </div>
    );
}
export default Page;