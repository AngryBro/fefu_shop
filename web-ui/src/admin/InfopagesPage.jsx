import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import ImageLoader from "./ImageLoader";

const PlaceCheckboxes = ({onChangeHandle, value}) => {

    const onChangePlace = e => {
        var temp = value;
        temp = temp.replace(e.target.value, '');
        if(e.target.checked) {
            temp += e.target.value;
        }
        onChangeHandle('place', Number(temp));
    };

    return (
        <div>
            {
                ['В шапке', 'В подвале слева', 'В подвале справа']
                .map((place, index) =>
                    <div style={{width:'fit-content' ,overflow:'hidden'}} key={index}><div style={{float:'left', width:'fit-content'}}><input onChange={onChangePlace} style={{width:'20px'}} value={index+1} checked={value!==undefined?(String(value).indexOf(String(index+1))!==-1):false} type="checkbox" /></div><div style={{float:'left', width:'fit-content'}}>{place}</div></div>
                )
            }
        </div>
    );
};

const Table = ({data = {}, callback}) => {

    const [values, setValues] = useState({});

    const onChangeHandle = (key, e) => {
        var val = e;
        var temp = JSON.parse(JSON.stringify(values));
        if(val === undefined) {
            delete temp[key];
        }
        else {
            temp[key] = val;
        }
        setValues(temp); console.log(temp);
    }

    const deleteImageCallback = (img) => {
        var temp = JSON.parse(JSON.stringify(values)).images;
        var i = temp.indexOf(img);
        temp.splice(i,1);
        onChangeHandle('images', temp);
    }

    useEffect(() => {
        if(Object.keys(data).length) {
            setValues(data);
        }
    }, [data]);

    return (
        <table className="borderTable">
            <tbody>
            <tr>
                <th>Название</th>
                <td><input value={'header' in values?values.header:''} onChange={e => onChangeHandle('header', e.target.value)} /></td>
            </tr>
            <tr>
                <th>url</th>
                <td><input value={'slug' in values?values.slug:''} onChange={e => onChangeHandle('slug', e.target.value)} /></td>
            </tr>
            <tr>
                <th>Главное изображение (928х217)</th>
                <td><ImageLoader width="300px" height="70px" loadHidden={values.image_header!==null&&values.image_header!==undefined} images={values.image_header!==null&&values.image_header!==undefined?[values.image_header]:[]} deleteCallback={() => onChangeHandle('image_header',undefined)} okCallback={array => onChangeHandle('image_header', array.tempname)}/></td>
            </tr>
            <tr>
                <th>Текст первый</th>
                <td><textarea className="InfopageEditText" onChange={e => onChangeHandle('text1', e.target.value)} value={'text1' in values?values.text1:''} /></td>
            </tr>
            <tr>
                <th>Изображения (266х154)</th>
                <td><ImageLoader images={'images' in values&&values.images!==null?values.images:[]} deleteCallback={deleteImageCallback} okCallback={array => {var temp = JSON.parse(JSON.stringify(values.images===null||values.images===undefined?[]:values.images)); temp.push(array.tempname); onChangeHandle('images', temp)}} /></td>
            </tr>
            <tr>
                <th>Текст второй</th>
                <td><textarea className="InfopageEditText" onChange={e => onChangeHandle('text2', e.target.value)} value={'text2' in values?values.text2:''} /></td>
            </tr>
            <tr>
                <th>Расположение на сайте</th>
                <td>
                    <PlaceCheckboxes onChangeHandle={onChangeHandle} value={'place' in values?String(values.place):''} />
                </td>
            </tr>
            {   Object.keys(data).length?
                <tr>
                    <th>Скрыта</th>
                    <td>
                        <select value={Number('hidden' in values?values.hidden:true)} onChange={e => onChangeHandle('hidden', Boolean(Number(e.target.value)))}>
                            <option value="0">Нет</option>
                            <option value="1">Да</option>
                        </select>
                    </td>
                </tr>:<></>
            }
            <tr>
                <th></th>
                <td><button onClick={() => callback(values)}>сохранить</button></td>
            </tr>
            </tbody>
        </table>
    );
}

