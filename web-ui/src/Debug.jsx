import React from 'react';

const Debug = ({cartAction}) => {
    return <div>1234 <button onClick={cartAction.inc}>+</button><button onClick={cartAction.dec}>-</button></div>
}

export default Debug;