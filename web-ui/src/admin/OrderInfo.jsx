const OrderInfo = ({data}) => {
    return (
        <div style={{display:'id' in data?'block':'none'}}>
            <div style={{width:'fit-content'}}>
                <table>
                    <tbody>
                        <tr>
                            <td>№ заказа:</td>
                            <td>{data.id}</td>
                        </tr>
                        <tr>
                            <td>Телефон:</td>
                            <td>{data.user.phone_number}</td>
                        </tr>
                        <tr>
                            <td>Имя:</td>
                            <td>{data.user.name}</td>
                        </tr>
                        {
                            data.user.email === null?<></>:
                            <tr>
                                <td>E-mail:</td>
                                <td>{data.user.email}</td>
                            </tr>
                        }
                        <tr>
                            <td>Тип:</td>
                            <td>{data.delivery?'Доставка':'Самовывоз'}</td>
                        </tr>
                        {
                            data.delivery?
                            <tr>
                                <td>Адрес доставки:</td>
                                <td>
                                {
                                    `${data.city}, ул.${data.street}, ${data.building}${data.apartment===null?'':`, ${data.apartment}`}`
                                }
                                </td>
                            </tr>:<></>
                        }
                        <tr>
                            <td>Сумма со скидкой:</td>
                            <td>{data.price_discount}</td>
                        </tr>
                        <tr>
                            <td>Скидка:</td>
                            <td>{data.discount}</td>
                        </tr>
                        {
                            data.comment===null?<></>:
                            <tr>
                                <td>Комментарий:</td>
                                <td>{data.comment}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <h3>Позиции</h3>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Название</th>
                            <th>Артикул</th>
                            <th>Размер</th>
                            <th>Количество</th>
                            <th>Цена за шт</th>
                        </tr>
                        {
                            data.positions.map(position =>
                                <tr key={position.id}>
                                    <td>{position.name}</td>
                                    <td>{position.article}</td>
                                    <td>{position.size}</td>
                                    <td>{position.count}</td>
                                    <td>{position.price_discount}</td>
                                </tr>    
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderInfo;