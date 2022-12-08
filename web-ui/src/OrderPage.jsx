import './css/OrderPage.css';
import Total from './Total';
import PageRoute from './PageRoute';
import { useState } from 'react';
import FormLabel from './FormLabel';
import DeliverySelect from './DeliverySelect';
import PhoneMaskGenerator from './PhoneMaskGenerator';
import Api from './Api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderPage = ({userData, cart, setOpenedModalWindow}) => {

    const navigate = useNavigate();

    const validateEmail = email => email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const validateRequired = field => field.length > 0 && field !== null;
    const validateIndex = index => {
        var flag = true;
        for(let i = 0; i < index.length; i++) {
            if('0123456789'.indexOf(index[i])===-1) {
                flag = false;
            }
        }
        return flag && index.length === 6;
    }

    const create = () => {
        if(!userData.authed) {
            return setOpenedModalWindow({type: 'phone', phone});
        }
        
        Api('orderCreate').auth().callback(({ok, status}) => {
            if(ok) {
                cart.update();
                navigate('/');
            }
            else {
                if(status === 422) {
                    setShowErrors(true);
                }
                else {
                    navigate('/cart');
                }
            }
        })
        .post({
            name,
            email,
            delivery,
            city,
            street,
            building,
            apartment,
            index: Number(index),
            comment
        })
        .send();
    }

    var [name, setName] = useState('');
    var [phone, setPhone] = useState('');
    var [email, setEmail] = useState('');
    var [delivery, setDelivery] = useState(true);
    var [index, setIndex] = useState('');
    var [city, setCity] = useState('');
    var [street, setStreet] = useState('');
    var [building, setBuilding] = useState('');
    var [apartment, setApartment] = useState('');
    var [comment, setComment] = useState(null);
    var [showErrors, setShowErrors] = useState(false);

    var [commentFocus, setCommentFocus] = useState(false);

    useEffect(() => {
        setName(n => userData.authed&&userData.name!==undefined?userData.name:n);
        setPhone(p => userData.authed?('+'+userData.phone):p);
        setEmail(e => userData.authed&&userData.email!==undefined?userData.email:e);

    }, [userData]);

    return (
        <div className='OrderPage'>
            <div className='route'>
                <PageRoute back={true} route={[
                    {name: 'Вернуться в корзину', link: '/cart'},
                    {name: 'Оформление заказа'}
                ]} />
            </div>
            <div className='block'>
                <div className='data'>
                    <div className='name'>
                        <FormLabel
                            data={'name' in userData?{get: userData.name, set: () => 1}:{get: name, set: setName}}
                            labelName='Имя'
                            disabled={'name' in userData}
                        />
                    </div>
                    <div className='phone'>
                        <FormLabel
                            data={{get: phone, set: (number) => setPhone(PhoneMaskGenerator(number))}}
                            labelName='Телефон*'
                            disabled={'phone' in userData}
                            showError={showErrors}
                            validation={validateRequired}
                        />
                    </div>
                    <div className='email'>
                        <FormLabel
                            data={{get: email, set: setEmail}}
                            labelName='E-mail'
                            disabled={'email' in userData}
                            showError={showErrors}
                            validation={validateEmail}
                        />
                    </div>
                    <div className='getType'>
                        <div className='selectName'>Способ получения</div>
                        <div className='pickup' onClick={() => setDelivery(false)}>
                            <DeliverySelect delivery={false} selected={!delivery} />
                        </div>
                        <div className='delivery' onClick={() => setDelivery(true)}>
                            <DeliverySelect delivery={true} selected={delivery}/>
                        </div>
                    </div>
                    <div hidden={!delivery}>
                    <div className='leftRightBlock'>
                        <div className='left'>
                            <FormLabel
                                labelName='Почтовый индекс*'
                                data={{get: index, set: setIndex}}
                                showError={showErrors}
                                validation={e => validateIndex(e) && validateRequired(e)}
                            />
                        </div>
                        <div className='right'>
                            <FormLabel 
                                labelName='Населённый пункт*'
                                data={{get: city, set: setCity}} 
                                suggestionsParams={{use: true, more: [], key: 'city', minLength: 3}}
                                showError={showErrors}
                                validation={validateRequired}
                            />
                        </div>
                    </div>
                    <div className='street'>
                        <FormLabel
                            labelName='Улица*'
                            data={{get: street, set: setStreet}}
                            suggestionsParams={{use: true, more: [city], key: 'street', minLength:3}}
                            showError={showErrors}
                            validation={validateRequired}
                        />
                    </div>
                    <div className='leftRightBlock'>
                        <div className='left'>
                            <FormLabel
                                labelName='Дом*'
                                data={{get: building, set: setBuilding}}
                                suggestionsParams={{use: true, more: [city, street], key:'house',minLength: 1}}
                                showError={showErrors}
                                validation={validateRequired}
                            />
                        </div>
                        <div className='right'>
                            <FormLabel
                                labelName='Квартира / офис'
                                data={{get: apartment, set: setApartment}}
                            />
                        </div>
                    </div>
                    </div>
                    <div className='comment'>
                        <div className='selectName'>Комментарий</div>
                        <div
                            className={commentFocus?'textareaBlockFocus':'textareaBlock'}
                            onFocus={() => setCommentFocus(true)}
                            onBlur={() => setCommentFocus(false)}
                        >
                            <textarea value={comment===null?'':comment} onChange={e => setComment(e.target.value)}></textarea>
                        </div>
                    </div>
                </div>
                <div className='totalInfo'>
                    <Total
                        title='Ваш заказ'
                        total={{
                            title: 'Итого',
                            font: 16,
                            value: {
                                old: cart.sum,
                                new: cart.sum
                            }
                        }}
                        marginLeft='24px'
                        button={{
                            text: 'Отправить заявку',
                            action: create
                        }}
                        params={[
                            {title: 'Кол-во товаров:', value: `${cart.count} шт`},
                            {title: 'Сумма:', value: `${cart.sum} ₽`}
                        ]}
                        fontParams='14px'
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderPage;