import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/OpenedCatalog.css';

const OpenedCatalog = ({categories}) => {


    const navigate = useNavigate();
    var [categoriesLeft, setCategoriesLeft] = React.useState([]);
    var [categoriesRight, setCategoriesRight] = React.useState([]);

    React.useEffect(() => {
        var categoriesTempLeft = [];
        var categoriesTempRight = [];
        for(let i = 0; i < categories.length; i++) {
            if(categories[i].children.length) {
                categoriesTempLeft.push(categories[i]);
            }
            else {
                categoriesTempRight.push(categories[i]);
            }
        }
        for(let i = 0; i < categoriesTempLeft.length-2; i++) {
            categoriesTempLeft.splice(Math.round(Math.random()*categoriesTempLeft.length),1);
        }
        
        setCategoriesLeft(categoriesTempLeft);
        setCategoriesRight(categoriesTempRight);
    }, [categories]);

    return (
        <div className="OpenedCatalog">
            <div className="left">
                {
                    categoriesLeft.map(category => 
                        <div className="column" key={category.id}>
                            <div className="header">{category.name}</div>
                            <div className="rows">
                                {
                                    category.children.map(child => 
                                        <div className='element' onClick={() => navigate(`/catalog/${child.slug}`)} key={child.id}>{child.name}</div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="right">
                {
                    categoriesRight.map(category => <div className='header' onClick={() => navigate(`/catalog/${category.slug}`)} key={category.id}>
                        {category.name}
                    </div>
                    )
                }
            </div>
        </div>
    );
}

export default OpenedCatalog;