import React from 'react';
import './css/OpenedCatalog.css';

const OpenedCatalog = ({categories}) => {

    var [categoriesLeft, setCategoriesLeft] = React.useState([]);
    var [categoriesRight, setCategoriesRight] = React.useState([]);

    React.useEffect(() => {
        var categoriesTemp = JSON.parse(JSON.stringify(categories));
        for(let i = 0; i<8; i++) {
            for(let j = 0; j<10; j++) {
                categoriesTemp[i].children.push({
                    id: 20+j,
                    name: 'category'+j,
                    children: []
                })
            };
        }
        var categoriesTempLeft = [];
        var categoriesTempRight = [];
        for(let i = 0; i<Math.min(3, categoriesTemp.length); i++) {
            categoriesTempLeft.push(categoriesTemp[i]);
        }
        for(let i = 3; i < categoriesTemp.length; i++) {
            categoriesTempRight.push(categoriesTemp[i]);
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
                                        <div className='element' key={child.id}>{child.name}</div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="right">
                {
                    categoriesRight.map(category => <div className='header' key={category.id}>
                        {category.name}
                    </div>
                    )
                }
            </div>
        </div>
    );
}

export default OpenedCatalog;