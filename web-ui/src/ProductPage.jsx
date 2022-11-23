import './css/ProductPage.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageRoute from './PageRoute';
import ProductSlider from './ProductSlider';
import NotFavouriteSVG from './svg/NotFavouriteSVG';
import FavouriteSVG from './svg/FavouriteSVG';

const ProductPage = () => {

    const {slug} = useParams();

    var [loaded, setLoaded] = useState(false);
    var [imgs, setImgs] = useState([]);
    var [data, setData] = useState({});
    var [imagePreview, setImagePreview] = useState(undefined);

    useEffect(() => {
        setData({
            product: {
                id: 1,
                name: 'Лысый котик',
                name_internal: slug,
                image_preview:  'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)',
                article: '12345-M-',
                price: 10000,
                price_discount: 9999,
                description: 'мягенький тёпленький',
                XS: 1,
                S: -1,
                M: null,
                L: 3,
                XL: 0,
                new: true,
                favourite: true,
                cart: false,
                color_name: 'серый',
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
                    id: 2,
                    color_name: 'розовый',
                    color_rgb: '255, 182, 194'
                },
                {
                    id: 3,
                    color_name: 'black',
                    color_rgb: '0,0,0'
                }
            ]
        });
    }, [slug]);

    useEffect(() => {
        if(Object.keys(data).length) {
            var temp = JSON.parse(JSON.stringify(data.images));
            temp.unshift(data.product.image_preview);
            setImgs(temp);
            setImagePreview(data.product.image_preview);
        }
    }, [data]);

    return (
        <div className='ProductPage'>
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

                </div>
            </div>
        </div>
    );
}

export default ProductPage;