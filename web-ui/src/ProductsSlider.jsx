import React from "react";
import './css/ProductsSlider.css';
import Product from './Product';

const ProductsSlider = ({pageSize, products}) => {

    const dx = -320;
    var [first, setFirst] = React.useState(-1);
    var [last, setLast] = React.useState(pageSize);
    var [slides, setSlides] = React.useState([]);
    var [x0, setX0] = React.useState(dx);

    React.useEffect(() => {
        var temp = [];
        // for(let j = 0; j < 3; j++) {
        //     for(let i = 0; i < products.length; i++) {
        //         temp.push(products[i]);
        //     }
        // }
        if(products.length) {
            for(let i = -1; i <= pageSize; i++) {
                temp.push(products[(i+products.length) % products.length]);
            }
        }
        setSlides(temp);
    }, [products, pageSize]);

    var next = () => {
        var temp = JSON.parse(JSON.stringify(slides));
        temp.push(products[(last+1) % products.length]);
        setSlides(temp);
        setX0(x0+dx);
        setFirst(first + 1);
        setLast(last + 1);
        // temp = JSON.parse(JSON.stringify(slides));
        // temp.shift();
        // setSlides(temp);
        // setX0(x0-dx);
    };
    // var prev = () => {
    //     setFirst((first - 1) % products.length);
    // };

    return (
        <div className="ProductsSlider" style={{transform: `translateX(${x0}px)`, transition: 'transform 0.5s ease-in-out'}}>
            {
                slides.map((product, index) => 
                    <div onClick={next} className="product" key={index}><Product data={product} message='NEW'/></div>    
                )
            }
        </div>
    );
}

export default ProductsSlider;