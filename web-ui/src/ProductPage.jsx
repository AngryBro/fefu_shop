import './css/ProductPage.css';
import {useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageRoute from './PageRoute';
import ProductSlider from './ProductSlider';
import NotFavouriteSVG from './svg/NotFavouriteSVG';
import FavouriteSVG from './svg/FavouriteSVG';
import BigButton from './buttons/BigButton';
import SizeSelect from './SizeSelect';
import './css/Skeleton.css';
import PriceDiscount from './PriceDiscount';
import Api from './Api';

const ProductPage = ({cart, favouriteProductIds}) => {

    const {slug} = useParams();
    const navigate = useNavigate();
    
    var [inCart, setInCart] = useState(false);
    var [loaded, setLoaded] = useState(false);
    var [imgs, setImgs] = useState([]);
    var [data, setData] = useState({});
    var [imagePreview, setImagePreview] = useState(undefined);
    var [selectedSize, setSelectedSize] = useState('');
    var [sizeSelectionOpened, setSizeSelectionOpened] = useState(false);


    useEffect(() => {
        Api('productGet').callback(({ok, array, status}) => {
            if(ok) {
                setData(array);
                setSelectedSize(sizes(array.product)[0]);
                setLoaded(true);
            }
            if(status === 404) {
                navigate('/404');
            }
        })
        .get({
            slug: slug
        })
        .send();
        return () => setInCart(false);
    }, [slug, navigate]);

    useEffect(() => {
        if(Object.keys(data).length) {
            var temp = JSON.parse(JSON.stringify(data.images));
            temp.unshift({image: data.product.image_preview});
            setImgs(temp);
            setImagePreview(data.product.image_preview);
            document.title = data.product.name;
            if(data.product.id in cart.ids.product_ids) {
                if(selectedSize in cart.ids.product_ids[data.product.id]) {
                    setInCart(true);
                }
                else {
                    setInCart(false);
                }
            }
            else {
                setInCart(false);
            }
        }
    }, [data, selectedSize, cart.ids]);

    var sorted = (colors, mainColor) => {
        var temp = JSON.parse(JSON.stringify(colors));
        temp.push({color_name: mainColor.name, color_rgb: mainColor.rgb});
        temp.sort((a, b) => {
            return a.color_name > b.color_name?1:-1;
        });
        return temp;
    }

    var closeToBlack = rgb => {
        rgb = rgb.split(',').map(e => Number(e));
        return rgb[2] < 100;
    }

    var sizes = (product) => {
        var temp = [];
        var sizeNames = ['XS', 'S', 'M', 'L', 'XL'];
        for(let i = 0; i < sizeNames.length; i++) {
            if((sizeNames[i] in product)&&(product[sizeNames[i]]!==null)&&(product[sizeNames[i]] >= 0)) {
                temp.push(sizeNames[i]);
            }
        }
        return temp;
    }

    return (
        <div className='ProductPage' onClick={() => {if(sizeSelectionOpened) setSizeSelectionOpened(false)}}>
            {
                loaded?
                <div className='loaded'>
                    <div className='route'>
                        <PageRoute route={[{name: 'Главная', link: '/'}, {name: 'Каталог', link: '/catalog'}, {name: data.product.category, link: `/catalog/${data.product.category_slug}`}]}/>
                    </div>
                    <div className='main'>
                        <div className='slider'>
                            <ProductSlider images={imgs} setPreview={setImagePreview} />
                        </div>
                        <div className='preview' style={{backgroundImage: `url(${Api().img(imagePreview)})`}}>
                            {
                                data.product.new?
                                <div className='new'>
                                    <div className='text'>NEW</div>
                                </div>:
                                <></>
                            }
                            <div className='favourite'>
                                {
                                    data.product.id in favouriteProductIds?
                                    <FavouriteSVG/>:
                                    <NotFavouriteSVG/>
                                }
                            </div>
                        </div>
                        <div className='product'>
                            <div className='name'>{data.product.name}</div>
                            <div className='article'>
                                <div className='header'>Артикул:</div>
                                <div className='value'>{`${data.product.article}-${data.product.color_article}`}</div>
                            </div>
                            <div className='description'>{data.product.description}</div>
                            <div className='material'>
                                <div className='header'>Состав:</div>
                                <div className='value'>{data.product.material}</div>
                            </div>
                            <div className='size'>
                                <div className='header'>Размер:</div>
                                <div className='select'>
                                    <SizeSelect
                                    sizes={sizes(data.product)}
                                    selectedSize = {{
                                        get: selectedSize,
                                        set: setSelectedSize
                                    }}
                                    opened = {{
                                        get: sizeSelectionOpened,
                                        set: setSizeSelectionOpened
                                    }}
                                    />
                                </div>
                                <div className='onfit'>
                                    <div className='up'>Не можете подобрать размер?</div>
                                    <div className='down'>Запишитесь на примерку в наш шоурум</div>
                                </div>
                            </div>
                            <div className='color'>
                                <div className='header'>цвет:</div>
                                <div className='select'>
                                    {
                                        sorted(data.other_colors, {
                                            name: data.product.color_name,
                                            rgb: data.product.color_rgb
                                        }).map((color, index) => 
                                            <div key={index} className='item'
                                            style={{
                                                border: ('slug' in color)?'solid 1px black':(closeToBlack(color.color_rgb)?'3px solid rgb(175,175,175)':'3px solid black'),
                                                backgroundColor: `rgb(${color.color_rgb})`
                                            }}
                                            onClick={('slug' in color)?
                                                () => {navigate(`/product/${color.slug}`);}:
                                                () => 1
                                            }
                                            ></div>    
                                        )
                                    }
                                </div>
                            </div>
                            <div className='priceBlock'>
                                <div className='price'><PriceDiscount price={{old: data.product.price, new: data.product.price_discount}} /></div>
                                <div className='cartButton' onClick={() => {if(!cart.buttonDisabled(data.product[selectedSize], inCart)) cart.add(data.product.id,selectedSize)}}>
                                    <BigButton text={cart.buttonText(data.product[selectedSize], inCart)} disabled={cart.buttonDisabled(data.product[selectedSize], inCart)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>:
                <div className='skeleton'>
                    <div className='route skeletonBg'></div>
                    <div className='main'>
                        <div className='slider skeletonBg'> </div>
                        <div className='preview skeletonBg'></div>
                        <div className='product'>
                            <div className='name skeletonBg'></div>
                            <div className='article'>
                                <div className='header'>Артикул:</div>
                                <div className='value skeletonBg'></div>
                            </div>
                            <div className='description skeletonBg'></div>
                            <div className='material'>
                                <div className='header'>состав:</div>
                                <div className='block skeletonBg'></div>
                            </div>
                            <div className='size'>
                                <div className='header'>размер:</div>
                                <div className='block skeletonBg'></div>
                                <div className='onfit'>
                                    <div className='up'>Не можете подобрать размер?</div>
                                    <div className='down'>Запишитесь на примерку в наш шоурум</div>
                                </div>
                            </div>
                            <div className='color'>
                                <div className='header'>цвет:</div>
                                <div className='block skeletonBg'></div>
                            </div>
                            <div className='priceBlock skeletonBg'></div>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    );
}

export default ProductPage;