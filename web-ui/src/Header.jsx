import './css/Header.css';
import React from 'react';
import SearchSVG from './svg/SearchSVG';
import FavouriteSVG from './svg/FavouriteSVG';
import AuthHeadSVG from './svg/AuthHeadSVG';
import AuthBodySVG from './svg/AuthBodySVG';
import CartUpSVG from './svg/CartUpSVG';
import CartDownSVG from './svg/CartDownSVG';
import InstSVG from './svg/InstSVG';
import WhatsappSVG from './svg/WhatsappSVG';
import OpenedCatalog from './OpenedCatalog';

const Header = ({cart, contacts, infoPages}) => { 
    
    const authed = localStorage.getItem('Authorization') !== null;
    var [openedCatalog, setOpenedCatalog] = React.useState(false);

    return(
    <div>
    <div className="Header">
        <div className='upper'>
            <div className='infolinks'>
                {
                    infoPages.map(e => (
                        <a className='infolink' key={e.id} target='_blank' rel="noopener noreferrer" href={e.link}>{e.name}</a>
                    ))
                }
            </div>
            <div className='contacts'>
                <div className='inst'>
                    <div className='svg'><InstSVG/></div>
                    <div className='text'>logo</div>
                </div>
                <div className='wa'>
                    <div className='svg'><WhatsappSVG/></div>
                    <div className='text'>Написать нам</div>
                </div>
            </div>
        </div>
        <div className='name'>
                LOGO
        </div>
        <div className='catalog' onClick={() => {setOpenedCatalog(!openedCatalog)}}>
            <div className='rectBlock'>
                {openedCatalog?
                    <><div className='rectOpened1'></div>
                    <div className='rectOpened2'></div></>
                    :
                    <>
                    <div className='rect'></div>
                    <div className='rect'></div>
                    <div className='rect'></div></>
                }
                
                
            </div>
            <div className='text'>КАТАЛОГ</div>
        </div>
        <div className='search'>
            <input type="text" />
            <div className='svg'><SearchSVG/></div>
        </div>
            <div className='favouriteSvg'><FavouriteSVG/></div>
            <div className='favouriteText'>Избранное</div>
            <div className='authSvgHead'><AuthHeadSVG/></div>
            <div className='authSvgBody'><AuthBodySVG/></div>
            <div className='authText'>{authed?"79998887766":"Вход/Регистрация"}</div>
            <div className='cartSvgUp'><CartUpSVG/></div>
            <div className='cartSvgDown'><CartDownSVG/></div>
            <div className='cartText'>{cart.sum} &#8381; / {cart.count} шт.</div>
    </div>
    {
            openedCatalog?<OpenedCatalog/>:<></>
        }
    </div>
    );
}
export default Header;