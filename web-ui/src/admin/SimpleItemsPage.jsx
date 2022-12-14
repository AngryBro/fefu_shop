import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../css/AdminPage.css';

const SimpleItemsPage = ({apiRoutes, tableHeaders = [], itemProps = [], title, deleteFailMsg = 'Не удалено'}) => {

    const navigate = useNavigate();
    
    const fetchData = () => {
        setFetchFlag(!fetchFlag);
    }

    const currentEditing = item => {
        return item.id===selectedId && editing;
    }

    const openEditForm = (item, key) => {
        setSelectedId(item.id);
        setEditing(true);
        setValue(item[key]);
    }

    const update = () => {
        var params = {id: selectedId};
        params[itemProps.find(e => e.editable).name] = value;
        Api(apiRoutes.update)
        .auth()
        .post(params)
        .callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        })
        .send();
    }
    const setCreateParams = (key, value) => {
        var temp = JSON.parse(JSON.stringify(newValue));
        temp[key] = value;
        setNewValue(temp);
    }
    const create = () => {
        Api(apiRoutes.create)
        .auth()
        .post(newValue)
        .callback(({ok}) => {
            if(ok) {
                fetchData();
                setNewValue({});
            }
        })
        .send();
    }
    const del = id => {
        Api(apiRoutes.delete)
        .auth()
        .post({id})
        .callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            if(status === 400) {
                alert(deleteFailMsg);
            }
        })
        .send();
    }

    var [fetchFlag, setFetchFlag] = useState(true);
    var [items, setItems] = useState([]);
    var [selectedId, setSelectedId] = useState(0);
    var [editing, setEditing] = useState(false);
    var [value, setValue] = useState('');
    var [loading, setLoading] = useState(true);
    var [newValue, setNewValue] = useState({});

    useEffect(() => {
        Api(apiRoutes.get)
        .auth()
        .callback(({ok, array, status}) => {
            if(status === 403) {
                return navigate('/404');
            }
            if(ok) {
                setItems(array);
                setValue('');
                setEditing(false);
            }
            setLoading(false);
        })
        .send();
    },[fetchFlag, navigate, apiRoutes.get]);

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>{title}</h1>
            <table>
                <tbody>
                    <tr>
                        <th>id</th>
                        {
                            tableHeaders.map(header => 
                                <th key={header}>{header}</th>    
                            )
                        }
                        <th hidden={!('delete' in apiRoutes)}>Удалить</th>
                    </tr>
                    <tr hidden={!('create' in apiRoutes)}>
                        <td><button onClick={create}>создать</button></td>
                        {
                            itemProps.map(prop =>
                                <td key={prop}>
                                    <input type="text" onChange={e => setCreateParams(prop.name, e.target.value)} value={prop.name in newValue?newValue[prop.name]:''} />
                                </td>    
                            )
                        }
                        <td></td>
                        <td hidden={!('delete' in apiRoutes)}></td>
                    </tr>
                    <tr hidden={!loading}>
                        <td style={{color: 'grey'}}>загрузка</td>
                        {
                            tableHeaders.map(header =>
                                <td key={header}></td>    
                            )
                        }
                        <td hidden={!('update' in apiRoutes)}></td>
                        <td hidden={!('delete' in apiRoutes)}></td>
                    </tr>
                    {
                        items.map(item => 
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                {
                                    itemProps.map(prop =>
                                        <td key={prop.name}>
                                            {
                                                prop.editable?
                                                (
                                                    currentEditing(item)?
                                                    <input type="text" onChange={e => setValue(e.target.value)} value={value} />:
                                                    item[prop.name]
                                                ):
                                                item[prop.name]
                                            }
                                        </td>    
                                    )
                                }
                                <td hidden={!('update' in apiRoutes)}>
                                    {
                                        currentEditing(item)?
                                        <button onClick={update}>сохранить</button>:
                                        <button onClick={() => openEditForm(item, itemProps.find(e => e.editable).name)}>изменить</button>
                                    }
                                </td>
                                <td hidden={!('delete' in apiRoutes)}>
                                    <button onClick={() => del(item.id)}>X</button>
                                </td>
                            </tr>    
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default SimpleItemsPage;