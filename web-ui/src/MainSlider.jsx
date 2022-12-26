import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import './css/MainSlider.css';

const MainSlider = ({slides = []}) => {

    const nav = useNavigate();

    const gotoSlide = number => {
        setCurrent(number);
    }

    var [current, setCurrent] = useState(0);

    useEffect(() => {
        var timer = setInterval(() => setCurrent(c => (c+1)%slides.length), 5*1000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className='MainSlider'>
            <div className='MainSliderBlock'>
                <div className='MainSliderCurrentImage' style={{zIndex:4}} onClick={() => slides[current].blank?window.open(slides[current].link):nav(slides[current].link)}></div>
                {
                    slides.map((slide, i) =>
                        <div key={i} style={{opacity:i===current?1:0, backgroundImage: Api().cssimg(slide.image)}} className='MainSliderCurrentImage'></div>
                    )
                }
                <div className='MainSliderPoints'>
                {
                    slides.map((slide,i) => 
                        <div 
                            key={i} 
                            className={`MainSliderPoint${i===current?'Active':''}`}
                            style={{transition:'all 0.2s linear'}}
                            onClick={() => i===current?1:gotoSlide(i)}
                        />    
                    )
                }
                </div>
            </div>
        </div>
    );

};

export default MainSlider;