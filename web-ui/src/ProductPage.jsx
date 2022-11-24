import './css/ProductPage.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageRoute from './PageRoute';
import ProductSlider from './ProductSlider';
import NotFavouriteSVG from './svg/NotFavouriteSVG';
import FavouriteSVG from './svg/FavouriteSVG';
import BigButton from './buttons/BigButton';
import SizeSelect from './SizeSelect';

const ProductPage = () => {

    const {slug} = useParams();

    var [loaded, setLoaded] = useState(false);
    var [imgs, setImgs] = useState([]);
    var [data, setData] = useState({});
    var [imagePreview, setImagePreview] = useState(undefined);
    var [selectedSize, setSelectedSize] = useState('XS');
    var [sizeSelectionOpened, setSizeSelectionOpened] = useState(false);

    useEffect(() => {
        setData({
            product: {
                id: 1,
                name: 'Лысый котик',
                slug: slug,
                image_preview:  'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)',
                article: '12345M',
                price: 10000,
                price_discount: 9999+1,
                description: 'мягенький тёпленький',
                XS: 1,
                S: -1,
                M: null,
                L: 3,
                XL: 0,
                new: true,
                favourite: true,
                cart: false,
                color_name: 'асерый',
                color_rgb: '100,100,100',
                color_article: 'G',
                brand: 'sphynx',
                material: 'кожанный',
                category: 'лысенький'
            },
            images: [
                'url(https://pic.rutubelist.ru/video/93/93/9393f57541909bcad8dded541a681165.jpg)',
                'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)',
                'url(https://i09.fotocdn.net/s119/ca1a0cd5642674c1/preview_m/2725288386.jpg)'
            ],
            other_colors: [
                {
                    slug: 'cat',
                    color_name: 'розовый',
                    color_rgb: '255, 182, 194'
                },
                {
                    slug: 'kitten',
                    color_name: 'black',
                    color_rgb: '0,0,0'
                }
            ]
        });
        setTimeout(() => setLoaded(true), 2000);
    }, [slug]);

    useEffect(() => {
        if(Object.keys(data).length) {
            var temp = JSON.parse(JSON.stringify(data.images));
            temp.unshift(data.product.image_preview);
            setImgs(temp);
            setImagePreview(data.product.image_preview);
        }
    }, [data]);

    var sorted = (colors, mainColor) => {
        var temp = JSON.parse(JSON.stringify(colors));
        temp.push({color_name: mainColor.name, color_rgb: mainColor.rgb});
        temp.sort((a, b) => {
            return a > b?1:-1;
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
        // return sizeNames;
    }

    return (
        <div className='ProductPage' onClick={() => {if(sizeSelectionOpened) setSizeSelectionOpened(false)}}>
            {
                loaded?
                <div className='loaded'>
                    <div className='route'>
                        <PageRoute route={[{name: 'Главная', link: '/'}, {name: 'Каталог', link: '/'}, {name: 'Куртка', link: '/'}]}/>
                    </div>
                    <div className='main'>
                        <div className='slider'>
                            <ProductSlider images={imgs} setPreview={setImagePreview} />
                        </div>
                        <div className='preview' style={{backgroundImage: imagePreview}}>
                            {
                                data.product.new?
                                <div className='new'>
                                    <div className='text'>NEW</div>
                                </div>:
                                <></>
                            }
                            <div className='favourite'>
                                {
                                    data.product.favourite?
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
                                                border: ('slug' in color)?'none':(closeToBlack(color.color_rgb)?'2px solid rgb(175,175,175)':'2px solid black'),
                                                backgroundColor: `rgb(${color.color_rgb})`
                                            }}
                                            onClick={('slug' in color)?
                                                () => document.location.href = `/product/${color.slug}`:
                                                () => 1
                                            }
                                            ></div>    
                                        )
                                    }
                                </div>
                            </div>
                            <div className='price'>
                                {
                                    data.product.price === data.product.price_discount?
                                    <div className='normal'>{data.product.price} &#8381;</div>:
                                    <div>
                                        <div className='old'>{data.product.price} &#8381;</div>
                                        <div className='normal'>{data.product.price_discount} &#8381;</div>
                                    </div>
                                }
                                <div className='value'></div>
                                <div className='cartButton'>
                                    <BigButton text='в корзину' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>:
                <div className='skeleton'>
                    <div className='route'></div>
                    <div className='main'>
                        <div className='slider'> </div>
                        <div className='preview'></div>
                        <div className='product'>
                            <div className='name'></div>
                            <div className='article'>
                                <div className='header'>Артикул:</div>
                                <div className='value'></div>
                            </div>
                            <div className='description'></div>
                            <div className='material'>
                                <div className='header'>состав:</div>
                                <div className='block'></div>
                            </div>
                            <div className='size'>
                                <div className='header'>размер:</div>
                                <div className='block'></div>
                                <div className='onfit'>
                                    <div className='up'>Не можете подобрать размер?</div>
                                    <div className='down'>Запишитесь на примерку в наш шоурум</div>
                                </div>
                            </div>
                            <div className='color'>
                                <div className='header'>цвет:</div>
                                <div className='block'></div>
                            </div>
                            <div className='priceBlock'></div>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    );
}

export default ProductPage;