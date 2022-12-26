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

const Header = ({cart, contacts, infoPages = {header:[]}, categories = [], searchString, search, userData = {}, setOpenedModalWindow, noFunctional}) => { 
    
    const navigate = useNavigate();

    const favouriteHandle = () => {
        navigate('/favourite');
    };

    var [openedCatalog, setOpenedCatalog] = React.useState(false);

    return(
        <div>
    <div className="HeaderU" onMouseLeave={() => setOpenedCatalog(false)}>
        <div className='HeaderUpper'>
            <div className='HeaderUpperBlock'>
            <div className='HeaderInfolinks'>
                {
                    infoPages.header.map(e => (
                        <a className='HeaderInfolink' key={e.id} target='_blank' rel="noopener noreferrer" href={`/info/${e.slug}`}>{e.header}</a>
                    ))
                }
            </div>
            <div className='HeaderContacts'>
                {
                    'instagram' in contacts?
                    <>
                        <div className='HeaderContactsSvgInst'><InstSVG/></div>
                        <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.instagram.value)} className='HeaderContactsTextInst'>{contacts.instagram.name}</div>
                    </>:<></>
                }
                {
                    'whatsapp' in contacts?
                    <>
                        <div className='HeaderContactsSvgWa'><WhatsappSVG/></div>
                        <div onClick={() => window.open(`https://api.whatsapp.com/send/?phone=${contacts.whatsapp.value}`)} style={{cursor:'pointer'}} className='HeaderContactsTextWa'>{contacts.whatsapp.name}</div>
                    </>:<></>
                }
                    
            </div>
            </div>
        </div>
        <div className='HeaderLower'>
        <div className='HeaderLowerBlock'>
        <div className='HeaderName' onClick={() => navigate('/')}>
                LOGO
        </div>
        <div className='HeaderCatalog'
             onMouseEnter={() => {setOpenedCatalog(true)}}
             onClick={() => {navigate('/catalog'); searchString.set('')}}
        >
        
            <div className='HeaderCatalogRectBlock'>
                {openedCatalog?
                    <><div className='HeaderCatalogRectOpened1'></div>
                    <div className='HeaderCatalogRectOpened2'></div></>
                    :
                    <>
                    <div className='HeaderCatalogRect'></div>
                    <div className='HeaderCatalogRect'></div>
                    <div className='HeaderCatalogRect'></div></>
                }
                
                
            </div>
            <div className='HeaderCatalogText'>КАТАЛОГ</div>
        </div>
        <div className='HeaderSearch'>
            <input type="text" 
                onChange={e => searchString.set(e.target.value)}
                onKeyDown={e => {if(e.key === 'Enter'){search()}}}
                value={searchString.get}
            />
            <div className='HeaderSearchSvg' onClick={search}><SearchSVG/></div>
        </div>
            <div className='HeaderFavouriteSvg'><FavouriteSVG/></div>
            <div className='HeaderFavouriteText' onClick={favouriteHandle}>Избранное</div>
            <div className='HeaderAuthSvg'>
                <div className='HeaderAuthSvgHead'><AuthHeadSVG/></div>
                <div className='HeaderAuthSvgBody'><AuthBodySVG/></div>
            </div>
            <div className='HeaderAuthText' onClick={() => userData.authed?(userData.admin?navigate('/admin'):noFunctional('Личный кабинет')):setOpenedModalWindow({type: 'phone', phone:''})}>{userData.authed?'+'+userData.phone:"Вход/Регистрация"}</div>
            <div className='HeaderCartSvg'>
                <div className='HeaderCartSvgUp'><CartUpSVG/></div>
                <div className='HeaderCartSvgDown'><CartDownSVG/></div>
            </div>
            <div className='HeaderCartText' onClick={() => navigate('/cart')}>{cart.sum} &#8381; / {cart.count} шт.</div>
        </div>
        </div>
        </div>
        <div className='openedCatalogBlock'
            onMouseEnter={() => setOpenedCatalog(true)}
            onMouseLeave={() => setOpenedCatalog(false)}
            onClick={() => setOpenedCatalog(false)}
        >
        {
            openedCatalog?<OpenedCatalog categories={categories}/>:<></>
        }
        </div>
        </div>
    );
}
export default Header;