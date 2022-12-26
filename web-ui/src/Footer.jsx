import React from 'react';
import './css/Footer.css';
import TelegramSVG from './svg/TelegramSVG';
import InstFooterSVG from './svg/InstFooterSVG';
import VkSVG from './svg/VkSVG';
import YouTubeSVG from './svg/YouTubeSVG';
import AvitoSVG from './svg/AvitoSVG';
import BigButton from './buttons/BigButton';
import { useNavigate } from 'react-router-dom';

const Footer = ({categories, contacts = {}, infoPages, setOpenedModalWindow}) => { 
    
    const navigate = useNavigate();

    var [linksCategories, setLinksCategories] = React.useState([[], []]);
    React.useEffect(() => {
        var temp1 = [];
        var temp2 = [];
        var temp = [];
        for(let i = 0; i<categories.length; i++) {
            if(categories[i].children.length===0) {
                temp.push(categories[i]);
            }
        };
        for(let i = 0; i < temp.length; i++) {
                if(i < temp.length/2) {
                    temp1.push(temp[i]);
                }
                else {
                    temp2.push(temp[i]);
                }
        }
        setLinksCategories([temp1, temp2]);
    }, [categories]);
    
    return  (
    <div className="Footer">
        <div className='FooterBlock'>
            <div className='upper'>
                <div className='callback'>
                    <div className='name'>logo</div>
                    <div className='button' onClick={() => setOpenedModalWindow({type: 'callback'})}>
                        <BigButton text='связаться с нами' color='#0F406D' font={12}/>
                    </div>
                    {
                        infoPages.footerLeft.map(page => 
                            <div className='link' key={page.id} onClick={() => window.open(`/info/${page.slug}`)}>
                                {page.header}
                            </div>    
                        )
                    }
                </div>
                <div className='catalog'>
                    <div className='header'>КАТАЛОГ</div>
                    <div className='table'>
                        {
                            [0,1].map(i => 
                                <div className='column' key={i}>
                                    {
                                        linksCategories[i].map((category, index) => <div onClick={() => navigate(`/catalog/${category.slug}`)} key={index} className='link'>{category.name}</div>)
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='about'>
                    <div className='header'>о компании</div>
                    {
                        infoPages.footerRight.map(page => 
                            <a key={page.id} className='link' href={`/info/${page.slug}`} target='_blank' rel="noopener noreferrer">{page.header}</a>
                        )
                    }
                </div>
                <div className='contacts'>
                    <div className='header'>контакты</div>
                    {
                        'phone_number' in contacts?
                        <div className='phone'>{contacts.phone_number.value}</div>:
                        <></>
                    }
                    {
                        'email' in contacts?
                        <div className='email'>{contacts.email.value}</div>:
                        <></>   
                    }
                    <div className='icons'>
                        {
                            'telegram' in contacts?
                            <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.telegram.value)}><TelegramSVG/></div>:
                            <></>
                        }
                        {
                            'instagram' in contacts?
                            <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.instagram.value)}><InstFooterSVG/></div>:
                            <></>
                        }
                        {
                            'vk' in contacts?
                            <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.vk.value)}><VkSVG/></div>:
                            <></>
                        }
                        {
                            'youtube' in contacts?
                            <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.youtube.value)}><YouTubeSVG/></div>:
                            <></>
                        }
                        {
                            'avito' in contacts?
                            <div style={{cursor:'pointer'}} onClick={() => window.open(contacts.avito.value)} className='avito'><AvitoSVG/></div>:
                            <></>
                        }
                    </div>
                </div>
            </div>
            <div className='line'></div>
            <div className='lower'>
                <div className='year'>&copy; logo, 2022</div>
                <div className='devby' style={{cursor:'pointer'}} onClick={() => window.open('https://vk.com/angyrbro')}>Developed by STUDNEE</div>
            </div>
        </div>
    </div>
);
}

export default Footer;