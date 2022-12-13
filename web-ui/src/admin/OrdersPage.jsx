import '../css/AdminPage.css';
import ItemsPage from './ItemsPage';
import OrderInfo from './OrderInfo';

const OrdersPage = () => {

    return (
        <ItemsPage
            title='Заказы'
            tableHeaders={[
                '№ заказа',
                'Телефон',
                'Тип',
                'Сумма',
                'Дата'
            ]}
            itemProps={[
                'id',
                'phone_number',
                'delivery',
                'price_discount',
                'created_at'
            ]}
            apiRouteAll='ordersAll'
            Item={OrderInfo}
            apiRouteItem='ordersItem'
            selection={true}
        />
    );
};

export default OrdersPage;