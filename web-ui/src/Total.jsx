import './css/Total.css';
import PriceDiscount from './PriceDiscount';
import BigButton from './buttons/BigButton'; //&#8381;

const Total = ({params = [], title = 'Заголовок', total={}, button={}, marginLeft=0, fontParams='10px'}) => {

    return (
        <div className='Total'>
            <div className='infoBlock' style={{marginLeft, marginRight: marginLeft}}>
                <div className='title'>{title}</div>
                <div className='lineInfo'></div>
                {
                    params.map((param, index) => 
                        <div className='param' key={index}>
                            <div className='subTitle' style={{fontSize: fontParams}}>{param.title}</div>
                            <div className='value' style={{fontSize: fontParams}}>{param.value}</div>
                        </div>    
                    )
                }
                <div className='lineInfo'></div>
                <div className='total'>
                    <div className='subTitleTotal'>{total.title}</div>
                    <div className='price'>
                        <PriceDiscount price={total.value} font={total.font} />
                    </div>
                </div>
            </div>
            <div className='button'>
                <BigButton text={button.text} />
            </div>
        </div>
    );
};

export default Total;