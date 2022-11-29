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
import { useNavigate } from 'react-router-dom';

const Header = ({cart, contacts, infoPages, categories, searchString, search}) => { 
    
    const authed = localStorage.getItem('Authorization') !== null;
    const navigate = useNavigate();

    var [openedCatalog, setOpenedCatalog] = React.useState(false);

    return(
        <div>
    <div className="Header" onMouseLeave={() => setOpenedCatalog(false)}>
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
        <div className='name' onClick={() => navigate('/')}>
                LOGO
        </div>
        <div className='catalog'
             onMouseEnter={() => {setOpenedCatalog(true)}}
             onClick={() => {navigate('/catalog'); searchString.set('')}}
        >
        
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
            <input type="text" 
                onChange={e => searchString.set(e.target.value)}
                onKeyDown={e => {if(e.key === 'Enter'){search()}}}
                value={searchString.get}
            />
            <div className='svg' onClick={search}><SearchSVG/></div>
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
        <div className='openedCatalogBlock'
            onMouseEnter={() => setOpenedCatalog(true)}
            onMouseLeave={() => setOpenedCatalog(false)}
        >
        {
            openedCatalog?<OpenedCatalog categories={categories}/>:<></>
        }
        </div>
        </div>
    );
}
export default Header;