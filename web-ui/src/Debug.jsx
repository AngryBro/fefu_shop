import { useEffect } from "react";
import { useState } from "react";
// import Api from "./Api";

const Debug = () => {

    var [seconds, setSeconds] = useState(100);

    useEffect(() => {
        var timer = setInterval(() => setSeconds(s => s>0?s-1:0), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{marginLeft:'50px', marginTop:'50px', width: '100px', height: '100px'}}>
            {seconds}
        </div>
    )
}

export default Debug;