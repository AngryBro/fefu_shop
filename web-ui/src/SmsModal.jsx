import { useState } from 'react';
import BigButton from './buttons/BigButton';
import './css/AuthModalWindow.css';
import './css/SmsModal.css';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';

const SmsModal = ({phone, type, close ,setOpenedModalWindow}) => {

    // const star = '*';
    const stars = '';

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

    return (
        <div className='AuthModalWindow' style={{display: type==='sms'?'flex':'none'}}>
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
                        <div className='SmsModalEditPhone' onClick={() => setOpenedModalWindow({type: 'phone', phone: phone})}>
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
                    <div className='modalWindowButton'>
                        <BigButton text='Отправить код' font={14} />
                    </div>
                    <div className='modalWindowFooterText SmsModalFooter'>
                        Вводя код, вы принимаете
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

export default SmsModal;