import { useEffect } from 'react';
import { useState } from 'react';
import Api from './Api';
import './css/MainSlider.css';

const MainSlider = ({slides = [{image: null}]}) => {

    const transitionTime = 1000;
    const dopacity = 0.03;

    const gotoSlide = number => {
        setTransitionFlag(true);
        setOpacity(0);
        setTimeout(() => {
            setCurrent(number);
            setNext((number+1)%slides.length);
            setOpacity(1);
        }, transitionTime);
    }
    const nextSlide = () => gotoSlide((current+1)%slides.length);
    const prevSlide = () => gotoSlide((current-1)%slides.length);

    var [current, setCurrent] = useState(0);
    var [next, setNext] = useState(1 % slides.length);
    var [opacity, setOpacity] = useState(1);
    var [transitionFlag, setTransitionFlag] = useState(false);

    // useEffect(() => {
    //     if(transitionFlag) {
    //         var timer = setInterval(() => setOpacity(op => op-dopacity<=0?0:op-dopacity), transitionTime);
    //         return () => clearInterval(timer);
    //     }
    // }, [transitionFlag, dopacity, transitionTime]);

    return (
        <div className='MainSlider'>
            <div className='MainSliderBlock'>
                <div style={{opacity, backgroundImage: Api().cssimg(slides[current].image)}} className='MainSliderCurrentImage'></div>
                <div style={{backgroundImage: Api().cssimg(slides[next].image)}} className='MainSliderNextImage'></div>
            </div>
            <button onClick={nextSlide}>qwerty</button>
        </div>
    );

};

export default MainSlider;