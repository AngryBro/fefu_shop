import { useEffect } from "react";
import { useState } from "react";

const SizeEditor = ({size, count, editSize}) => {

    var [newCount, setNewCount] = useState(0);

    useEffect(() =>{
        if(count !== undefined) setNewCount(count===null?null:(count<1?0:count));
    },[count]);

    const handleSelect = e => {
        var temp = e.target.value;
        var nc;
        switch(temp) {
            case 'null': {
                nc=null;
                break;
            }
            case '1': {
                nc=1;
                break;
            }
            case '0': {
                nc=0;
                break;
            }
            default: {
                nc=1;
                break;
            }
        }
        setNewCount(nc);
        editSize(size.name, nc);
    }
    const handleNewCount = e => {
        var c = Number(e.target.value);
        if(c > 0) {
            setNewCount(c);
            editSize(size.name, c);
        }
    }

    return (
                <tr>
                    <td>{size.name}:</td>
                    <td>
                        <select value={newCount===null?'null':(newCount>0?'1':'0')} onChange={handleSelect}>
                            <option value='null'>Не существует</option>
                            <option value='0'>На примерке</option>
                            <option value='1'>В наличии</option>
                        </select>
                    </td>
                    <td><span hidden={!(newCount>0)}><input type="number" onChange={handleNewCount} value={newCount>0?newCount:0} style={{marginRight:'10px', width:'50px'}}/>шт.</span></td>
                </tr>
    );
};

export default SizeEditor;