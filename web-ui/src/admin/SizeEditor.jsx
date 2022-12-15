import { useEffect } from "react";
import { useState } from "react";

const SizeEditor = ({size, count, editSize}) => {

    var [newCount, setNewCount] = useState(count);

    useEffect(() =>{
        setNewCount(count);
    },[count]);

    const handleSelect = e => {
        var temp = e.target.value;
        setNewCount(temp==='null'?null:temp==='0'?0:newCount);
        editSize(size.name, newCount);
    }
    const handleNewCount = e => {
        var c = e.target.value;
        if(c > 0) {
            setNewCount(c);
            editSize(size.name, newCount);
        }
    }

    return (
                <tr>
                    <td>{size.name}:</td>
                    <td>
                        <select value={newCount<0?'null':newCount===0?'0':'1'} onChange={handleSelect}>
                            <option value='null'>Не существует</option>
                            <option value='0'>На примерке</option>
                            <option value='1'>В наличии</option>
                        </select>
                    </td>
                    <td><span hidden={!(newCount>0)}><input type="number" onChange={handleNewCount} value={newCount} style={{marginRight:'10px', width:'50px'}}/>шт.</span></td>
                </tr>
    );
};

export default SizeEditor;