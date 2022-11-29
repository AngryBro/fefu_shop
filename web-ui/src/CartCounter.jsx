import './css/CartCounter.css';

const CartCounter = ({count, debug}) => {

    return (
        <div className='CartCounter'>
            <div className='blockCounter'>
                <div className='edgeBlock' onClick={() => count.decrement(count.position_id)}>
                    <div className='xcrement'>-</div>
                </div>
                <div className='innerBlock'>
                    <div className='countCounter'>{count.get}</div>
                </div>
                <div className='edgeBlock' onClick={() => count.increment(count.position_id)}>
                    <div className='xcrement'>+</div>
                </div>
            </div>
        </div>
    );

};

export default CartCounter;