import { useRef } from "react";
import Api from "../Api";

const ImageLoader = ({okCallback = () => 1, images = [], deleteCallback = undefined, loadHidden = false, width='50px', height='50px'}) => {
    
    const fileRef = useRef();
    
    const handler = () => {
        if(fileRef.current.value === '') return;
        Api('imageUpload').auth().imgUpload('photo',fileRef).callback(({ok, array}) => {
            if(ok) {
                okCallback(array);
            }
            fileRef.current.value = '';
        }).send();
    }

    return (
        <div style={{width:'fit-content'}}>
            {
                images.map((image,i) => 
                    image!==undefined&&image!==null?<div key={i} style={{overflow:'hidden', marginBottom:'5px', border:'1px solid grey', width:'fit-content'}}>
                        {
                            images.length===1?<></>:
                            <div style={{float:'left'}}>{i+1}</div>
                        }
                        <img onClick={() => window.open(Api().img(image))} src={Api().img(image)} alt="изображение" style={{display:'block',float:'left',width,height}} />
                        {
                            deleteCallback===undefined?<></>:
                            <button onClick={() => deleteCallback(image)}>&#10006;</button>
                        }
                    </div>:<div key={i} />
                )
            }
            {
                loadHidden?<></>:<input style={{width:'100%'}} type="file" ref={fileRef} onChange={handler} />
            }
        </div>
    );
};

export default ImageLoader;