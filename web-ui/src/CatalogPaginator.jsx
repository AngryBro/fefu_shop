import './css/CatalogPaginator.css';
import { useState } from 'react';
import ArrowPaginatorSVG from './svg/ArrowPaginatorSVG';

const CatalogPaginator = ({pages, externalPage}) => {

    const showPages = 7;

    var [page, setPage] = useState(1);

    var goto = p => {
        setPage(p);
        externalPage(p);
    }
    var next = () => page<pages?goto(page+1):1;
    var prev = () => page>1?goto(page-1):1;

    var pagesArray = () => {
        var temp = [];
        var pageStart = Math.max(1,page!==pages?(page>showPages-1?page-showPages+2:1):pages-showPages+1);
        var pageEnd = Math.min(pages, pageStart+showPages-1);
        for(let i = pageStart; i <= pageEnd; i++) {
            temp.push(i);
        }
        return temp;
    }

    return (
        <div className='CatalogPaginator'>
            <div className='prev' onClick={prev} style={{opacity: page===1?'0':'1', cursor: page===1?'default':'pointer'}}>
                <div className='arrow'>
                    <ArrowPaginatorSVG/>
                </div>
                <div className='textNextPrev'>
                    Назад
                </div>
            </div>
            <div className='pages'>
                {
                    pagesArray().map(page_ => 
                        <div key={page_} className={page_===page?'pageSelected':'page'} onClick={() => goto(page_)}>
                            <div className='pageNumber'>
                                {page_}
                            </div>
                        </div>    
                    )
                }
            </div>
            <div className='next' onClick={next} style={{opacity: page===pages?'0':'1', cursor: page===pages?'default':'pointer'}}>
                <div className='textNextPrev'>
                    Далее
                </div>
                <div className='arrow'>
                    <ArrowPaginatorSVG/>
                </div>
            </div>
        </div>  
    );
}

export default CatalogPaginator;