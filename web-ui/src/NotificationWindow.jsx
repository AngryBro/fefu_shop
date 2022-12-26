import './css/AuthModalWindow.css';
import './css/PhoneModal.css';
import DeleteCartPositionSVG from './svg/DeleteCartPositionSVG';
import BigButton from './buttons/BigButton';

const NotificationWindow = ({close, message}) => {


    return (
        <div className='AuthModalWindow' style={{display: 'flex'}}>
            <div className='modalWindowBlock' style={{width: 'fit-content', maxWidth:'500px'}}>
                <div className='modalWindowInnerBlock'>
                    <div className='modalWindowTitleText PhoneModalTitle'>
                        Сообщение
                    </div>
                    <div className='modalWindowDescriptionText PhoneModalDescription'>
                        {message}
                    </div>
                    <div className='modalWindowButton'>
                        <BigButton callback={close} text='ОК' font={14}/>    
                    </div>
                </div>
                <div className='modalWindowClose' onClick={close}>
                    <DeleteCartPositionSVG color='#ADB1BB'/>
                </div>
            </div>
        </div>
    );

};

export default NotificationWindow;