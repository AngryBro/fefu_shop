import './css/AuthModalWindow.css';
import './css/PhoneModal.css';
import './css/CallbackForm.css';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import PhoneParse from './PhoneParse';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import BigButton from './buttons/BigButton';
import { useState } from 'react';
import Api from './Api';

const CallbackForm = ({close, userData, setOpenedModalWindow}) => {

    const [name, setName] = useState('name' in userData?userData.name:'');
    const [phone, setPhone] = useState('phone' in userData?PhoneParse(userData.phone):'');
    const [message, setMessage] = useState('');
    const [tryCreate, setTryCreate] = useState(false);
    const [waiting, setWaiting] = useState(false); console.log(message);

    const phoneParse = phone => {
        return phone.replace('+','').replace('(','').replace(')','').replace(/-/g, '').replace(/ /g, '');
    };
    const phoneValid = phone => {
        return phoneParse(phone).length === 11 || (phone.length===0 && !tryCreate);
    }
    const messageValid = message => {
        return !tryCreate || message.length;
    }

    const create = () => {
        setTryCreate(true);
        var params = {};
        if(message.length===0 || phoneParse(phone).length !== 11) {
            return;
        }
        if(name.length) {
            params.name = name;
        }
        params.phone_number = phone;
        params.message = message;
        setWaiting(true);
        Api('callbackCreate').post(params).callback(({ok}) => {
            close();
            setWaiting(false);
            setOpenedModalWindow({type:'notification', message: ok?'Ваше сообщение отправлено':'Ошибка отправки'});
        }).send();
    };

    return (
        <div className='AuthModalWindow' style={{display: 'flex'}}>
            <div className='modalWindowBlock' style={{width:'370px'}}>
                <div className='modalWindowInnerBlock'>
                    <div className='modalWindowTitleText PhoneModalTitle CallbackFormHeader'>
                        Обратная связь
                    </div>
                    <div>
                        <Label onchangeHandle={setName} name='Имя' value={name} />
                    </div>
                    <div>
                        <Label onchangeHandle={phone => setPhone(PhoneMaskGenerator(phone))} error={!phoneValid(phone)} name='Телефон' required={true} value={phone} />
                    </div>
                    <div>
                        <Label onchangeHandle={setMessage} error={!messageValid(message)} textarea={true} name='Сообщение' required={true} value={message} />
                    </div>
                    <div className='modalWindowButton'>
                        <BigButton callback={create} text='Отправить' font={14} disabled={waiting}/>    
                    </div>
                    <div className='modalWindowFooterText PhoneModalFooter'>
                        Нажимая на кнопку "Отправить", вы принимаете&nbsp;
                        <u onClick={() => window.open('/info/agreement')} style={{cursor:'pointer'}}>пользовательское соглашение</u>
                        &nbsp;и&nbsp;
                        <u onClick={() => window.open('/info/confidentials')} style={{cursor:'pointer'}}>политику конфиденциальности</u>
                    </div>
                </div>
                <div className='modalWindowClose' onClick={close}>
                    <DeleteCartPositionSVG color='#ADB1BB'/>
                </div>
            </div>
        </div>
    );

};

const Label = ({textarea = false, name, onchangeHandle, value, required = false, error = false}) => {
    
    const [focus, setFocus] = useState(false);

    return (
        <div className='CallbackFormLabel'>
            <div className='CallbackFormLabelName'>{name}{required?<span style={{color:'#FF0000'}}>*</span>:<></>}</div>
            <div style={error?{border:'1px solid red'}:{}} className={focus?'CallbackFormInputBlockFocus':'CallbackFormInputBlock'}>
                {
                    textarea?<div className='textarea' contentEditable={true} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{height: 'fit-content'}} value={value} onInput={e => onchangeHandle(e.target.innerHTML.replace(/<\/div>/g,'').replace(/<div>/g,'\n'))} />:<input onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onChange={e => onchangeHandle(e.target.value)} value={value} />
                }
            </div>
        </div>
    );
};

export default CallbackForm;