import React from "react";
import { useNavigate } from "react-router-dom";
import Api from "./Api";
import './css/MainPage.css';
import ProductsSlider from "./ProductsSlider"; 

const MainPage = ({categories = []}) => {
    
    const navigate = useNavigate();
//eslint-disable-next-line
    var [slide, setSlide] = React.useState({
        left: 'https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg',
        right: 'https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg',
        text: 'Одежда Max Mara из Италии с персональной скидкой'
    });
    var [upCategories, setUpCategories] = React.useState([]);
    var [midCategories, setMidCategories] = React.useState([]);
    var [downCategories, setDownCategories] = React.useState([]);
    var [newProducts, setNewProducts] = React.useState([]);
    var [newProductsLoaded, setNewProductsLoaded] = React.useState(false);

    React.useEffect(() => {
        setNewProducts([1,1,1,1]);
        Api('newProducts')
        .callback(({ok, array}) => {
            if(ok) {
                setNewProducts(array);
                setNewProductsLoaded(true);
            }
        })
        .send();
    }, []);


    React.useEffect(() => {
        var temp = [];
        var tempCategories = [];
        for(let i = 0; i < categories.length; i++) {
            if(!categories[i].children.length) {
                tempCategories.push(categories[i]);
            }
        }
        var index = Math.round(Math.random()*Math.max(tempCategories.length-8, 0));
        for(let i = index; i < index+Math.min(3,tempCategories.length); i++) {
            temp.push(tempCategories[i]);
        }
        setUpCategories(temp);
        index = index+Math.min(3,tempCategories.length);
        temp = [];
        for(let i = index; i < index+Math.min(2,tempCategories.length); i++) {
            temp.push(tempCategories[i]);
        }
        setMidCategories(temp);
        index = index+Math.min(2,tempCategories.length);
        temp = [];
        for(let i = index; i < index+Math.min(3,tempCategories.length); i++) {
            temp.push(tempCategories[i]);
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
                        <div key={category.id} className="category" onClick={() => navigate(`/catalog/${category.slug}`)}>
                            <div className="name">{category.name}</div>
                            <img className="image" src={category.image} alt="" />
                        </div>
                    )}</div>
                <div className="middle">{midCategories.map(category => 
                        <div key={category.id} className="category" onClick={() => navigate(`/catalog/${category.slug}`)}>
                            <div className="name">{category.name}</div>
                            <img className="image" src={category.image} alt="" />
                        </div>
                    )}</div>
                <div className="edge">{downCategories.map(category => 
                        <div key={category.id} className="category" onClick={() => navigate(`/catalog/${category.slug}`)}>
                            <div className="name">{category.name}</div>
                            <img className="image" src={category.image} alt="" />
                        </div>
                    )}</div>
            </div>
            <div className="new">
                <div className="header">новые поступления</div>
                <div className="products">
                    <ProductsSlider products={newProducts} skeletons={!newProductsLoaded} pageSize={4}/>
                </div>
            </div>
            <div className="about" style={{backgroundImage: 'url('+slide.left+')'}}>
                <div className="block">
                    <div className="header">о компании</div>
                    <div className="text">какой-то текст</div>
                    <div className="moreButton" onClick={() => window.open('/info/about')}>
                        <div className="text">подробнее</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;