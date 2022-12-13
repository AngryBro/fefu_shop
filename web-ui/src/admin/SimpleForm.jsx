const SimpleForm = ({data, submit, text, opened}) => {
    return (
        <div hidden={!opened} style={{marginTop:'-20px', marginBottom:'50px', fontSize:'18pt'}}>
            <table>
                <tbody>
                    {
                        data.map((item,i) => 
                            <tr key={i}>
                                <td>{item.key}:</td>
                                <td><input style={{fontSize:'18pt'}} type="text" value={item.value} onChange={e => item.setter(e.target.value)} /></td>
                            </tr>
                        )
                    }
                    <tr>
                        <td></td>
                        <td><button style={{fontSize:'18pt'}} onClick={submit}>{text}</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SimpleForm;