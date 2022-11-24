import React from 'react';
import './css/SizeSelect.css';

const SizeSelect = ({sizes, selectedSize, opened}) => {
    
    return (
        <div className='SizeSelect' onClick={() => opened.set(!opened.get)}>
            <div className='selectedBlock'>
                <div className='selected'>
                    {selectedSize.get}
                </div>
            </div>
            <div className='arrow'>
                <svg style={{position: 'absolute'}} width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5L3.5 3.5L6.5 0.5" stroke="#9CA0AB" stroke-linecap="round"/>
                </svg>
            </div>
            <div className='opened' hidden={!opened.get}>
                {
                    sizes.map(size => 
                        <div key={size} className='itemBlock' onClick={() => selectedSize.set(size)}>
                            <div className='item'>{size}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default SizeSelect;