import './css/CartCounter.css';

const CartCounter = ({count}) => {

    return (
        <div className='CartCounter'>
            <div className='blockCounter'>
                <div style={{display: count.min?'none':'flex'}} className='edgeBlock' onClick={() => count.decrement(count.position_id)}>
                    <div className='xcrement'>-</div>
                </div>
                <div style={{display: !count.min?'none':'flex'}} className='edgeBlockNone'>
                    
                </div>
                <div className='innerBlock'>
                    <div className='countCounter'>{count.get}</div>
                </div>
                <div style={{display: count.max?'none':'flex'}} className='edgeBlock' onClick={() => count.increment(count.position_id)}>
                    <div className='xcrement'>+</div>
                </div>
                <div style={{display: !count.max?'none':'flex'}} className='edgeBlockNone'>
                    
                </div>
            </div>
        </div>
    );

};

export default CartCounter;