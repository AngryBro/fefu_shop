import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import './css/CatalogPage.css';
import Product from './Product';
import ProductSkeleton from "./ProductSkeleton";
import PageRoute from "./PageRoute";

const CatalogPage = () => {

    const {slug, searchString} = useParams();
    const pageSize = 9;

    var [data, setData] = useState({});
    var [category, setCategory] = useState('котики');
    var [products, setProducts] = useState([]);
    var [page, setPage] = useState(1);
    var [loaded, setLoaded] = useState(false);

    var skeletons = () => {
        var temp = [];
        for(var i = 0; i < 9; i++) {
            temp.push(<ProductSkeleton/>);
        }
        return temp;
    }

    return (
        <div className="CatalogPage">
            <div className="route"><PageRoute route={[
                {name: 'Главная', link: '/'},
                {name: 'Каталог', link: '/'},
                {name: category, link: `/catalog/${slug}`}
            ]} /></div>
            <div className="header">
                <div className="text"></div>
                <div className="sort"></div>
            </div>
            <div className="line"></div>
            <div className="products"></div>
            <div className="pagination"></div>
        </div>
    );
}

export default CatalogPage;