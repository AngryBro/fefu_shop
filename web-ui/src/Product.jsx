import FavouriteSVG from "./svg/FavouriteSVG";
import './css/Product.css';
import ProductSkeleton from "./ProductSkeleton";
import Api from "./Api";
import NotFavouriteSVG from "./svg/NotFavouriteSVG";
import { useNavigate } from "react-router-dom";

const Product = ({data, isFavourite = true, message, skeleton=false, favourite}) => {
    
    const nav = useNavigate();

    if(skeleton) {
        return <ProductSkeleton/>;
    };
    
    return (
        <div className="Product">
            <div className="imageContainer">
                <div className="image" onClick={() => nav(`/product/${data.slug}`)} style={{backgroundImage: `url(${Api().img(data.image_preview)}`}}>
                    {   
                    message!==null?
                    <div className="message">
                        <div className="text">{message}</div>
                    </div>:
                    <></>
                    }
                </div>
                {isFavourite?<div onClick={() => favourite.del(data.id)} className="favourite"><FavouriteSVG/></div>:
                <div onClick={() => favourite.add(data.id)} className="favourite"><NotFavouriteSVG/></div>}
            </div>
            
            <div className="name" onClick={() => nav(`/product/${data.slug}`)}>{data.name}</div>
            <div className="price">
                <div className={data.price_discount===data.price?"normal":"old"}>{data.price} &#8381;</div>
                {
                    data.price_discount !== data.price?
                    <div className="normal">{data.price_discount} &#8381;</div>:
                    <></>
                }
            </div>
        </div>
    );
}

export default Product;