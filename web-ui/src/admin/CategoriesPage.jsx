import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import ImageLoader from "./ImageLoader";


const CategoriesPage = () => {

    const nav = useNavigate();
    const defaultCreateParams = useMemo(() => ({
        name: '',
        slug: '',
        parent_id: 0,
        image: ''
    }), []);
    const fetchData = () => setFetchFlag(!fetchFlag);
    const update = () => {
        if(Object.keys(updateParams).length===0) {
            setEditId(0);
            return;
        }
        var postParams = JSON.parse(JSON.stringify(updateParams));
        postParams.id = editId;
        Api('categoryUpdate').auth().post(postParams).callback(({ok}) => {
            if(ok) {
                fetchData();
            }
            else {
                alert('Некорректные данные');
            }
        }).send();
    };
    const create = () => {
        Api('categoryCreate').auth().post(createParams).callback(({ok, status}) => {
            if(ok) {
                fetchData();
            }
            if(status === 400) {
                alert('Уже есть такая категория');
            }
            if(status === 422) {
                alert('Некорректные данные');
            }
        }).send();
    }
    const appendParam = (key, value, params = false) => {
        var temp = JSON.parse(JSON.stringify(params?createParams:updateParams));
        temp[key] = value;
        if(params) {
            setCreateParams(temp);
        }
        else {
            setUpdateParams(temp);
        }
    }
    const updating = (category, key) => {
        if(key === 'parent_id') {
            return key in updateParams?updateParams[key]:category.parents_all.length?category.parents_all[0].id:'Нет';
        }
        return key in updateParams?updateParams[key]:category[key];
    }
    const withoutSelf = (array, id) => {
        var temp = [];
        array.forEach(e => {
            if(e.id !== id) {
                temp.push(e);
            } 
        });
        return temp;
    }


    var [categories, setCategories] = useState([]);
    var [fetchFlag, setFetchFlag] = useState(true);
    var [editId, setEditId] = useState(0);
    var [updateParams, setUpdateParams] = useState({});
    var [createParams, setCreateParams] = useState(defaultCreateParams);

    useEffect(() => {
        Api('adminCategories').auth().callback(({ok, array}) => {
            if(ok) {
                setCategories(array);
                setEditId(0);
                setUpdateParams({});
                setCreateParams(defaultCreateParams);
            }
        }).send();
    }, [fetchFlag, defaultCreateParams]);

    return (
        <div className="AdminPage">
            <h1 onClick={() => nav('/admin')}>Категории</h1>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>id</th>
                            <th>Название</th>
                            <th>url</th>
                            <th>Превью (квадратное)</th>
                            <th>Родительская</th>
                            <th>Дочерние</th>
                            <th>Показывать</th>
                            <th>Редактировать</th>
                        </tr>
                        <tr>
                            <th><button onClick={create}>создать</button></th>
                            <th><input value={createParams.name} onChange={e => appendParam('name', e.target.value, 'c')} /></th>
                            <th><input value={createParams.slug} onChange={e => appendParam('slug', e.target.value, 'c')} /></th>
                            <th><ImageLoader images={[createParams.image]} okCallback={array => appendParam('image', array.tempname, 'c')} /></th>
                            <th>
                                <select value={createParams.parent_id} onChange={e => appendParam('parent_id', Number(e.target.value), 'c')}>
                                    <option value="0">Нет</option>
                                    {
                                        categories.map(category =>
                                            <option key={category.id} value={category.id}>{category.name}</option>    
                                        )
                                    }
                                </select>
                            </th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        {
                            categories.length?<></>:
                            <tr>
                                <td style={{color:'grey'}}>загрузка</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        }
                        {
                            categories.map(category =>
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>
                                        {
                                            editId===category.id
                                            ?<input value={updating(category, 'name')} onChange={e => appendParam('name', e.target.value)} />
                                            :category.name
                                        }
                                    </td>
                                    <td>
                                        {
                                            editId===category.id
                                            ?<input value={updating(category, 'slug')} onChange={e => appendParam('slug', e.target.value)} />
                                            :category.slug
                                        }
                                    </td>
                                    <td style={{width: 'max-content'}}>
                                        {
                                            editId===category.id
                                            ?<div style={{width:'160px'}}>
                                                <ImageLoader okCallback={array => appendParam('image', array.tempname)} images={[updating(category, 'image')]} />
                                            </div>
                                            :category.image!==null?<div style={{width:'50px', height:'50px', backgroundSize:'cover', backgroundImage: Api().cssimg(category.image)}} />:'нет'
                                        }
                                    </td>
                                    <td>
                                        {
                                            editId===category.id
                                            ?<select value={updating(category, 'parent_id')} onChange={e => appendParam('parent_id', Number(e.target.value))}>
                                                <option value="0">Нет</option>
                                                {
                                                    withoutSelf(categories, category.id).map(cat =>
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    )
                                                }
                                            </select>
                                            :category.parents_all.length?category.parents_all[0].name:'Нет'
                                        }
                                    </td>
                                    <td>
                                        {
                                            category.children_all.length?
                                            <select value='0' readOnly={true}>
                                                <option value="0"></option>
                                                    {
                                                        category.children_all.map(child =>
                                                            <option key={child.id} value={child.id}>{child.name}</option>    
                                                        )
                                                    }
                                            </select>:'Нет'
                                        }
                                        
                                    </td>
                                    <td>
                                        {
                                            editId===category.id
                                            ?<select value={Number(updating(category, 'show'))} onChange={e => appendParam('show', e.target.value==='1'?true:false)}>
                                                <option value={1}>Да</option>
                                                <option value={0}>Нет</option>
                                            </select>
                                            :category.show?'Да':'Нет'
                                        }
                                    </td>
                                    <td>
                                        {
                                            editId===category.id
                                            ?<button onClick={update}>сохранить</button>
                                            :<button onClick={() => setEditId(category.id)}>изменить</button>
                                        }
                                    </td>
                                </tr>    
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesPage;