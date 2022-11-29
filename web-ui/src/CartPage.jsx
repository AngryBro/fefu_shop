import './css/CartPage.css';
import PageRoute from './PageRoute';
import { useState, useEffect } from 'react';
import CartPosition from './CartPosition';
import PriceDiscount from './PriceDiscount';
import BigButton from './buttons/BigButton';

const CartPage = () => {
// eslint-disable-next-line
    var [loaded, setLoaded] = useState(false);// eslint-disable-next-line
    var [found, setFound] = useState(true);
    var [positions, setPositions] = useState([]);

    var sum = () => {
        var temp = 0;
        positions.forEach(p => temp+=p.price*p.count);
        return temp;
    }

    var sumDiscounts = () => {
        var temp = 0;
        positions.forEach(p => temp+=p.discount*p.count);
        return temp;
    }

    var sumTotal = () => {
        var tempOld = 0;
        var tempNew = 0;
        positions.forEach(p => {tempNew+=p.price_discount*p.count; tempOld+=p.price*p.count});
        return {old: tempOld, new: tempNew};
    }

    var deletePosition = id => {
        // delete
        var temp = [];
        for(let i = 0; i < positions.length; i++) {
            if(positions[i].position_id === id) continue;
            temp.push(positions[i]);
        }
        if(!temp.length) {
            setFound(false);
        }
        setPositions(temp);
    }

    var increment = id => {
        // increment
        var temp = positions.slice();
        var position = temp.find(e => e.position_id === id);
        position.count++;
        setPositions(temp);
    }

    var decrement = id => {
        // decrement
        var temp = positions.slice();
        var position = temp.find(e => e.position_id === id);
        position.count--;
        setPositions(temp);
    }

    useEffect(() => {
        var temp = [];
        for(let i = 0; i<5; i++) {
            var t = Math.round(Math.random());
            temp.push({
                position_id: i+1,
                name: 'Котик мохнатый',
                size: 'M',
                id: i+1,
                count: i+1,
                image_preview: 'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)',
                price: 999,
                price_discount: 999-t,
                discount: t
            });
        }
        setPositions(temp);
    }, []);

    return (
        <div className='CartPage'>
            <div className='route'>
                <PageRoute route={[
                    {name: 'Вернуться в каталог', link: '/catalog'},
                    {name: 'Корзина'}
                ]} back={true} />
            </div>

            <div className='block' hidden={!found}>
                <div className='positions'>
                    {
                        positions.map((position, index) =>
                            <div key={position.position_id} className='positionBlock'>
                                <CartPosition
                                    position={position}
                                    count={{
                                        increment,
                                        decrement,
                                    }}
                                    price={{
                                        new: position.price_discount,
                                        old: position.price
                                    }}
                                    deletePosition={deletePosition}
                                    debug={position.count}
                                />
                                <div className='line' hidden={index===positions.length-1}></div>
                            </div>
                        )
                    }
                </div>
                <div className='info'>
                    <div className='title'>Ваша корзина</div>
                    <div className='line'></div>
                    <div className='count'>
                        <div className='subTitle'>Кол-во позиций:</div>
                        <div className='value'>{positions.length} шт</div>
                    </div>
                    <div className='sum'>
                        <div className='subTitle'>Сумма:</div>
                        <div className='value'>{sum()} &#8381;</div>
                    </div>
                    <div className='sumDiscounts'>
                        <div className='subTitle'>Сумма скидок:</div>
                        <div className='value'>{sumDiscounts()} &#8381;</div>
                    </div>
                    <div className='line'></div>
                    <div className='total'>
                        <div className='subTitleTotal'>Итого</div>
                        <div className='price'>
                            <PriceDiscount price={sumTotal()} font={14} />
                        </div>
                    </div>
                    <div className='orderButton'>
                        <BigButton text={'Оформить заказ'} />
                    </div>
                </div>
            </div>

            <div className="productsNotFound" hidden={found}>
                    <div className="blockNotFound">
                        <div className="textNotFound">
                            В корзине товары отсутствуют &#128577;<br/>
                        </div>
                        <div className='textNotFound'>
                            
                        </div>
                    </div>
                    <div className="manImage"></div>
            </div>
        </div>
    );

}

export default CartPage;