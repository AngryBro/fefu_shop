import './css/CartPosition.css';
import CartCounter from './CartCounter';
import PriceDiscount from './PriceDiscount';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import { useState } from 'react';
import Api from './Api';

const CartPosition = ({count, price, position, deletePosition}) => {

    var [deleteButtonColor, setDeleteButtonColor] = useState('#ADB1BB');

    return (
        <div className='CartPosition'>
            <div className='imagePreview' onClick={() => window.open(`/product/${position.slug}`)} style={{backgroundImage: `url(${Api().img(position.image_preview)})`}}></div>
            <div className='productInfo'>
                <div className='name' onClick={() => window.open(`/product/${position.slug}`)}>{position.name}</div>
                <div className='sizeBlock'>
                    <div className='title' style={{float: 'left'}}>Размер:</div>
                    <div className='size'>{position.size}</div>
                </div>
                <div className='countBlock'>
                    <div className='title'>Количество</div>
                    <div className='counter'>
                        <CartCounter count={{
                            increment: count.increment,
                            decrement: count.decrement,
                            position_id: position.position_id,
                            get: position.count,
                            min: position.count===1,
                            max: position[position.size]===position.count
                        }}/>
                    </div>
                </div>
                <div className='priceBlock'>
                    <div className='title'>Стоимость</div>
                    <div className='price'><PriceDiscount price={price} font={14}/></div>
                </div>
            </div>
            <div className='deleteButton' 
                onClick={() => deletePosition(position.position_id)}
                onMouseEnter={() => setDeleteButtonColor('#ff9797')}
                onMouseLeave={() => setDeleteButtonColor('#ADB1BB')}
            >
                <DeleteCartPositionSVG color={deleteButtonColor}/>
            </div>
        </div>
    );
};

export default CartPosition;