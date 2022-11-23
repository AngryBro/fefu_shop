import './css/ProductPage.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageRoute from './PageRoute';

const ProductPage = () => {

    const {id} = useParams();

    var [loaded, setLoaded] = useState(false);
    var [product, setProduct] = useState({});

    useEffect(() => {
        setProduct({
            product: {
                id: id,
                name: 'Лысый котик',
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
                color_name: 'серый',
                color_rgb: '100,100,100',
                color_article: 'G',
                brand: 'sphynx',
                material: 'кожанный',
                category: 'лысенький'
            },
            images: [
                'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)',
                'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)',
                'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)'
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
    }, [id]);

    return (
        <div className='ProductPage'>
            <div className='route'><PageRoute route={['a', 'b', 'c']}/></div>
        </div>
    );
}

export default ProductPage;