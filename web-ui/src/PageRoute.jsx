import './css/PageRoute.css';
import RouteBackSVG from './svg/RouteBackSVG';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageRoute = ({route, back = false}) => {


    const navigate = useNavigate();

    var [last, setLast] = React.useState({name: 'Главная', link: '/'});
    var [prev, setPrev] = React.useState([]);
    var [backTo, setBackTo] = React.useState({name: 'Вернуться в', link: ''});

    React.useEffect(() => {
        var temp = [];
        for(let i = 0; i < route.length-1; i++) {
            temp.push(route[i]);
        }
        if(back && route.length) {
            setBackTo(route[0]);
        }
        setPrev(temp);
        setLast(route[route.length-1]);
    }, [route, back]);

    return (
        <div className='PageRoute'>
            {
                back?
                <div className='PageRouteBack'>
                    <div className='PageRouteBackSvg'><RouteBackSVG/></div>
                    <div className='routeBack' onClick={() => {navigate(backTo.link)}}>{backTo.name}</div>
                    <div className='PageRouteBackLine'></div>
                    <div className='PageRouteBackCurrent'>{last.name}</div>
                </div>:
                <div className='routes'>
                    {
                        prev.map((route, index) => 
                            <div className='item' key={index}>
                                <div className='route' onClick={() => {navigate(route.link)}}>{route.name}</div>
                                <div className='slash'>&nbsp; / &nbsp;</div>
                            </div>
                        )
                    }
                    <div className='routeLast' onClick={() => {navigate(last.link)}}>{last.name}</div>
                </div>
            }
        </div>
    );
}

export default PageRoute;