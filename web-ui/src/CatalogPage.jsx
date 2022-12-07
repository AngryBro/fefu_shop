import {useState, useEffect} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import './css/CatalogPage.css';
import './css/Skeleton.css';
import Product from './Product';
import PageRoute from "./PageRoute";
import SortCatalog from "./SortCatalog";
import CatalogPaginator from "./CatalogPaginator";
import Api from "./Api";

const CatalogPage = ({productsMeta = undefined}) => {

    const {slug} = useParams();
    const searchString = decodeURI(document.location.search.replace('?search=', ''));// eslint-disable-next-line
    const pageSize = 9;
    const navigate = useNavigate();


// eslint-disable-next-line
    var [data, setData] = useState({});
    var [category, setCategory] = useState('');
    var [products, setProducts] = useState([]);// eslint-disable-next-line
    var [page, setPage] = useState(1);
    var [loaded, setLoaded] = useState(false);
    var [headerText, setHeaderText] = useState('Каталог');
    var [found, setFound] = useState(false);// eslint-disable-next-line
    var [sort, setSort] = useState({name: 'Сбросить', slug: 'reset'});

    useEffect(() => {
        if(slug !== undefined) {
            var categories = [];
            if(productsMeta!==undefined) {
                categories = productsMeta.categories;    
            }
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].slug === slug) {
                    setCategory(categories[i].name);
                    setHeaderText(categories[i].name);
                    break;
                }
            }
        }
        else {
            setCategory('');
        }
        if(searchString.length) {
            setHeaderText(`По запросу "${searchString}"`);
        }
    }, [slug, searchString, productsMeta]);

    useEffect(() => {
        setLoaded(false);
        setFound(true);
        var temp = [];
        for(let i = 0; i < 9; i++) {
            temp.push({
                id: i
            });
        }
        setProducts(temp);
        temp = [];
        var postParams = {
            page: page,
            page_size: pageSize,
            sort_price: sort.slug==='price_desc'?-1:(sort.slug==='price_asc'?1:0),
            sort_new: sort.slug==='new'
        };
        if(slug !== undefined) {
            postParams.category_slug = slug;
        }
        if(searchString.length) {
            postParams.search_string = searchString;
        }
        Api('products').callback(({status, array}) => {
            if(status === 200) {
                setProducts(array.data);
                setData(array);
                setLoaded(true);
                setFound(true);
            }
            if(status === 404) {
                setLoaded(true);
                setFound(false);
            }
        })
        .post(postParams)
        .send();
    }, [slug, searchString, page, sort.slug]);

    useEffect(() => {
        if(loaded) {
            if(searchString.length) {
                if(found) {
                    setHeaderText(`По запросу "${searchString}" найдено:`);
                }
                else {
                    setHeaderText(`По запросу "${searchString}" ничего не найдено`);
                }
            }
            else {
                setHeaderText(`Каталог`);
            }
        }
        else {
            if(searchString.length) {
                setHeaderText(`По запросу "${searchString}"`);
            }
        }
        if(slug !== undefined) {
            setHeaderText(category);
        }
        
    }, [loaded, found, searchString, category, slug]);


    return (
        <div className="CatalogPage">
            <div className="route"><PageRoute route={
                category.length?
                [
                    {name: 'Главная', link: '/'},
                    {name: 'Каталог', link: '/catalog'},
                    {name: category, link: `/catalog/${slug}`}
                ]:
                [   
                    {name: 'Главная', link: '/'},
                    {name: 'Каталог', link: '/catalog'}
                ]} 
            /></div>
            <div className="header">
                <div className="textLeft">{headerText}</div>
                <div className="sort" hidden={!found}>
                    <SortCatalog
                    params={[
                        {name: 'Сбросить', slug: 'reset'},
                        {name: 'Сначала дешевле', slug: 'price_asc'},
                        {name: 'Сначала дороже', slug: 'price_desc'},
                        {name: 'Сначала новые', slug: 'new'}
                    ]}
                    setExternalSort={setSort}
                    />
                </div>
            </div>
            <div className="line"></div>
                <div className="products" hidden={!found}>
                    { 
                        products.map((product, index) =>
                            <div key={product.id} className="productItem" onClick={() => {if(loaded) navigate(`/product/${product.slug}`)}}>
                                <Product data={product} message={product.new?'NEW':null} skeleton={!loaded}/>
                            </div>
                        )
                    }
                </div>
            <div className="productsNotFound" hidden={(!loaded) || found}>
                <div className="category" hidden={slug===undefined}>
                    <div className="blockCategoryNotFound">
                        <div className="textNotFound">
                            Пока в данной категории товары отсутствуют &#128577;
                        </div>
                    </div>
                    <div className="manImage"></div>
                </div>
                <div className="search" hidden={!searchString.length}></div>
            </div>
            <div className="pagination" style={{display: (loaded && !found)?'none':'block'}}>
                <CatalogPaginator pages={data.total===undefined?1:Math.ceil(data.total/data.per_page)} externalPage={setPage}/>
            </div>
        </div>
    );
}

export default CatalogPage;