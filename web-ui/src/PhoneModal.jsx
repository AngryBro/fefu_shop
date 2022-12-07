import { useState } from 'react';
import BigButton from './buttons/BigButton';
import './css/AuthModalWindow.css';
import './css/PhoneModal.css';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import Api from './Api';

const PhoneModal = ({phone, close, setOpenedModalWindow, errorMsg, smsTime}) => {

    const secondsFromSend = () => {
        var ms = new Date().getTime()-smsTime.get;
        ms = 60*1000 - ms;
        return ms>0?`${Math.floor(ms/1000/60)}`;
    }
    const nextWindow = () => setOpenedModalWindow({type: 'sms', phone: phoneNumber});
    const send = () => {
        Api('getSms').session().post({
            phone_number: phoneNumber.replace(/ /g,'').replace('+','').replace(/-/g,'').replace('(','').replace(')','')
        })
        .callback(({ok, array, error, status}) => {
            console.log(array);
            if(ok) {
                setError(false);
                nextWindow();
                localStorage.setItem('session', array.session);
            }
            else {
                if(status === 400) setError(true);
            }
            if(status === undefined) {
                errorMsg(error);
            }
        }).send();
    }
    const phoneValid = phone => phone.length === '+7 (000) 000-00-00'.length;

    var [phoneNumber, setPhoneNumber] = useState(phone);
    var [error, setError] = useState(false);

    return (
        <div className='AuthModalWindow' style={{display: 'flex'}}>
            <div className='modalWindowBlock' style={{width: '384px'}}>
                <div className='modalWindowInnerBlock'>
                    <div className='modalWindowTitleText PhoneModalTitle'>
                        Подтвердите номер телефона
                    </div>
                    <div className='modalWindowDescriptionText PhoneModalDescription'>
                        Мы отправим СМС с кодом подтверждения
                    </div>
                    <div className='modalWindowInputBlock' style={phoneValid(phoneNumber)||phoneNumber.length===0?{}:{border:'1px red solid'}}>
                        <input type="text" className='PhoneModal input'
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(PhoneMaskGenerator(e.target.value))}
                        />
                    </div>
                    <div className='modalWindowDescriptionText' hidden={!error}>
                        Код не отправлен
                    </div>
                    <div className='modalWindowButton'>
                        {
                            secondsFromSend()===0?
                            <BigButton callback={send} text={'Получить код'} font={14} disabled={!phoneValid(phoneNumber)}/>
                            :
                            <BigButton callback={send} text={`${Math.floor(secondsFromSend())}`} font={14} disabled={true}/>
                        }     
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