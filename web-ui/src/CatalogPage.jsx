import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import './css/CatalogPage.css';
import './css/Skeleton.css';
import Product from './Product';
import ProductSkeleton from "./ProductSkeleton";
import PageRoute from "./PageRoute";
import SortCatalog from "./SortCatalog";
import CatalogPaginator from "./CatalogPaginator";

const CatalogPage = () => {

    const {slug} = useParams();
    const searchString = decodeURI(document.location.search.replace('?search=', ''));
    const pageSize = 9;

    const skeletons = () => {
        var temp = [];
        for(var i = 0; i < 9; i++) {
            temp.push(<ProductSkeleton/>);
        }
        return temp;
    }

    var [data, setData] = useState({});
    var [category, setCategory] = useState('');
    var [products, setProducts] = useState(skeletons());
    var [page, setPage] = useState(1);
    var [loaded, setLoaded] = useState(false);
    var [headerText, setHeaderText] = useState('');
    var [found, setFound] = useState(false);
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
            setHeaderText(`По запросу "${searchString}"`);
        }
        setProducts(skeletons());
    }, [slug, searchString]);

    useEffect(() => {
        setLoaded(false);
        setFound(true);
    }, []);

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

    useEffect(() => {
        console.log(page);
    }, [page]);

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
                <div className="sort">
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
            <div className="products">
                {
                    products.map((product, index) =>
                        <div key={'id' in product?product.id:index} className="productItem">
                            {product}
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