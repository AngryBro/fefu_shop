import React from "react";
import './css/MainPage.css';
import ProductsSlider from "./ProductsSlider";

const MainPage = () => {
    
    var [categories, setCategories] = React.useState([]); //eslint-disable-next-line
    var [slide, setSlide] = React.useState({
        left: 'https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg',
        right: 'https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg',
        text: 'Одежда Max Mara из Италии с персональной скидкой'
    });
    var [upCategories, setUpCategories] = React.useState([]);
    var [midCategories, setMidCategories] = React.useState([]);
    var [downCategories, setDownCategories] = React.useState([]);
    var [newProducts, setNewProducts] = React.useState([]);


    React.useEffect(() => {
        var temp = [];
        for(let i = 0; i < 10; i++) {
            temp.push({
                id: i,
                name: 'категория'+i,
                image: 'https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg'
            });
        }
        setCategories(temp);
        temp = [];
        for(let i = 0; i < 10; i++) {
            temp.push({
                id: i,
                name: 'Котик №'+i,
                price: 100*i,
                price_discount: 100*i - Math.round(Math.random()),
                image_preview: 'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)'
            });
        }
        setNewProducts(temp);
    }, []);

    React.useEffect(() => {
        var temp = [];
        var index = Math.round(Math.random()*Math.max(categories.length-8, 0));
        for(let i = index; i < index+Math.min(3,categories.length); i++) {
            temp.push(categories[i]);
        }
        setUpCategories(temp);
        index = index+Math.min(3,categories.length);
        temp = [];
        for(let i = index; i < index+Math.min(2,categories.length); i++) {
            temp.push(categories[i]);
        }
        setMidCategories(temp);
        index = index+Math.min(2,categories.length);
        temp = [];
        for(let i = index; i < index+Math.min(3,categories.length); i++) {
            temp.push(categories[i]);
        }
        setDownCategories(temp);
    }, [categories]);
    
    return (
        <div className="MainPage">
            <div className="slide">
                <div className="left" style={{backgroundImage:'url('+slide.left+')'}}>

                </div>
                <div className="middle">
                    <img className="logo" src={slide.left} alt="" />
                    <div className="header">logo</div>
                    <div className="text">{slide.text}</div>
                </div>
                <div className="right" style={{backgroundImage:'url('+slide.right+')'}}>

                </div>
            </div>
            <div className="categories">
                <div className="edge">{upCategories.map(category => 
                        <div className="category">
                            <div className="name">{category.name}</div>
                            <img className="image" src={category.image} alt="" />
                        </div>
                    )}</div>
                <div className="middle">{midCategories.map(category => 
                        <div className="category">
                            <div className="name">{category.name}</div>
                            <img className="image" src={category.image} alt="" />
                        </div>
                    )}</div>
                <div className="edge">{downCategories.map(category => 
                        <div className="category">
                            <div className="name">{category.name}</div>
                            <img className="image" src={category.image} alt="" />
                        </div>
                    )}</div>
            </div>
            <div className="new">
                <div className="header">новые поступления</div>
                <div className="products">
                    <ProductsSlider products={newProducts} pageSize={4}/>
                </div>
            </div>
            <div className="about" style={{backgroundImage: 'url('+slide.left+')'}}>
                <div className="block">
                    <div className="header">о компании</div>
                    <div className="text">какой-то текст</div>
                    <div className="moreButton">
                        <div className="text">подробнее</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;