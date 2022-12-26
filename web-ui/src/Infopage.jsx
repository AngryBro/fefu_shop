import './css/Infopage.css';
import {useNavigate, useParams} from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Api from './Api';
import ArrowInfopageSliderSVG from './svg/ArrowInfopageSliderSVG';

const Slider = ({images = []}) => {
    
    const [first, setFirst] = useState(0);

    const next = () => {
        if(first+3+1 <= images.length) {
            setFirst(f => f+1);
        }
    }

    const prev = () => {
        if(first > 0) {
            setFirst(f => f-1);
        }
    }

    return (
        <div className='InfopageSliderContainer'>
            <div onClick={prev} style={{opacity: first===0?0:1, cursor: first===0?'default':'pointer'}} className='InfopageSliderPrev'><ArrowInfopageSliderSVG/></div>
            <div className='InfopageSliderVisibleBlock'>
                <div className='InfopageSliderImageBlock' style={{left: `${-first*299}px`}}>
                    {
                        images.length?
                        images.map((image, i) => <div key={i} onClick={() => window.open(Api().img(image))} className='InfopageSliderImage' style={{backgroundImage: Api().cssimg(image)}} />)
                        :[1,2,3].map(i => <div key={i} className='InfopageSliderImageSkeleton' />)
                    }
                </div>
            </div>
            <div onClick={next} style={{opacity: first+3>=images.length?0:1, cursor: first+3>=images.length?'default':'pointer'}} className='InfopageSliderNext'><ArrowInfopageSliderSVG/></div>
        </div>
    );
}

const Infopage = () => {
    
    const nav = useNavigate();
    const {slug} = useParams();
    const format = text => {
        if(text === undefined) return [];
        var splited = text.split('\n');
        var temp = [];
        for(let i = 0; i < splited.length; i++) {
            if(splited[i].length) {
                temp.push(<div className={i===0?'InfopageTextHeader':'InfopageTextParagraph'}>{splited[i]}</div>);
            }
        }
        return temp;
    };

    const [data, setData] = useState({});
    
    useEffect(() => {
        Api('infopage').get({slug}).callback(({ok, array, status}) => {
            if(ok) {
                setData(array);
                document.title = array.header;
            }
            if(status === 404) {
                nav('/404');
            }
        }).send();
    }, [slug, nav]);

    return (
        <div className='Infopage'>
            <div className='InfopagePreview' style={'image_header' in data?{backgroundImage: Api().cssimg(data.image_header)}:{}}>
                <div className='InfopageHeaderContainer'>
                    <div className='InfoPageHeader'>{data.header}</div>
                </div>
            </div>
            <div className='InfopageText'>
                {format(data.text1)}
            </div>
            <div className='InfopageSlider'>
                <Slider images={'images' in data?(data.images===null?['null','null','null']:data.images):[]}/>
            </div>
            <div className='InfopageText' style={{marginBottom:'96px'}}>
                {format(data.text2)}
            </div>
        </div>
    );
};

export default Infopage;