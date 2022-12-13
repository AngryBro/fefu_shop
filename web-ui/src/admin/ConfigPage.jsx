import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../css/AdminPage.css';

const ConfigPage = () => {

    const navigate = useNavigate();

    const currentEditing = config => {
        return editFormOpened&&config.id===selectedId;
    }

    const openEditForm = config => {
        setSelectedId(config.id);;
        setValue(config.value);
        setEditFormOpened(true);
    }

    const edit = () => {
        Api('configUpdate')
        .post({name, email, id: selectedId})
        .callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        })
        .auth()
        .send();
    }

    const fetchData = () => {
        setFetchFlag(!fetchFlag);
    }

    var [editFormOpened, setEditFormOpened] = useState(false);
    var [selectedId, setSelectedId] = useState(0);
    var [value, setValue] = useState('');
    var [config, setConfig] = useState({});
    var [fetchFlag, setFetchFlag] = useState(true);

    useEffect(() => {
        Api('configsAll')
        .auth()
        .callback(({ok, array, status}) => {
            if(status === 403) {
                return navigate('/404');
            }
            if(ok) {
                setAdmins(array);
                setEditFormOpened(false);
            }
        })
        .send();
    },[fetchFlag, navigate]);

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>Настройки</h1>
            <div className='menu'>
                <div>Посадочный слайд</div>
                <div>Точка самовывоза</div>
                <div>E-mail для принятия заказов</div>
            </div>
            <div>
                
            </div>
        </div>
    );
};

export default ConfigPage;