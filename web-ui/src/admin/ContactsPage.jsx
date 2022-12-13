import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../css/AdminPage.css';

const ContactsPage = () => {

    const navigate = useNavigate();
    
    const fetchData = () => {
        setFetchFlag(!fetchFlag);
    }

    const currentEditing = contact => {
        return contact.id===selectedId && editing;
    }

    const openEditForm = (contact) => {
        setSelectedId(contact.id);
        setEditing(true);
        setValue(contact.value);
    }

    const update = () => {
        Api('contactsUpdate')
        .auth()
        .post({id: selectedId, value})
        .callback(({ok}) => {
            if(ok) {
                setEditing(false);
                setValue('');
                fetchData();
            }
        })
        .send();
    }

    var [fetchFlag, setFetchFlag] = useState(true);
    var [contacts, setContacts] = useState([]);
    var [selectedId, setSelectedId] = useState(0);
    var [editing, setEditing] = useState(false);
    var [value, setValue] = useState('');

    useEffect(() => {
        Api('contacts')
        .auth()
        .callback(({ok, array, status}) => {
            if(status === 403) {
                return navigate('/404');
            }
            if(ok) {
                setContacts(array);
            }
        })
        .send();
    },[fetchFlag, navigate]);

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>Контакты</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Контакт</th>
                        <th>Значение</th>
                        <th>Редактировать</th>
                    </tr>
                    {
                        contacts.map(contact => 
                            <tr key={contact.id}>
                                <td>{contact.name}</td>
                                <td>
                                {
                                    currentEditing(contact)?
                                    <input type="text" onChange={e => setValue(e.target.value)} value={value} />:
                                    contact.value
                                }
                                </td>
                                <td>
                                    {
                                        currentEditing(contact)?
                                        <button onClick={update}>сохранить</button>:
                                        <button onClick={() => openEditForm(contact)}>изменить</button>
                                    }
                                </td>
                            </tr>    
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ContactsPage;