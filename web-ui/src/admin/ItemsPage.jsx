import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import CatalogPaginator from '../CatalogPaginator';
import '../css/AdminPage.css';
import ItemInfo from './ItemInfo';

const ItemsPage = ({rerenderFlag = false, callback = () => 1, selection = false, apiRouteAll, apiRouteItem, tableHeaders = [], title, itemProps = [], Item}) => {

    const pageSize = 5;

    const navigate = useNavigate();

    var [items, setItems] = useState([]);
    var [page, setPage] = useState(1);
    var [pages, setPages] = useState(1);
    var [selectedId, setSelectedId] = useState(0);
    var [data, setData] = useState({});
    var [loading, setLoading] = useState(true);
    var [loadingItem, setLoadingItem] = useState(false);

    useEffect(() => {
        document.title = title;
        Api(apiRouteAll)
        .auth()
        .callback(({ok, array}) => {
            if(ok) {
                setItems(array.data);
                setPages(Math.ceil(array.total/pageSize));
            }
            setLoading(false);
        })
        .get({
            page: page,
            page_size: pageSize
        })
        .send();
    }, [pageSize, page, apiRouteAll, title, rerenderFlag]);

    useEffect(() => {
        if(selectedId > 0) {
            setLoadingItem(true);
            Api(apiRouteItem)
            .callback(({ok, array}) => {
                if(ok) {
                    setData(array);
                }
                setLoadingItem(false);
            })
            .get({id: selectedId})
            .auth()
            .send();
        }
    }, [selectedId, apiRouteItem]);

    return (
        <div className='AdminPage'>
            <h1 onClick={() => navigate('/admin')}>{title}</h1>
            <table>
                <tbody>
                    <tr>
                        {
                            tableHeaders.map(header =>
                                <th key={header}>{header}</th>    
                            )
                        }
                    </tr>
                    <tr hidden={!loading}>
                        {
                            tableHeaders.map((header, i) =>
                                <td style={{color:'grey'}} key={header}>{i===0?'загрузка':''}</td>    
                            )
                        }
                    </tr>
                    {
                        items.map((item) => 
                        <tr key={item.id} onClick={() => selection?setSelectedId(item.id):1} style={{cursor:selection?'pointer':'default'}}>
                            {
                                itemProps.map(prop =>
                                    <td key={prop} onClick={() => callback(item)}>
                                        {
                                            prop==='created_at'||prop==='updated_at'?
                                            new Date(item[prop]).toLocaleDateString():
                                            prop==='delivery'?
                                            (item[prop]?'Доставка':'Самовывоз'):
                                            item[prop]
                                        }
                                    </td>    
                                )
                            }
                        </tr>    
                    )
                    }
                </tbody>
            </table>
            <div>
                <CatalogPaginator externalPage={setPage} pages={pages}/>
            </div>
            <div style={{marginTop:'50px'}}>
                {
                    loadingItem?<div style={{color:'grey'}}>загрузка</div>:<></>
                }
                {
                    Object.keys(data).length?
                    <ItemInfo Component={Item} data={data} />:
                    <></>
                }
                
            </div>
        </div>
    );
};

export default ItemsPage;