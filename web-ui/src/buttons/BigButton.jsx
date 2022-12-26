import '../css/BigButton.css';

const BigButton = ({text, font = 14, color = '#12518B', disabled = false, callback}) => {
    return (
        <div className='BigButton' style={{backgroundColor: disabled?'grey':color}} onClick={disabled?()=>1:callback}>
            <div className='BigButtonText' style={{fontSize: `${font}px`}}>
                {text}
            </div>
        </div>
    );
}

export default BigButton;