import './css/SortCatalog.css';
import {useState, useEffect} from 'react';
import ListArrowSVG from './svg/ListArrowSVG';


const SortCatalog = ({params, setExternalSort}) => {
    
    var [sort, setSort] = useState(params[0]);
    var [opened, setOpened] = useState(false);

    useEffect(() => {
        setExternalSort(sort);
    }, [sort, setExternalSort]);
    
    return (
        <div className='SortCatalog'>
            <div className='block' onClick={() => setOpened(!opened)}>
                <div className='text'>{sort.slug==='reset'?'Сортировать':sort.name}</div>
                <div className='arrow'><ListArrowSVG /></div>
            </div>
            <div className='list' hidden={!opened}>
                    {
                        params.map(param => 
                            <div key={param.slug} className='itemBlock' onClick={() => {setSort(param); setOpened(false)}}>
                                <div className='itemSort'>
                                    {
                                        param.name
                                    }
                                </div>
                            </div>
                        )
                    }
            </div>
        </div>
    );
};

export default SortCatalog;