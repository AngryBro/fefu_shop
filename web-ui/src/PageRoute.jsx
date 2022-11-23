import './css/PageRoute.css';
import RouteBackSVG from './svg/RouteBackSVG';
import React from 'react';

const PageRoute = ({route, back = false}) => {

    var [last, setLast] = React.useState({name: 'Главная', link: '/'});
    var [prev, setPrev] = React.useState([]);

    React.useEffect(() => {
        var temp = [];
        for(let i = 0; i < route.length-1; i++) {
            temp.push(route[i]);
        }
        setPrev(temp);
        setLast(route[route.length-1]);
    }, [route]);

    return (
        <div className='PageRoute'>
            {
                back?
                <div className='back'>
                    <div className='svg'><RouteBackSVG/></div>
                    <div className='routeBack' onClick={() => {document.location.href = last.link}}>{last.name}</div>
                </div>:
                <div className='routes'>
                    {
                        prev.map((route, index) => 
                            <div className='item' key={index}>
                                <div className='route' onClick={() => {document.location.href = route.link}}>{route.name}</div>
                                <div className='slash'>&nbsp; / &nbsp;</div>
                            </div>
                        )
                    }
                    <div className='routeLast' onClick={() => {document.location.href = last.link}}>{last.name}</div>
                </div>
            }
        </div>
    );
}

export default PageRoute;