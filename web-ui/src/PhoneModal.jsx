import { useState } from 'react';
import BigButton from './buttons/BigButton';
import './css/AuthModalWindow.css';
import './css/PhoneModal.css';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import Api from './Api';

const PhoneModal = ({phone, close, type, setOpenedModalWindow}) => {

    const send = () => {
        Api('getSms').session().post({
            phone_number: phoneNumber.replace(/ /g,'').replace('+','').replace(/-/g,'').replace('(','').replace(')','')
        }).callback(({ok, array}) => {
            console.log(array);
            if(ok) {
                setOpenedModalWindow({type: 'sms', phone: phoneNumber});
                localStorage.setItem('session', array.session);
            }
        }).send();
    }

    var [phoneNumber, setPhoneNumber] = useState(phone);

    return (
        <div className='AuthModalWindow' style={{display: type==='phone'?'flex':'none'}}>
            <div className='modalWindowBlock' style={{width: '384px'}}>
                <div className='modalWindowInnerBlock'>
                    <div className='modalWindowTitleText PhoneModalTitle'>
                        Подтвердите номер телефона
                    </div>
                    <div className='modalWindowDescriptionText PhoneModalDescription'>
                        Мы отправим СМС с кодом подтверждения
                    </div>
                    <div className='modalWindowInputBlock'>
                        <input type="text" className='PhoneModal input'
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(PhoneMaskGenerator(e.target.value))}
                        />
                    </div>
                    <div className='modalWindowButton' onClick={send}>
                        <BigButton text='Отправить код' font={14} />
                    </div>
                    <div className='modalWindowFooterText PhoneModalFooter'>
                        Нажимая на кнопку, вы принимаете
                        политику конфиденциальности
                        и
                        пользовательское соглашение
                    </div>
                </div>
                <div className='modalWindowClose' onClick={close}>
                    <DeleteCartPositionSVG color='#ADB1BB'/>
                </div>
            </div>
        </div>
    );

};

export default PhoneModal;