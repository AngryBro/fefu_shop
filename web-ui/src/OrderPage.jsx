import './css/OrderPage.css';
import Total from './Total';
import PageRoute from './PageRoute';
import { useState } from 'react';
import FormLabel from './FormLabel';
import DeliverySelect from './DeliverySelect';
import PhoneMaskGenerator from './PhoneMaskGenerator';

const OrderPage = ({userData, cart}) => {

    var [name, setName] = useState(('name' in userData)?userData.name:'');
    var [phone, setPhone] = useState(userData.authed?userData.phone:'');
    var [email, setEmail] = useState(('email' in userData)?userData.email:'');
    var [delivery, setDelivery] = useState(true);
    var [index, setIndex] = useState('');
    var [city, setCity] = useState('');
    var [street, setStreet] = useState('');
    var [building, setBuilding] = useState('');
    var [apartment, setApartment] = useState('');
    var [comment, setComment] = useState('');

    var [commentFocus, setCommentFocus] = useState(false);


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
                        />
                    </div>
                    <div className='email'>
                        <FormLabel
                            data={{get: email, set: setEmail}}
                            labelName='E-mail'
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
                            />
                        </div>
                        <div className='right'>
                            <FormLabel 
                                labelName='Населённый пункт*'
                                data={{get: city, set: setCity}} 
                                suggestionsParams={{use: true, more: [], key: 'city', minLength: 3}}
                            />
                        </div>
                    </div>
                    <div className='street'>
                        <FormLabel
                            labelName='Улица*'
                            data={{get: street, set: setStreet}}
                            suggestionsParams={{use: true, more: [city], key: 'street', minLength:3}}
                        />
                    </div>
                    <div className='leftRightBlock'>
                        <div className='left'>
                            <FormLabel
                                labelName='Дом*'
                                data={{get: building, set: setBuilding}}
                                suggestionsParams={{use: true, more: [city, street], key:'house',minLength: 1}}
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
                            <textarea onChange={e => setComment(e.target.value)}></textarea>
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
                            text: 'Отправить заявку'
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