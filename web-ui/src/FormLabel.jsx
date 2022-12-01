import { useState } from 'react';
import './css/FormLabel.css';
import SuggestionsList from './SuggestionsList';

const FormLabel = ({labelName, validation, error, data, disabled = false, suggestionsParams={use: false}}) => {

    const getSuggestions = async (input) => {
        if(!suggestionsParams.use) return;
        if(input.length<suggestionsParams.minLength) {
            setSuggestions([]);
            return;
        }
        var params = suggestionsParams.more;
        params.push(input);
        params = params.join(' ');
        var promise = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',{
            method: 'post',
            headers: {
                'Authorization': 'Token ee6f3c521b3f2f04cbf6d21fb9949f7a797c5ced',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: params
            })
        });
        var response = await promise.json();
        var temp = [];
        response.suggestions.forEach(r => {
            if(r.data[suggestionsParams.key]!==null) {
                temp.push(r.data[suggestionsParams.key]);
            }
        });
        setSuggestions(Array.from(new Set(temp)));
    }

    var [focus, setFocus] = useState(false);
    var [suggestions, setSuggestions] = useState([]);


    return (
        <div className='FormLabel'>
            <div className='labelName'>{labelName}</div>
            <div className={focus&&!disabled?'inputBlockFocus':'inputBlock'}>
            <input
                style={disabled?{color: 'transparent', textShadow: '0 0 0 grey'}:{}}
                onFocus={() => setFocus(true)}
                onBlur={() => setInterval(() => setFocus(false), 100)}
                readOnly={disabled}
                value={data.get}
                onChange={e => {
                    var value = e.target.value;
                    data.set(value);
                    getSuggestions(value);
                }}>
            </input>
            <div className='suggestions' hidden={!focus||!suggestions.length} style={{height: `${40*Math.min(3,suggestions.length)}px`}}>
                <SuggestionsList suggestions={suggestions} setData={data.set} />
            </div>
            </div>
        </div>
    );

};

export default FormLabel;