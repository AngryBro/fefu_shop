import FavouriteSVG from "./svg/FavouriteSVG";
import './css/Product.css';

const Product = ({data, isFavourite = false, message = null}) => {
    return (
        <div className="Product">
            <div className="image" style={{backgroundImage: data.image_preview}}>
                {
                    message!==null?
                    <div className="message">
                        <div className="text">{message}</div>
                    </div>:
                    <></>
                }
                {isFavourite?<div className="favourite"><FavouriteSVG/></div>:<></>}
            </div>
            <div className="name">{data.name}</div>
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