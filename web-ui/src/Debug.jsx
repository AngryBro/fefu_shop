import React from 'react';
import CartPosition from './CartPosition';
import PriceDiscount from './PriceDiscount';
import CartCounter from './CartCounter';
import SuggestionsList from './SuggestionsList';
import AuthModalWindow from './PhoneModal';

const Debug = () => {

    return (
        <div style={{marginLeft:'50px', marginTop:'50px', width: '100px', height: '100px'}}>
            {/* <CartPosition/> */}
            {/* <CartCounter count={{get: 2}}/> */}
            <SuggestionsList suggestions={['хабар','комса', 'vdk', 'moscow']} />
            <AuthModalWindow/>
        </div>
    )
}

export default Debug;