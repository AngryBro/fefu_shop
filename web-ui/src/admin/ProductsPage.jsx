import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import CatalogPaginator from "../CatalogPaginator";
import Api from "../Api";
import ProductTable from "./ProductTable";
import '../css/AdminPage.css';

const ProductsPage = ({productsMeta}) => {

    const navigate = useNavigate();
    const fetchData = () => {setFetchFlag(!fetchFlag);}

    const search = () => {
        var temp = JSON.parse(JSON.stringify(getParams));
        if(selectedCategory > 0) {
            temp.category_id = selectedCategory;
        }
        else {
            delete temp.category_id;
        }
        if(searchName.length) {
            temp.name = searchName;
        }
        else {
            delete temp.name;
        }
        setGetParams(temp);
        setPage(1);
    }

    const notParent = array => {
        var temp = [];
        array.forEach(a => {
            if(a.children_all.length === 0) {
                temp.push(a);
            }
        });
        return temp;
    }

    const update = (params) => {
        params.id = selectedProduct;
        Api('adminProductUpdate').auth().post(params).callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        }).send();
    }

    var [fetchFlag, setFetchFlag] = useState(false);
    var [loading, setLoading] = useState(true);
    var [products, setProducts] = useState({data:[]});
    var [page, setPage] = useState(1);
    var [pages, setPages] = useState(1);
    var [searchName, setSearchName] = useState('');
    var [selectedCategory, setSelectedCategory] = useState(0);
    var [getParams, setGetParams] = useState({});
    var [categories, setCategories] = useState([]);
    var [product, setProduct] = useState({});
    var [selectedProduct, setSelectedProduct] = useState(0);
    var [loadedProduct, setLoadedProduct] = useState(false);
    var [edit, setEdit] = useState(false);

    useEffect(() => {
        const page_size = 10;
        var params = JSON.parse(JSON.stringify(getParams));
        params.page = page;
        params.page_size = page_size;
        Api('adminProducts').auth().get(params).callback(({ok, array}) => {
            if(ok) {
                setLoading(false);
                setProducts(array);
                setPages(Math.ceil(array.total?array.total/page_size:1));
            }
        }).send();
    }, [fetchFlag, page, getParams]);

    useEffect(() => {
        Api('adminCategories').auth().callback(({ok, array}) => {
            if(ok) {
                setCategories(array);
            }
        }).send();
    }, []);

    useEffect(() => {
        if(selectedProduct < 1) {
            return;
        }
        Api('adminProduct').auth().get({id: selectedProduct}).callback(({ok, array}) => {
            if(ok) {
                setEdit(false);
                setProduct(array);
            }
            setLoadedProduct(true);
        }).send();
    }, [selectedProduct, fetchFlag]);

    return (
        <div className="AdminPage">
            <h1 onClick={() => navigate('/admin')}>Товары</h1>
            <div style={{float:'left'}}>
                <table>
                    <tbody>
                        <tr>
                            <th>id</th>
                            <th>Название</th>
                            <th>Категория</th>
                        </tr>
                        <tr>
                            <th><button onClick={search}>поиск</button></th>
                            <th><input value={searchName} onChange={e => setSearchName(e.target.value)} /></th>
                            <th>
                                <select style={{fontSize:'16pt'}} onChange={e => setSelectedCategory(e.target.value)} value={selectedCategory}>
                                    <option value={0}>Не выбрано</option>
                                    {
                                        notParent(categories).map(category =>
                                            <option value={category.id} key={category.id}>
                                                {category.name}
                                            </option>    
                                        )
                                    }
                                </select>
                            </th>
                        </tr>
                        <tr hidden={!loading} >
                            <td style={{color:'grey'}}>загрузка</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {
                            products.data.map(product =>
                                <tr key={product.id} onClick={() => setSelectedProduct(product.id)} style={{cursor:'pointer'}}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                </tr>    
                            )
                        }
                    </tbody>
                </table>
                <div>
                    <CatalogPaginator externalPage={setPage} pages={pages} />
                </div>
            </div>
            <div style={{float:'left', marginLeft:'50px'}}>
                <ProductTable update={update} categories={categories} productsMeta={productsMeta} product={product} edit={edit} loaded={loadedProduct} setEdit={setEdit} />
            </div>
        </div>
    );

};

export default ProductsPage;