import './css/Total.css';
import PriceDiscount from './PriceDiscount';
import BigButton from './buttons/BigButton'; //&#8381;

const Total = ({params = [], title = 'Заголовок', total={}, button={}, marginLeft=0, fontParams='10px'}) => {

    return (
        <div className='Total'>
            <div className='TotalinfoBlock' style={{marginLeft, marginRight: marginLeft}}>
                <div className='TotalTitle'>{title}</div>
                <div className='TotalLineInfo'></div>
                {
                    params.map((param, index) => 
                        <div className='TotalParam' key={index}>
                            <div className='TotalSubTitle' style={{fontSize: fontParams}}>{param.title}</div>
                            <div className='TotalValue' style={{fontSize: fontParams}}>{param.value}</div>
                        </div>    
                    )
                }
                <div className='TotalLineInfo'></div>
                <div className='TotalPriceBlock'>
                    <div className='subTitleTotal'>{total.title}</div>
                    <div className='TotalPrice'>
                        <PriceDiscount price={total.value} font={total.font} />
                    </div>
                </div>
            </div>
            <div className='TotalButton' onClick={button.action}>
                <BigButton text={button.text} />
            </div>
        </div>
    );
};

export default Total;