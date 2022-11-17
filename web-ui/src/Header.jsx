import './css/Header.css';
import React from 'react';
import SearchSVG from './svg/SearchSVG';
import FavouriteSVG from './svg/FavouriteSVG';
import AuthHeadSVG from './svg/AuthHeadSVG';
import AuthBodySVG from './svg/AuthBodySVG';
import CartUpSVG from './svg/CartUpSVG';
import CartDownSVG from './svg/CartDownSVG';

const Header = ({cart}) => { 
    
    var [infoPages, setInfoPages] = React.useState([]);
    // var [cart, setCart] = React.useState({
    //     sum: 0,
    //     count: 0
    // });
    // React.useEffect(() => {
        
    // }, []);
    React.useEffect(() => {
        var pages = [];
        for(var i = 0; i<3; i++) {
            pages.push({
                name: 'инфа'+i,
                link: '/nahui',
                id: i
            });
        }
        setInfoPages(pages);
    }, []);

    return(
    <div className="Header">
        <div className='infolinksBlock'>
            <div className='infolinks'>
                {
                    infoPages.map(e => (
                        <a className='infolink' key={e.id} target='_blank' rel="noopener noreferrer" href={e.link}>{e.name}</a>
                    ))
                }
            </div>
        </div>
        <div className='name'>
                LOGO
        </div>
        <div className='catalog'>
            <div className='rectBlock'>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className='text'>КАТАЛОГ</div>
        </div>
        <div className='search'>
            <div className='svg'><SearchSVG/></div>
        </div>
        <div className='favourite'>
            <div className='svg'><FavouriteSVG/></div>
            <div className='text'>Избранное</div>
        </div>
        <div className='auth'>
            <div className='svgHead'><AuthHeadSVG/></div>
            <div className='svgBody'><AuthBodySVG/></div>
            <div className='text'>Вход/Регистрация</div>
        </div>
        <div className='cart'>
            <div className='svgUp'><CartUpSVG/></div>
            <div className='svgDown'><CartDownSVG/></div>
            <div className='text'>{cart} &#8381; / {cart} шт.</div>
        </div>
    </div>
    );
}
export default Header;