import React from "react";
import { useNavigate } from "react-router-dom";
import Api from "./Api";
import './css/MainPage.css';
import MainSlider from "./MainSlider";
import ProductsSlider from "./ProductsSlider"; 

const MainPage = ({categories = [], favourite, favouriteProductIds}) => {
    
    const navigate = useNavigate();

    var [slides, setSlides] = React.useState([]);
    var [upCategories, setUpCategories] = React.useState([]);
    var [midCategories, setMidCategories] = React.useState([]);
    var [downCategories, setDownCategories] = React.useState([]);
    var [newProducts, setNewProducts] = React.useState([]);
    var [newProductsLoaded, setNewProductsLoaded] = React.useState(false);
    var [aboutImage, setAboutImage] = React.useState(null);

    React.useEffect(() => {
        Api('config').get({name: 'slide'}).callback(({ok, array}) => {
            if(ok) {
                setSlides(array);
            }
        }).send();
        setNewProducts([1,1,1,1]);
        Api('newProducts')
        .callback(({ok, array}) => {
            if(ok) {
                setNewProducts(array);
                setNewProductsLoaded(true);
            }
        })
        .send();
        Api('infopage').get({slug: 'about'}).callback(({ok, array}) => ok?setAboutImage(array.image_header):1).send();
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
            <div className="MainPageSlider">
                {slides.length?<MainSlider slides={slides} />:<></>}
            </div>
            <div className="categories">
                <div className="edge">{upCategories.map(category => 
                        <div key={category.id} className="category" onClick={() => navigate(`/catalog/${category.slug}`)}>
                            <div className="name">{category.name}</div>
                            <img className="image" src={Api().img(category.image)} alt="" />
                        </div>
                    )}</div>
                <div className="middle">{midCategories.map(category => 
                        <div key={category.id} className="category" onClick={() => navigate(`/catalog/${category.slug}`)}>
                            <div className="name">{category.name}</div>
                            <img className="image" src={Api().img(category.image)} alt="" />
                        </div>
                    )}</div>
                <div className="edge">{downCategories.map(category => 
                        <div key={category.id} className="category" onClick={() => navigate(`/catalog/${category.slug}`)}>
                            <div className="name">{category.name}</div>
                            <img className="image" src={Api().img(category.image)} alt="" />
                        </div>
                    )}</div>
            </div>
            <div className="new">
                <div className="header">новые поступления</div>
                <div className="products">
                    <ProductsSlider favourite={favourite} favouriteProductIds={favouriteProductIds} products={newProducts} skeletons={!newProductsLoaded} pageSize={4}/>
                </div>
            </div>
            <div className="about" style={aboutImage===null?{}:{backgroundImage:Api().cssimg(aboutImage)}}>
                <div className="block">
                    <div className="header">о компании</div>
                    <div className="text">какой-то текст</div>
                    <div className="moreButton" onClick={() => navigate('/info/about')}>
                        <div className="text">подробнее</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;