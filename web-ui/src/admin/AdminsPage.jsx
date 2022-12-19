import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../css/AdminPage.css';

const AdminsPage = () => {

    const navigate = useNavigate();
    const emptyAdmin = useMemo(() => ({
        name: '',
        phone_number: '',
        email: ''
    }), []);
    const currentEditing = (admin) => {
        return editFormOpened&&admin.id===selectedId;
    }
    const openEditForm = admin => {
        setSelectedId(admin.id);;
        setEmail(admin.email);
        setName(admin.name);
        setEditFormOpened(true);
    }
    const edit = () => {
        Api('adminEdit')
        .post({name, email, id: selectedId})
        .callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        })
        .auth()
        .send();
    }
    const deleteAdmin = admin => {
        Api('adminDelete')
        .auth()
        .post({id: admin.id})
        .callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        })
        .send();
    }
    const create = () => {
        Api('adminCreate')
        .post(newAdmin)
        .auth()
        .callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            else {
                switch(status) {
                    case 400: {
                        alert('Пользователь с таким email уже есть');
                        break;
                    }
                    case 422: {
                        alert('Некорректные данные');
                        break;
                    }
                    default: {
                        alert('Неизвестная ошибка');
                    }
                }
            }

        })
        .send();
    }
    const fetchData = () => {
        setFetchFlag(!fetchFlag);
    }

    const appendNewAdmin = (key, e) => {
        var temp = JSON.parse(JSON.stringify(newAdmin));
        temp[key] = e.target.value;
        setNewAdmin(temp);
    }

    var [editFormOpened, setEditFormOpened] = useState(false);
    var [selectedId, setSelectedId] = useState(0);
    var [email, setEmail] = useState('');
    var [name, setName] = useState('');
    var [admins, setAdmins] = useState([]);
    var [newAdmin, setNewAdmin] = useState(emptyAdmin);
    var [fetchFlag, setFetchFlag] = useState(true);
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        Api('adminsAll')
        .auth()
        .callback(({ok, array}) => {
            if(ok) {
                setAdmins(array);
                setEditFormOpened(false);
                setNewAdmin(emptyAdmin);
            }
            setLoading(false);
        })
        .send();
    },[fetchFlag, emptyAdmin]);

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>Администраторы</h1>
            <table>
                <tbody>
                    <tr>
                        <th>id</th>
                        <th>Телефон</th>
                        <th>E-mail</th>
                        <th>Имя</th>
                        <th>Дата изменения</th>
                        <th>Редактировать</th>
                        <th>Удалить</th>
                    </tr>
                    <tr>
                        <th><button onClick={create}>Создать</button></th>
                        <th><input type="text" value={newAdmin.phone_number} onChange={e => appendNewAdmin('phone_number',e)} /></th>
                        <th><input type="text" value={newAdmin.email} onChange={e => appendNewAdmin('email',e)}/></th>
                        <th><input type="text" value={newAdmin.name} onChange={e => appendNewAdmin('name',e)}/></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr hidden={!loading}>
                        <td style={{color:'grey'}}>загрузка</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    {
                        admins.map(admin => 
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.phone_number}</td>
                                <td>
                                {
                                    currentEditing(admin)?
                                    <input type="text" onChange={e => setEmail(e.target.value)} value={email} />:
                                    admin.email
                                }
                                </td>
                                <td>
                                    {
                                        currentEditing(admin)?
                                        <input type="text" onChange={e => setName(e.target.value)} value={name} />:
                                        admin.name
                                    }
                                </td>
                                <td>{new Date(admin.updated_at).toLocaleDateString()}</td>
                                <td>
                                    {
                                        currentEditing(admin)?
                                        <button onClick={edit}>сохранить</button>:
                                        <button onClick={() => openEditForm(admin)}>изменить</button>
                                    }
                                </td>
                                <td><button onClick={() => deleteAdmin(admin)}>&#10006;</button></td>
                            </tr>    
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AdminsPage;