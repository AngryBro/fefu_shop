import './css/PriceDiscount.css';

const PriceDiscount = ({price, font = 24}) => {
    return (
        <div className='PriceDiscount'>
            <div className='old' hidden={price.old === price.new} style={{fontSize: `${Math.round(font*0.75)}px`}}>
                {price.old} &#8381;
            </div>
            <div className='new' style={{fontSize: `${font}px`}}>
                {price.new} &#8381;
            </div>
        </div>
    );
};

export default PriceDiscount;