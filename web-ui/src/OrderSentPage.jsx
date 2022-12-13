import { useNavigate, useSearchParams } from 'react-router-dom';
import BigButton from './buttons/BigButton';
import './css/OrderSentPage.css';
import OrderSentSVG from './svg/OrderSentSVG';

const OrderSentPage = () => {

    const navigate = useNavigate();
    const number = useSearchParams()[0];

    return (
        <div className='OrderSentPage'>
            <div className='block'>
                <div className='row'><div className='svg'><OrderSentSVG/></div></div>
                <div className='row'><div className='hightext'>Заявка №{number.get('number')} успешно отправлена!</div></div>
                <div className='row'><div className='lowtext'>Спасибо за заявку, скоро с вами свяжется наш менеджер</div></div>
                <div className='row'>
                    <div className='button'>
                        <BigButton text='На главную' callback={() => navigate('/')} />
                    </div>
                </div>
            </div> 
            
        </div>
    );
};

export default OrderSentPage;