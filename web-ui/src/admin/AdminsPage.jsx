import { useState } from 'react';
import Api from '../Api';
import '../css/AdminPage.css';
import ItemsPage from './ItemsPage';
import SimpleForm from './SimpleForm';

const AdminsPage = () => {

    const openEditForm = admin => {
        setSelectedId(admin.id);
        setPhone('');
        setEmail(admin.email);
        setName(admin.name);
        setEditFormOpened(true);
    }
    const edit = () => {
        Api('adminEdit')
        .post({name, email, id: selectedId})
        .callback(({ok}) => {
            if(ok) {
                
            }
        })
        .auth()
        .send();
    }

    var [editFormOpened, setEditFormOpened] = useState(true);
    var [selectedId, setSelectedId] = useState(0);
    var [email, setEmail] = useState('');
    var [name, setName] = useState('');
    var [phone, setPhone] = useState('');

    return (
        <div>
            <ItemsPage
            title='Администраторы'
            tableHeaders={[
                'id',
                'Телефон',
                'Имя',
                'Email',
                'Дата изменения'
            ]}
            itemProps={[
                'id',
                'phone_number',
                'name',
                'email',
                'updated_at'
            ]}
            apiRouteAll='adminsAll'
        />

        <SimpleForm
            data={[
                {key: 'E-mail', value: email, setter: setEmail},
                {key: 'Имя', value:name, setter: setName}
            ]}
            submit={() => 1}
            text='Сохранить'
            opened={editFormOpened}
        />
        </div>
    );
};

export default AdminsPage;