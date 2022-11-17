import Header from "./Header";
import Footer from "./Footer";
import React from "react";

const Page = ({Content}) => {
    var [cart, setCart] = React.useState(0);
    var cartAction = {
        inc: () => {
            setCart(cart+1);
        },
        dec: () => {
            setCart(cart-1);
        }
    };
    return (
        <div>
            <Header cart={cart}></Header>
            <Content cartAction={cartAction}/>
            <Footer></Footer>
        </div>
    );
}
export default Page;