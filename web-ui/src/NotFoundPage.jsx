import BigButton from './buttons/BigButton';
import './css/NotFoundPage.css';
import C404SVG from './svg/C404SVG';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {

    const navigate = useNavigate();

    return (
        <div className='NotFoundPage'>
            <div className='centralBlock'>
                <div className='c404'><C404SVG/></div>
                <div className='mainText'>Такой страницы не существует</div>
                <div className='advice'>Попробуйте перезагрузить страницу или проверьте ссылку</div>
                <div className='button'><BigButton callback={() => navigate('/')} text='На главную' font={14}/></div>
                <div className='man'></div>
            </div>
        </div>
    );
};

export default NotFoundPage;