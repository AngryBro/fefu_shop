import React from 'react';
import './css/Footer.css';
import TelegramSVG from './svg/TelegramSVG';
import InstFooterSVG from './svg/InstFooterSVG';
import VkSVG from './svg/VkSVG';
import YouTubeSVG from './svg/YouTubeSVG';
import AvitoSVG from './svg/AvitoSVG';
import BigButton from './buttons/BigButton';

const Footer = ({categories, contacts, infoPages}) => { 
    
    var [linksCategories, setLinksCategories] = React.useState([[], []]);
    React.useEffect(() => {
        var temp = [];
        var temp1 = [];
        for(let i = 0; i<categories.length; i++) {
            if(categories[i].children.length === 0) {
                if(i < categories.length/2) {
                    temp.push(categories[i].name);
                }
                else {
                    temp1.push(categories[i].name);
                }
            }
        }
        setLinksCategories([temp, temp1]);
    }, [categories]);
    
    return  (
    <div className="Footer">
        <div className='FooterBlock'>
            <div className='upper'>
                <div className='callback'>
                    <div className='name'>logo</div>
                    <div className='button'>
                        <BigButton text='связаться с нами' color='#0F406D' font={12}/>
                    </div>
                    <div className='link'>
                        пол конф
                    </div>
                    <div className='link'>
                        соглашение
                    </div>
                </div>
                <div className='catalog'>
                    <div className='header'>КАТАЛОГ</div>
                    <div className='table'>
                        {
                            [0,1].map(i => 
                                <div className='column' key={i}>
                                    {
                                        linksCategories[i].map((category, index) => <div key={index} className='link'>{category}</div>)
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='about'>
                    <div className='header'>о компании</div>
                    {
                        infoPages.map(page => 
                            <a key={page.id} className='link' href={page.link} target='_blank' rel="noopener noreferrer">{page.name}</a>
                        )
                    }
                </div>
                <div className='contacts'>
                    <div className='header'>контакты</div>
                    <div className='phone'>phone</div>
                    <div className='email'>email</div>
                    <div className='icons'>
                        <div><TelegramSVG/></div>
                        <div><InstFooterSVG/></div>
                        <div><VkSVG/></div>
                        <div><YouTubeSVG/></div>
                        <div className='avito'><AvitoSVG/></div>
                    </div>
                </div>
            </div>
            <div className='line'></div>
            <div className='lower'>
                <div className='year'>&copy; logo, 2022</div>
                <div className='devby'>Developed by STUDNEE</div>
            </div>
        </div>
    </div>
);
}

export default Footer;