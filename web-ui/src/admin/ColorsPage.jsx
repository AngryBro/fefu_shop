import { useEffect } from 'react';
import { useState } from 'react';
import '../css/AdminPage.css';
import Api from '../Api';
import {ChromePicker} from 'react-color';
import { useNavigate } from 'react-router-dom';

const ColorsPage = () => {

    const navigate = useNavigate();

    const fetchData = () => {
        setFetchFlag(!fetchFlag);
    }

    const parseRgb = rgbString => {
        var splited = rgbString.split(',');
        return {r: splited[0], g: splited[1], b: splited[2]};
    }

    const update = () => {
        Api('colorUpdate').auth().post({
            name: updateData.name,
            article: updateData.code,
            id: editingId,
            rgb: 'rgb' in updateData?`${updateData.rgb.r},${updateData.rgb.g},${updateData.rgb.b}`:undefined
        })
        .callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        }).send();
    }

    const del = id => {
        Api('colorDelete').auth().post({id}).callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            if(status===400) {
                alert('Такой цвет есть у товаров');
            }
        }).send();
    }

    const create = () => {
        Api('colorCreate').auth().callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            if(status === 422) {
                alert('Некорректные данные');
            }
        }).post({
            name: newName,
            article: newCode,
            rgb: `${newColor.r},${newColor.g},${newColor.b}`
        }).send();
    }

    const handleChangeComplete = (color) => {
        setNewData('rgb',color.rgb);
    }

    const handleChangeCompleteNew = (color) => {
        setNewColor(color.rgb);
    }

    const setNewData = (key, value) => {
        var temp = JSON.parse(JSON.stringify(updateData));
        temp[key] = value;
        setUpdateData(temp);
    }

    var [loading, setLoading] = useState(true);//eslint-disable-next-line
    var [fetchFlag, setFetchFlag] = useState(false);
    var [colors, setColors] = useState([]);
    var [updateData, setUpdateData] = useState({});
    var [newColor, setNewColor] = useState({r:0, g: 0, b: 0});
    var [newName, setNewName] = useState('');
    var [newCode, setNewCode] = useState('');
    var [editingId, setEditingId] = useState(0);
    var [openedCreateColorPicker, setOpenedCreateColorPicker] = useState(false);


    useEffect(() => {
        Api('colors').auth().callback(({ok, array}) => {
            if(ok) {
                setColors(array);
            }
            setLoading(false);   
            setEditingId(0);
            setUpdateData({});
            setNewCode('');
            setNewName('');
            setOpenedCreateColorPicker(false);
        })
        .send();
    }, [fetchFlag]);

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>Цвета</h1>
            <table>
                <tbody>
                    <tr>
                        <th>id</th>
                        <th>Название</th>
                        <th>Код</th>
                        <th>Цвет</th>
                        <th>Редактировать</th>
                        <th>Удалить</th>
                    </tr>
                    <tr>
                        <td><button onClick={create}>Создать</button></td>
                        <td><input type="text" value={newName} onChange={e => setNewName(e.target.value)} onBlur={() => setOpenedCreateColorPicker(false)}/></td>
                        <td><input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} onBlur={() => setOpenedCreateColorPicker(false)}/></td>
                        <td>
                            {
                                openedCreateColorPicker?
                                <ChromePicker onChangeComplete={handleChangeCompleteNew} color={newColor}/>:
                                <div onClick={() => setOpenedCreateColorPicker(true)}  style={{border:'grey solid 1px', width:'100%', height:'20px', display:'flex', cursor:'pointer'}}> <div style={{margin:'auto'}}>&#9999;</div> </div>
                            }
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr hidden={!loading}>
                        <td style={{color:'grey'}}>загрузка</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    {
                        colors.map(color => 
                            <tr key={color.id}>
                                <td>{color.id}</td>
                                {
                                    ['name', 'article'].map(prop =>
                                        <td key={prop}>
                                            {
                                                editingId===color.id?
                                                <input type="text" value={prop in updateData?updateData[prop]:color[prop]} onChange={e => setNewData(prop, e.target.value)} />:
                                                color[prop]
                                            }
                                        </td>    
                                    )
                                }
                                <td>
                                    {
                                        editingId===color.id?
                                        <ChromePicker color={'rgb' in updateData?updateData.rgb:parseRgb(color.rgb)} onChangeComplete={handleChangeComplete} />
                                        :<div style={{backgroundColor:`rgb(${color.rgb})`, width:'100%',height:'20px',border:'grey solid 1px'}}></div>
                                    }
                                </td>
                                <td>
                                    {
                                        editingId===color.id?
                                        <button onClick={update}>сохранить</button>:
                                        <button onClick={() => {setEditingId(color.id); setUpdateData({})}}>изменить</button>
                                    }
                                </td>
                                <td><button onClick={() => del(color.id)}>X</button></td>
                            </tr>    
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ColorsPage;