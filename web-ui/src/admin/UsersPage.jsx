import '../css/AdminPage.css';
import ItemsPage from './ItemsPage';
// import OrderInfo from './OrderInfo';

const UsersPage = () => {

    return (
        <ItemsPage
            title='Пользователи'
            tableHeaders={[
                'id',
                'Телефон',
                'Имя',
                'Email',
                'Дата регистрации'
            ]}
            itemProps={[
                'id',
                'phone_number',
                'name',
                'email',
                'created_at'
            ]}
            apiRouteAll='usersAll'
        />
    );
};

export default UsersPage;