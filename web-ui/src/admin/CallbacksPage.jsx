import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import CatalogPaginator from '../CatalogPaginator';

const CallbacksPage = () => {
    
    const nav = useNavigate();
    const page_size = 5;

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [callbacks, setCallbacks] = useState([]);

    const fetchData = useCallback( () => {
        Api('callbacksGet').auth().get({page, page_size}).callback(({ok, array}) => {
            if(ok) {
                setPages(Math.ceil(array.total/page_size));
                setCallbacks(array.data);
            }
        }).send();
    }, [page, page_size]);

    useEffect(() => {
        fetchData();
    }, [page, fetchData]);
    
    return (
        <div className="AdminPage">
            <h1 onClick={() => nav('/admin')}>Обратная связь</h1>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>id</th>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Сообщение</th>
                            <th>Дата создания</th>
                        </tr>
                        {
                            callbacks.length?<></>:
                            <tr>
                                <td style={{color:'grey'}}>загрузка</td><td/><td/><td/><td/>
                            </tr>
                        }
                        {
                            callbacks.map(callback =>
                                <tr key={callback.id}>
                                    <td>{callback.id}</td>
                                    <td>{callback.name}</td>
                                    <td>{callback.phone_number}</td>
                                    <td>
                                        {
                                            callback.message.split('\n').map((msg,i) =>
                                                <div style={{maxWidth:'400px'}} key={i}>{msg}</div>    
                                            )
                                        }
                                    </td>
                                    <td>{new Date(callback.created_at).toLocaleDateString()}</td>
                                </tr>    
                            )
                        }
                    </tbody>
                </table>
            </div>
            <CatalogPaginator pages={pages} externalPage={setPage} />
        </div>
    );
};

export default CallbacksPage;