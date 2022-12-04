import './css/CartPage.css';
import PageRoute from './PageRoute';
import { useState, useEffect } from 'react';
import CartPosition from './CartPosition';
import Total from './Total';
import Api from './Api';
import { useNavigate } from 'react-router-dom';

const CartPage = ({cart}) => {

    const navigate = useNavigate();

    var [loaded, setLoaded] = useState(false);
    var [found, setFound] = useState(false);
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
        Api('cartDelete').auth().session().callback(({ok}) => {
            if(ok) {
                var temp = [];
                for(let i = 0; i < positions.length; i++) {
                    if(positions[i].position_id === id) continue;
                        temp.push(positions[i]);
                }
                if(!temp.length) {
                    setFound(false);
                }
                setPositions(temp);
                cart.update();
            }
        })
        .post({position_id: id})
        .send();
    }

    var increment = id => {
        Api('cartInc').auth().session().callback(({ok,array}) => {
            if(ok) {
                var temp = positions.slice();
                var position = temp.find(e => e.position_id === id);
                position.count++;
                setPositions(temp);
                cart.update();
            }
        })
        .post({position_id: id})
        .send();
    }

    var decrement = id => {
        Api('cartDec').auth().session().callback(({ok}) => {
            if(ok) {
                var temp = positions.slice();
                var position = temp.find(e => e.position_id === id);
                position.count--;
                setPositions(temp);
                cart.update();
            }
        })
        .post({position_id: id})
        .send();
    }

    useEffect(() => { 
        cart.update();
        Api('cartGet').auth().session().callback(({ok, array, status}) => {
            if(ok) {
                setPositions(array);
                setLoaded(true);
                setFound(true);
            }
            if(status === 404 || status === 401) {
                setLoaded(true);
                setFound(false);
            }
        }).send();// eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     cart.update();
    // },[cart]);

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
                                />
                                <div className='line' hidden={index===positions.length-1}></div>
                            </div>
                        )
                    }
                </div>
                <div className='info'>
                    <Total
                    marginLeft='16px'
                    title='Ваша корзина'
                    params={[
                        {title: 'Количество товаров:', value: `${positions.length} шт`},
                        {title: 'Сумма:', value: `${sum()} ₽`},
                        {title: 'Сумма скидок:', value: `${sumDiscounts()} ₽`}
                    ]}
                    total={{
                        title: 'Итого',
                        value: sumTotal(),
                        font: 14
                    }}
                    button={{
                        text: 'Оформить заказ',
                        action: () => navigate('/order')
                    }}
                    fontParams='12px'
                    />
                </div>
            </div>

            <div className="productsNotFound" hidden={found||!loaded}>
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