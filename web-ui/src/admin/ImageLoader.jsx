import { useRef } from "react";
import Api from "../Api";

const ImageLoader = ({okCallback = () => 1}) => {
    
    const fileRef = useRef();
    
    const handler = () => {
        if(fileRef.current.value === '') return;
        Api('imageUpload').auth().imgUpload('photo',fileRef).callback(({ok, array}) => {
            if(ok) {
                okCallback(array);
            }
            else {
                fileRef.current.value = '';
            }
        }).send();
    }

    return (
        <div>
            <input type="file" ref={fileRef} onChange={handler} />
        </div>
    );
};

export default ImageLoader;