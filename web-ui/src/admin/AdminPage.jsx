import { useNavigate } from 'react-router-dom';
import '../css/AdminPage.css';

const AdminPage = () => {

    const navigate = useNavigate();

    return (
        <div className="AdminPage">
            <h1>Администраторская панель</h1>
            <div className="menu">
                <div onClick={() => navigate('/admin/orders')}>Заказы</div>
                <div onClick={() => navigate('/admin/callbacks')}>Обратная связь</div>
                <div onClick={() => navigate('/admin/config')}>Настройки</div>
                <div onClick={() => navigate('/admin/categories')}>Категории</div>
                <div onClick={() => navigate('/admin/products')}>Товары</div>
                <div onClick={() => navigate('/admin/users')}>Пользователи</div>
                <div onClick={() => navigate('/admin/admins')}>Администраторы</div>
                <div onClick={() => navigate('/admin/contacts')}>Контакты</div>
                <div onClick={() => navigate('/admin/infopages')}>Информационные страницы</div>
                <div onClick={() => navigate('/admin/colors')}>Цвета</div>
                <div onClick={() => navigate('/admin/materials')}>Материалы</div>
                <div onClick={() => navigate('/admin/brands')}>Брэнды</div>
            </div>
        </div>
    );
};

export default AdminPage;