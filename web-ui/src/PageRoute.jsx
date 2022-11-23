import './css/PageRoute.css';
import RouteBackSVG from './svg/RouteBackSVG';
import React from 'react';

const PageRoute = ({route, back = false}) => {


    return (
        <div className='PageRoute'>
            {
                back?
                <div className='back'>
                    <div className='svg'><RouteBackSVG/></div>
                    <div className='route'>{route[0]}</div>
                </div>:
                <div className='routes'>
                    {
                        route.map((r, index) => 
                            index !== r.length-1?
                            <div key={index} className='route'>{r+'/'}</div>:
                            <div key={index} className='routeLast'>{r}</div>
                        )
                    }
                </div>
            }
        </div>
    );
}

export default PageRoute;