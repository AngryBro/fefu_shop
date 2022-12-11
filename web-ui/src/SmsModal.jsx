import { useState } from 'react';
import BigButton from './buttons/BigButton';
import './css/AuthModalWindow.css';
import './css/SmsModal.css';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import Api from './Api';

const SmsModal = ({phone, close ,setOpenedModalWindow, updateUserData, cartUpdate}) => {

    // const star = '*';
    const stars = '';

    const prevWindow = () => {
        setError(false);
        setOpenedModalWindow({type: 'phone', phone});
    }
    const send = () => {
        Api('sendSms').session().post({
            sms_code: smsCode
        })
        .callback(({ok, array, status}) => {
            if(ok) {
                setError(false);
                localStorage.setItem('Authorization', array.bearer_token);
                updateUserData();
                cartUpdate();
                close();
                setSmsCode('');
            }
            else {
                if(!ok) {
                    setError(true);
                }
            }
        }).send();
    }

    const mask = code => {
        var validated = '';
        for(let i = 0; i < Math.min(code.length, 4); i++) {
            if('0123456789'.indexOf(code[i])!==-1) {
                validated += code[i];
            }
        } 
        setSmsCode(validated);
    }

    var [smsCode, setSmsCode] = useState(stars);
    var [error, setError] = useState(false);

    return (
        <div className='AuthModalWindow' style={{display: 'flex'}}>
            <div className='modalWindowBlock'>
                <div className='modalWindowInnerBlock'>
                    <div className='modalWindowTitleText SmsModalTitle'>
                        Введите код
                    </div>
                    <div className='modalWindowDescriptionText SmsModalDescription'>
                        Мы отправили код на номер
                    </div>
                    <div className='SmsModalEditPhoneBlock'>
                        <div className='SmsModalPhone'>
                            {PhoneMaskGenerator(phone)}
                        </div>
                        <div className='SmsModalEditPhone' onClick={prevWindow}>
                            &#9998;
                        </div>
                    </div>
                    <div className='modalWindowInputBlock'>
                            <input type="text" className='SmsModalInput'
                                value={smsCode}
                                onChange={e => {
                                    var value = e.target.value;
                                    mask(value)
                                    }
                                }
                            />
                    </div>
                    <div className='modalWindowDescriptionText' hidden={!error}>
                        Код неверный, отправить <u style={{cursor:'pointer'}} onClick={prevWindow}>новый</u>
                    </div>
                    <div className='modalWindowButton' onClick={send}>
                        <BigButton text='Отправить код' font={14} />
                    </div>
                    <div className='modalWindowFooterText SmsModalFooter'>
                        Нажимая на кнопку, вы принимаете&nbsp;
                        <u>политику конфиденциальности</u>&nbsp;и&nbsp;
                        <u>пользовательское соглашение</u>
                    </div>
                </div>
                <div className='modalWindowClose' onClick={close}>
                    <DeleteCartPositionSVG color='#ADB1BB'/>
                </div>
            </div>
        </div>
    );

};

export default SmsModal;