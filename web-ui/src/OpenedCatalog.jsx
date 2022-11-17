import './css/OpenedCatalog.css';

const OpenedCatalog = ({categories}) => {

    categories = [];
    for(let i = 0; i<10; i++) {
        categories.push({
            id: i,
            name: 'категория'+i,
            children: []
        });
        for(let j = 0; j<10; j++) {
            categories[i].children.push({
                id: 20+j,
                name: 'category'+j,
                children: []
            })
        };
    }
    var categoriesLeft = [];
    var categoriesRight = [];
    for(let i = 0; i<Math.min(3, categories.length); i++) {
        categoriesLeft.push(categories[i]);
    }
    for(let i = 3; i < categories.length; i++) {
        categoriesRight.push(categories[i]);
    }

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