import './css/CartPage.css';
import './css/CartPosition.css';
import PriceDiscount from './PriceDiscount';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import { useState, useEffect } from 'react';
import PageRoute from './PageRoute';
import Api from './Api';

const Product = ({product, del}) => {

    var [deleteButtonColor, setDeleteButtonColor] = useState('#ADB1BB');

    return (
        <div className='CartPosition' style={{width:'400px'}}>
            <div className='imagePreview' onClick={() => window.open(`/product/${product.slug}`)} style={{backgroundImage: Api().cssimg(product.image_preview)}}></div>
            <div className='productInfo'>
                <div className='name' onClick={() => window.open(`/product/${product.slug}`)}>{product.name}</div>
                <div className='priceBlock' style={{marginLeft:'0'}}>
                    <div className='title'>Стоимость</div>
                    <div className='price'><PriceDiscount price={{old: product.price, new: product.price_discount}} font={14}/></div>
                </div>
            </div>
            <div className='deleteButton' 
                onClick={() => del(product.id)}
                onMouseEnter={() => setDeleteButtonColor('#ff9797')}
                onMouseLeave={() => setDeleteButtonColor('#ADB1BB')}
            >
                <DeleteCartPositionSVG color={deleteButtonColor}/>
            </div>
        </div>
    );
};

const FavouritesPage = ({favourite, favouriteProductIds}) => {

    const [products, setProducts] = useState([]);
    const [found, setFound] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { 
        Api('favouriteGet').auth().callback(({ok, array, status}) => {
            if(ok) {
                setProducts(array.products);
                setLoaded(true);
                setFound(true);
            }
            if(status === 404 || status === 401) {
                setLoaded(true);
                setFound(false);
            }
        }).send();
    }, [favouriteProductIds]);

    return (
        <div className='CartPage'>
            <div className='route'>
                <PageRoute route={[
                    {name: 'Вернуться в каталог', link: '/catalog'},
                    {name: 'Избранное'}
                ]} back={true} />
            </div>

            <div className='block' hidden={!found}>
                <div className='positions'>
                    {
                        products.map((product, index) =>
                            <div key={product.id} className='positionBlock'>
                                <Product product={product} del={favourite.del} />
                                <div className='line' hidden={index===products.length-1}></div>
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="productsNotFound" hidden={found||!loaded}>
                    <div className="blockNotFound">
                        <div className="textNotFound">
                            В избранном товары отсутствуют &#128577;<br/>
                        </div>
                        <div className='textNotFound'>
                            
                        </div>
                    </div>
                    <div className="manImage"></div>
            </div>
            {
                loaded?<></>:
                <div className='loading' hidden={loaded}>
                    Подождите, избранное загружается...
                </div>
            }
        </div>
    );
};

export default FavouritesPage;