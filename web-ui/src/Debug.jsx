import React from 'react';
import Product from './Product';

const Debug = () => {
    return (
        <div style={{marginLeft:'50px', marginTop:'50px'}}>
            <Product
            data={{
                id: 1,
                name: 'Киса',
                price: 9999,
                price_discount: 7000,
                message: 'Лучшая цена',
                image_preview: 'url(https://koshka.top/uploads/posts/2021-12/1639887182_59-koshka-top-p-pukhlenkii-kotik-62.jpg)'
            }}
            />
        </div>
    )
}

export default Debug;