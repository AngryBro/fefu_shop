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

const Header = ({cart, contacts, infoPages, categories}) => { 
    
    const authed = localStorage.getItem('Authorization') !== null;
    var [openedCatalog, setOpenedCatalog] = React.useState(false);

    return(
        <div>
    <div className="Header">
        <div className='upper'>
            <div className='block'>
            <div className='infolinks'>
                {
                    infoPages.map(e => (
                        <a className='infolink' key={e.id} target='_blank' rel="noopener noreferrer" href={e.link}>{e.name}</a>
                    ))
                }
            </div>
            <div className='contacts'>
                    <div className='svgInst'><InstSVG/></div>
                    <div className='textInst'>logo</div>
                    <div className='svgWa'><WhatsappSVG/></div>
                    <div className='textWa'>Написать нам</div>
            </div>
            </div>
        </div>
        <div className='lower'>
        <div className='block'>
        <div className='name' onClick={() => {document.location.href='/'}}>
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
            <div className='authSvg'>
                <div className='head'><AuthHeadSVG/></div>
                <div className='body'><AuthBodySVG/></div>
            </div>
            <div className='authText'>{authed?"79998887766":"Вход/Регистрация"}</div>
            <div className='cartSvg'>
                <div className='up'><CartUpSVG/></div>
                <div className='down'><CartDownSVG/></div>
            </div>
            <div className='cartText'>{cart.sum} &#8381; / {cart.count} шт.</div>
        </div>
        </div>
        </div>
        <div className='openedCatalogBlock'>
        {
            openedCatalog?<OpenedCatalog categories={categories}/>:<></>
        }
        </div>
        </div>
    );
}
export default Header;