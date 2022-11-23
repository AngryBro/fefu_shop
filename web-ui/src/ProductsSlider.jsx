import React from "react";
import './css/ProductsSlider.css';
import Product from './Product';
import NextNewSVG from './svg/NextNewSVG';

const ProductsSlider = ({pageSize, products}) => {

    const dx = 320;
    var [first, setFirst] = React.useState(-1);
    var [last, setLast] = React.useState(pageSize);
    var [slides, setSlides] = React.useState([]);
    // var [x0, setX0] = React.useState(dx);

    React.useEffect(() => {
        var temp = [];
        // for(let j = 0; j < 3; j++) {
        //     for(let i = 0; i < products.length; i++) {
        //         temp.push(products[i]);
        //     }
        // }
        if(products.length) {
            for(let i = -1; i <= pageSize; i++) {
                temp.push({key: i, item: products[(i+products.length) % products.length]});
            }
            // temp.push({key: -1, item: products[(-1+products.length) % products.length], left: -dx});
        }
        setSlides(temp);
    }, [products, pageSize, dx]);

    var next = () => {
        var temp = slides;
        var l = products.length;
        temp.push({key: last+1, item: products[((last+1)%l + l) % l]});
        temp.shift();
        setSlides(temp);
        setFirst(first + 1);
        setLast(last + 1);
    };
    var prev = () => {
        var l = products.length;
        var temp = JSON.parse(JSON.stringify(slides));
        temp.unshift({key: first-1, item: products[((first-1) % l + l) % l]});
        temp.pop();
        setSlides(temp);
        setFirst(first - 1);
        setLast(last - 1);
    };

    return (
        <div className="ProductsSlider" >
            <div className="prev" onClick={prev}><NextNewSVG /></div>
            <div className="block">
                <div className="slides">
                    {
                        slides.map((product) => 
                            <div className="product" key={product.key}><Product data={product.item} message='NEW'/></div>    
                        )
                    }
                </div>
            </div>
            <div className="next" onClick={next}><NextNewSVG /></div>
        </div>
    );
}

export default ProductsSlider;