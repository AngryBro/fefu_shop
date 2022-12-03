import '../css/BigButton.css';

const BigButton = ({text, font = 14, color = '#12518B', disabled = false}) => {
    return (
        <div className='BigButton' style={{backgroundColor: disabled?'grey':color}}>
            <div className='text' style={{fontSize: `${font}px`}}>
                {text}
            </div>
        </div>
    );
}

export default BigButton;