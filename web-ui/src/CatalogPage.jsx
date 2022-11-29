import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import './css/CatalogPage.css';
import './css/Skeleton.css';
import Product from './Product';
import PageRoute from "./PageRoute";
import SortCatalog from "./SortCatalog";
import CatalogPaginator from "./CatalogPaginator";

const CatalogPage = () => {

    const {slug} = useParams();
    const searchString = decodeURI(document.location.search.replace('?search=', ''));// eslint-disable-next-line
    const pageSize = 9;


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
            var categories = localStorage.getItem('productsMeta')!==null?
                JSON.parse(localStorage.getItem('productsMeta')).categories:[];
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].slug === slug) {
                    setCategory(categories[i].name);
                    setHeaderText(categories[i].name);
                    break;
                }
            }
        }
        if(searchString.length) {
            setHeaderText(`По запросу "${searchString}"`); console.log(1);
        }
    }, [slug, searchString]);

    useEffect(() => {
        var temp = [];
        for(let i = 0; i < 9; i++) {
            temp.push({
                id: i,
                name: 'Котик №'+i,
                price: 100*i,
                price_discount: 100*i - Math.round(Math.random()),
                image_preview: 'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)'
            });
        }
        temp.forEach(e => <Product data={e} />);
        setProducts(temp);
        setLoaded(true);
        setFound(false);
    }, [slug, searchString]);

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
                <div className="sort" hidden={!loaded || !found}>
                    <SortCatalog
                    params={[
                        {name: 'Сбросить', slug: 'reset'},
                        {name: 'Сначала дешевле', slug: 'price_asc'},
                        {name: 'Сначала дороже', slug: 'price_desc'},
                        {name: 'Сначала новые', slug: 'new_asc'},
                        {name: 'Сначала старые', slug: 'new_desc'}
                    ]}
                    setExternalSort={setSort}
                    />
                </div>
            </div>
            <div className="line"></div>
                <div className="products" hidden={!found}>
                    { 
                        products.map((product, index) =>
                            <div key={product.id} className="productItem">
                                <Product data={product} skeleton={!loaded}/>
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
            <div className="pagination" hidden={!loaded || (loaded && !found)}>
                <CatalogPaginator pages={7} externalPage={setPage}/>
            </div>
        </div>
    );
}

export default CatalogPage;