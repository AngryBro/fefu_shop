const SelectCircleSVG = ({selected}) => (
    <div>
        {
            selected?
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.5" cy="8.5" r="8" stroke="#9CA0AB"/>
                <circle cx="8.5" cy="8.5" r="6" fill="#515562"/>
            </svg>:
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.5" cy="8.5" r="8" stroke="#9CA0AB"/>
            </svg>
        }
        
    </div>
);
export default SelectCircleSVG;
