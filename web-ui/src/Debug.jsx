
import CatalogPaginator from "./CatalogPaginator";
// import Api from "./Api";

const Debug = () => {



    return (
        <div style={{marginLeft:'50px', marginTop:'50px', width: '1000px', height: '100px'}}>
            <CatalogPaginator pages={5} externalPage={() => 1} />
        </div>
    )
}

export default Debug;