const InfopagesPage = () => {

    const nav = useNavigate();

    const [pages, setPages] = useState([]);

    const [selected, setSelected] = useState(0);

    const [fetchFlag, setFetchFlag] = useState(true);

    const [page, setPage] = useState({});

    const [editOpened, setEditOpened] = useState(false);

    const [createOpened, setCreateOpened] = useState(false);

    const del = id => {
        Api('infopageDelete').auth().post({id}).callback(({ok}) => {
            if(ok) {
                fetchData();
            }
        }).send();
    };

    const update = (values) => {
        var temp = JSON.parse(JSON.stringify(values));
        temp.id = selected;
        if(JSON.stringify(page) === JSON.stringify(values)) {
            setSelected(0);
            return setEditOpened(false);
        }
        Api('infopageUpdate').auth().post(temp).callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            if(status === 422) {
                alert('Некорректные данные');
            }
            if(status === 400) {
                alert('Страница с такими данными уже есть');
            }
        }).send();
    }

    const create = values => {
        Api('infopageCreate').auth().post(values).callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            if(status === 422) {
                alert('Некорректные данные');
            }
            if(status === 400) {
                alert('Страница с такими данными уже есть');
            }
        }).send();
    }

    const fetchData = () => setFetchFlag(!fetchFlag);

    useEffect(() => {
        Api('adminInfopagesAll').auth().callback(({ok, array}) => {
            setPages(ok?array:[{header:'error', id: null}]);
            setSelected(0);
            setEditOpened(false);
            setCreateOpened(false);
        }).send();
    }, [fetchFlag]);

    useEffect(() => {
        if(selected === 0) {
            setEditOpened(false);
            setCreateOpened(false);
            return () => 1;
        }
        Api('adminInfopageGet').auth().get({id: selected}).callback(({ok, array}) => {
            setPage(ok?array:{});
            if(ok) {
                setEditOpened(true);
            }
        }).send();
    }, [selected]);

    return (
        <div className="AdminPage">
            <h1 onClick={() => nav('/admin')}>Информационные страницы</h1>
            <div style={{float: 'left', width:'fit-content'}}>
                <table>
                    <tbody>
                        <tr>
                            <th>id</th>
                            <th>Название</th>
                            <th>Скрыта</th>
                            <th>Удалить</th>
                        </tr>
                        <tr>
                            <td><button onClick={() => setCreateOpened(!createOpened)}>{createOpened?'закрыть форму':'создать'}</button></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {pages.length?<></>:<tr><td style={{color:'grey'}}>загрузка</td><td></td><td></td><td></td></tr>}
                        {
                            pages.map(page => 
                                <tr key={page.id}  style={{backgroundColor:page.id===selected?'grey':'white', cursor:'pointer'}}>
                                    <td onClick={() => setSelected(page.id===selected?0:page.id)}>{page.id}</td>
                                    <td onClick={() => setSelected(page.id===selected?0:page.id)}>{page.header}</td>
                                    <td onClick={() => setSelected(page.id===selected?0:page.id)}>{page.hidden?'Да':'Нет'}</td>
                                    <td><button onClick={() => del(page.id)}>&#10006;</button></td>
                                </tr>    
                            )
                        }
                    </tbody>
                </table>
            </div>
            {
                editOpened?
                <div style={{float: 'left', marginLeft:'50px', width:'fit-content'}}>
                    <Table data={page} callback={update} />
                </div>:<></>
            }
            {
                createOpened?
                <div style={{float: 'left', marginLeft:'50px'}}>
                    <Table callback={create} />
                </div>:<></>
            }
        </div>
    );
};
export default InfopagesPage;