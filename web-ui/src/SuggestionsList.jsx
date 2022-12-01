import './css/SuggestionsList.css';

const SuggestionsList = ({suggestions = [], setData}) => {
    return (
        <div className='SuggestionsList'>
            {
                suggestions.map((item, index) =>
                    <div key={index} className='suggestionBlock' onClick={() => setData(item)}>
                        <div className='suggestionText'>
                            {item}
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default SuggestionsList;