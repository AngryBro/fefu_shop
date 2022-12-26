import './css/DeliverySelect.css';
import SelectCircleSVG from './svg/CircleSelectedSVG';

const DeliverySelect = ({selected, delivery, adress}) => {

    return (
        <div className='DeliverySelect'>
            <div className='circleBlock'>
                <div className='circle'>
                    <SelectCircleSVG selected={selected} />
                </div>
            </div>
            <div className='textBlock'>
                {
                    delivery?
                    <div className='delivery' style={{color: selected?'#323540':'#616575'}}>
                        Мне нужна доставка
                    </div>:
                    <div className='pickupBlock'>
                        <div className='text' style={{color: selected?'#323540':'#616575'}}>Самовывоз из шоурума</div>
                        <div className='adress'>{`${adress.adress}. ${adress.time}`}</div>
                    </div>
                }
            </div>
        </div>
    );

};

export default DeliverySelect;