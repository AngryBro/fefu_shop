import './css/ProductSlider.css';
import React from 'react';
import UpSliderProductSVG from './svg/UpSliderPoductSVG';
import Api from './Api';

const ProductSlider = ({images, setPreview}) => {

    var [first, setFirst] = React.useState(0);

    const dx = 279;

    var slide = flag => {
        setFirst( first+flag >= images.length-1? first : ( first+flag < 0 ? 0 : first+flag ));
    }

    var next = () => slide(1);
    var prev = () => slide(-1);

    return (
        <div className='ProductSlider'>
            <div className='up' onClick={prev} style={{opacity: first===0?0:1, cursor: first===0?'auto':'pointer'}}><UpSliderProductSVG/></div>
            <div className='block'>
                <div className='slides' style={{marginTop: -first*dx}}>
                    {
                        images.map((image, index) => 
                            <div onClick={() => setPreview(image.image)} className='img' key={index} style={{backgroundImage: `url(${Api().img(image.image)})`}} />
                        )
                    }
                </div>
            </div>
            <div className='down' onClick={next} style={{opacity: first===images.length-2?0:1, cursor: first===images.length-2?'auto':'pointer'}}><UpSliderProductSVG/></div>
        </div>
    );
};

export default ProductSlider;