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

const Header = ({cart, contacts, infoPages = {header:[]}, categories = [], searchString, search, userData = {}, setOpenedModalWindow}) => { 
    
    const navigate = useNavigate();

    var [openedCatalog, setOpenedCatalog] = React.useState(false);

    return(
        <div>
    <div className="Header" onMouseLeave={() => setOpenedCatalog(false)}>
        <div className='upper'>
            <div className='block'>
            <div className='infolinks'>
                {
                    infoPages.header.map(e => (
                        <a className='infolink' key={e.id} target='_blank' rel="noopener noreferrer" href={`/info/${e.slug}`}>{e.header}</a>
                    ))
                }
            </div>
            <div className='contacts'>
                {
                    'instagram' in contacts?
                    <>
                        <div className='svgInst'><InstSVG/></div>
                        <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.instagram.value)} className='textInst'>{contacts.instagram.name}</div>
                    </>:<></>
                }
                {
                    'whatsapp' in contacts?
                    <>
                        <div className='svgWa'><WhatsappSVG/></div>
                        <div style={{cursor:'pointer'}} className='textWa'>{contacts.whatsapp.name}</div>
                    </>:<></>
                }
                    
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
            <div className='authText' onClick={() => userData.authed?(userData.admin?navigate('/admin'):1):setOpenedModalWindow({type: 'phone', phone:''})}>{userData.authed?'+'+userData.phone:"Вход/Регистрация"}</div>
            <div className='cartSvg'>
                <div className='up'><CartUpSVG/></div>
                <div className='down'><CartDownSVG/></div>
            </div>
            <div className='cartText' onClick={() => navigate('/cart')}>{cart.sum} &#8381; / {cart.count} шт.</div>
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