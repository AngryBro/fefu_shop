import '../css/BigButton.css';

const BigButton = ({text, font = 14, color = '#12518B'}) => {
    return (
        <div className='BigButton' style={{backgroundColor: color}}>
            <div className='text' style={{fontSize: `${font}px`}}>
                {text}
            </div>
        </div>
    );
}

export default BigButton;