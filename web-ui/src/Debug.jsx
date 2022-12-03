import { useEffect } from "react";
import { useState } from "react";
import Api from "./Api";

const Debug = () => {

    var [data, setData] = useState([]);

    useEffect(() => {
        Api('productsMeta').callback(({json}) => setData(json)).send(); 
    }, []);

    return (
        <div style={{marginLeft:'50px', marginTop:'50px', width: '100px', height: '100px'}}>
            {console.log(data)}
        </div>
    )
}

export default Debug;