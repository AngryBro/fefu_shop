import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../css/AdminPage.css';
import ImageLoader from './ImageLoader';

const ConfigPage = () => {

    const navigate = useNavigate();
    const fetchData = () => setFetchFlag(!fetchFlag);
    const loadSlideImage = (array, index) => {
        var temp = JSON.parse(JSON.stringify(slides));
        temp[index].image = array.tempname;
        setSlides(temp);
        setSlideEdited(true);
    }
    const slideLink = (link, index) => {
        var temp = JSON.parse(JSON.stringify(slides));
        temp[index].link = link;
        setSlides(temp);
        setSlideEdited(true);
    }
    const slideBlank = (value, index) => {
        var temp = JSON.parse(JSON.stringify(slides));
        temp[index].blank = Boolean(Number(value));
        setSlides(temp);
        setSlideEdited(true);
    }
    const deleteSlide = index => {
        var temp = JSON.parse(JSON.stringify(slides));
        temp.splice(index,1);
        setSlides(temp);
        setSlideEdited(true);
    }
    const addSlide = () => {
        var temp = JSON.parse(JSON.stringify(slides));
        temp.push({image:null, link: ''});
        setSlides(temp);
        setSlideEdited(true);
    }

    const saveSlides = () => {
        Api('configUpdate').auth().post({name: 'slide', value: slides}).callback(({ok}) => {
            if(ok) {
                fetchData();
            }
            else {
                alert('Неверные данные')
            }
        }).send();
    }
    const savePoint = () => {
        Api('configUpdate').auth().post({name: 'pickup_point', value: {adress, time}}).callback(({ok}) => {
            if(ok) {
                fetchData();
            }
            else {
                alert('Неверные данные')
            }
        }).send();
    }
    const saveEmail = () => {
        Api('configUpdate').auth().post({name: 'email', value: [email]}).callback(({ok}) => {
            if(ok) {
                fetchData();
            }
            else {
                alert('Неверные данные')
            }
        }).send();
    }
    

    var [fetchFlag, setFetchFlag] = useState(true);

    var [slideEdited, setSlideEdited] = useState(false);
    var [emailEdited, setEmailEdited] = useState(false);
    var [pointEdited, setPointEdited] = useState(false);

    var [slides, setSlides] = useState([]);

    var [email, setEmail] = useState('');

    var [time, setTime] = useState('');
    var [adress, setAdress] = useState('');

    useEffect(() => {
        Api('configAll').auth().callback(({ok, array}) => {
            if(ok) {
                setSlideEdited(false);
                setPointEdited(false);
                setEmailEdited(false);
                array.forEach(item => {
                    switch(item.name) {
                        case 'pickup_point': {
                            setAdress(item.value.adress);
                            setTime(item.value.time);
                            break;
                        }
                        case 'email': {
                            setEmail(item.value[0]);
                            break;
                        }
                        case 'slide': {
                            setSlides(item.value);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
            }
        }).send();
    }, [fetchFlag]);
    

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>Настройки</h1>
            <div className='menu'>
                <table>
                    <caption><h3>Слайдер на главной странице</h3></caption>
                    <tbody>
                        <tr hidden={slides.length!==0}>
                            <td style={{color:'grey'}}>загрузка</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Удалить</th>
                            <th>Изображение 1248х346</th>
                            <th>Ссылка</th>
                            <th>В новой вкладке</th>
                        </tr>
                        {
                            slides.map((slide,index) =>
                                <tr key={index}>
                                    <td><button onClick={() => deleteSlide(index)}>&#10006;</button></td>
                                    <td><ImageLoader width='300px' height='83px' images={[slide.image]} okCallback={array => loadSlideImage(array, index)}/></td>
                                    <td>
                                        <input style={{width:'500px'}} value={slide.link} onChange={e => slideLink(e.target.value, index)} />
                                    </td>
                                    <td style={{width:'20px'}}>
                                        <select value={Number(slide.blank)} onChange={e => slideBlank(e.target.value, index)}>
                                            <option value="1">Да</option>
                                            <option value="0">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                            )
                        }
                        <tr>
                            <td><button onClick={addSlide}>добавить</button></td>
                            <td></td>
                            <td></td>
                            <td>{slideEdited?<button onClick={saveSlides}>сохранить</button>:<></>}</td>
                            
                        </tr>
                    </tbody>
                </table>
                <table className='borderTable'>
                    <caption><h3>Точка самовывоза</h3></caption>
                    {
                        slides.length===0?<tbody><tr><td style={{color:'grey'}}>загрузка</td><td style={{width:'200px'}}></td></tr></tbody>:
                    <tbody>
                        <tr>
                            <th>Адрес:</th>
                            <td><input style={{width:'500px'}} value={adress} onChange={e => {setAdress(e.target.value); setPointEdited(true)}} /></td>
                        </tr>
                        <tr>
                            <th style={{width:'200px'}}>Время работы:</th>
                            <td><input style={{width:'500px'}} value={time} onChange={e => {setTime(e.target.value); setPointEdited(true)}} /></td>
                        </tr>
                        {
                            pointEdited?
                            <tr>
                                <th></th>
                                <td><button onClick={savePoint}>сохранить</button></td>
                            </tr>:<></>
                        }
                    </tbody>
                    }
                </table>
                <table className='borderTable'>
                    <caption><h3>E-mail для принятия заказов</h3></caption>
                    {
                        slides.length===0?<tbody><tr><td style={{color:'grey'}}>загрузка</td><td style={{width:'200px'}}></td></tr></tbody>:
                    <tbody>
                        <tr>
                            <th>E-mail:</th>
                            <td><input style={{width:'500px'}} value={email} onChange={e => {setEmail(e.target.value); setEmailEdited(true)}} /></td>
                        </tr>
                        {
                            emailEdited?
                            <tr>
                                <td></td>
                                <td><button onClick={saveEmail}>сохранить</button></td>
                            </tr>:<></>
                        }
                    </tbody>
                    }
                </table>
                
            </div>
            <div>
                
            </div>
        </div>
    );
};

export default ConfigPage;