import { useEffect, useState } from 'react';
import BigButton from './buttons/BigButton';
import './css/AuthModalWindow.css';
import './css/PhoneModal.css';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import Api from './Api';

const PhoneModal = ({phone, close, setOpenedModalWindow, errorMsg, smsTime}) => {

    const nextWindow = () => setOpenedModalWindow({type: 'sms', phone: phoneNumber});
    const send = () => {
        Api('getSms').session().post({
            phone_number: phoneNumber.replace(/ /g,'').replace('+','').replace(/-/g,'').replace('(','').replace(')','')
        })
        .callback(({ok, array, error, status}) => {
            if(ok) {
                setError(false);
                nextWindow();
                smsTime.set(new Date().getTime());
                localStorage.setItem('session', array.session);
            }
            else {
                if(status === 400 || status === 401) setError(true);
            }
            if(status === undefined) {
                errorMsg(error);
            }
        }).send();
    }
    const phoneValid = phone => phone.length === '+7 (000) 000-00-00'.length;
    const timeString = (seconds) => {
        return `${Math.floor(seconds/60)}:${seconds%60<10?'0':''}${seconds%60}`;
    }

    var [phoneNumber, setPhoneNumber] = useState(phone);
    var [error, setError] = useState(false);
    var [seconds, setSeconds] = useState(0);

    useEffect(() => {
        var timeGone = new Date().getTime()-smsTime.get;
        if(timeGone < 60*1000) {
            setSeconds(60-Math.ceil(timeGone/1000));
        }
        var timer = setInterval(() => setSeconds(s => s>0?s-1:0),1000);
        return () => clearInterval(timer);
    }, [smsTime.get]);

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
                        <BigButton callback={send} text={seconds>0?timeString(seconds):'Получить код'} font={14} disabled={!phoneValid(phoneNumber)||seconds>0}/>    
                    </div>
                    <div className='modalWindowFooterText PhoneModalFooter'>
                        Нажимая на кнопку, вы принимаете&nbsp;
                        <u onClick={() => window.open('/info/confidentials')} style={{cursor:'pointer'}}>политику конфиденциальности</u>&nbsp;и&nbsp;
                        <u onClick={() => window.open('/info/agreement')} style={{cursor:'pointer'}}>пользовательское соглашение</u>
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