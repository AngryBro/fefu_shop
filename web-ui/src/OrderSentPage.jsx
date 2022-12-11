import { useNavigate, useSearchParams } from 'react-router-dom';
import BigButton from './buttons/BigButton';
import './css/OrderPage.css';

const OrderSentPage = () => {

    const navigate = useNavigate();
    const number = useSearchParams()[0];

    return (
        <div className='OrderPage'>
            <div className='block' style={{display:'flex', height:'700px'}}>
                <div style={{width:'fit-content',height:'fit-content', marginTop:'100px', marginLeft:'400px'}}>
                    <div style={{width:'100%', height:'fit-content', display:'flex'}}>
                        <span style={{margin:'auto', fontSize:'20pt'}}>Ваш заказ №{number.get('number')} успешно оформлен.</span>
                    </div>
                    <div style={{margin:'auto', width:'150px', height:'48px',marginTop:'40px'}}>
                        <BigButton text='На главную' callback={() => navigate('/')} />
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default OrderSentPage;