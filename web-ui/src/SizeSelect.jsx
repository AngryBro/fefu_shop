import React from 'react';
import './css/SizeSelect.css';
import ListArrowSVG from './svg/ListArrowSVG';

const SizeSelect = ({sizes, selectedSize, opened}) => {
    
    return (
        <div className='SizeSelect' onClick={() => opened.set(!opened.get)}>
            <div className='selectedBlock'>
                <div className='selected'>
                    {selectedSize.get}
                </div>
            </div>
            <div className='arrow'>
                <ListArrowSVG />
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