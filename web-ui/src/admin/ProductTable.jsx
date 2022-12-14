import { useEffect } from "react";
import { useState } from "react";
import SizeEditor from "./SizeEditor";
import Api from "../Api";
import ImageLoader from "./ImageLoader";

const ProductTable = ({loaded,productsMeta, categories, product = {}, edit = false, update = ()=>1, setEdit = ()=>1}) => {

    const editParam = (key, value) => {
        var temp = JSON.parse(JSON.stringify(params));
        temp[key] = value;
        setParams(temp);
    }

    const appendImage = array => {
        var temp = JSON.parse(JSON.stringify(params));
        if(temp.images===undefined) {
            temp.images = [];
        }
        temp.images.push(array.tempname);
        setParams(temp);
    }

    const deleteImage = image => {
        var temp = JSON.parse(JSON.stringify(params));
        if(temp.delete_images===undefined) {
            temp.delete_images = [];
        }
        temp.delete_images.push(image);
        setParams(temp);
    }

    const actualImages = (params) => {
        var temp = JSON.parse(JSON.stringify(params));
        if(temp.delete_images===undefined) {
            temp.delete_images = [];
        }
        if(temp.images===undefined) {
            temp.images = [];
        }
        var prod = [];
        if(product.images!==undefined) {
            prod = product.images;
        }
        var total = [];
        prod.forEach(p => total.push(p.image));
        temp.images.forEach(t => total.push(t));
        temp.delete_images.forEach(img => {
            var index = total.indexOf(img);
            total.splice(index,1);
        });
        return total;
    }

    var [params, setParams] = useState({});

    useEffect(() => {
        if(edit&&loaded) {
            setParams({});
        }
    }, [edit, loaded]);


    return (
        <table className="borderTable" style={{width:'630px'}}>
            <tbody>
                <tr>
                    <th>Название</th>
                    <td>
                        {
                            edit?
                            <input value={'name' in params?params.name:'name' in product?product.name:''} onChange={e => editParam('name', e.target.value)} />:
                            product.name
                        }
                    </td>
                </tr>
                <tr>
                    <th>Название для url</th>
                    <td>
                        {
                            edit?
                            <input value={'slug' in params?params.slug:'slug' in product?product.slug:''} onChange={e => editParam('slug', e.target.value)}/>:
                            product.slug
                        }
                    </td>
                </tr>
                <tr>
                    <th>Артикул</th>
                    <td>
                        {
                            edit?
                            <input value={'article' in params?params.article:'article' in product?product.article:''} onChange={e => editParam('article', e.target.value)}/>:
                            product.article
                        }
                    </td>
                </tr>
                <tr>
                    <th>Категория</th>
                    <td>
                        {
                            edit?
                            <select onChange={e => editParam('category_id', Number(e.target.value))} value={'category_id' in params?params.category_id:'category_id' in product?product.category_id:0}>
                                <option value={0}>Не выбрано</option>
                                {
                                    categories.map(category => 
                                        <option key={category.id} value={category.id}>{category.name}</option>    
                                    )
                                }
                            </select>
                            :
                            product.category
                        }
                    </td>
                </tr>
                <tr>
                    <th>Брэнд</th>
                    <td>
                        {
                            edit?
                            <select onChange={e => editParam('brand_id', Number(e.target.value))} value={'brand_id' in params?params.brand_id:'brand_id' in product?product.brand_id:'0'}>
                                <option value={0}>Не выбрано</option>
                                {
                                    productsMeta.brands.map(brand => 
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>    
                                    )
                                }
                            </select>:
                            product.brand
                        }
                    </td>
                </tr>
                <tr>
                    <th>Цвет</th>
                    <td>
                        {
                            edit?
                            <select onChange={e => editParam('color_id', Number(e.target.value))} value={'color_id' in params?params.color_id:'color_id' in product?product.color_id:'0'}>
                                <option value={0}>Не выбрано</option>
                                {
                                    productsMeta.colors.map(color =>
                                        <option value={color.id} key={color.id}>{color.name}</option>    
                                    )
                                }
                            </select>:product.color_name
                        }
                    </td>
                </tr>
                <tr>
                    <th>Состав</th>
                    <td>
                        {
                            edit?
                            <select onChange={e => editParam('material_id', Number(e.target.value))} value={'material_id' in params?params.material_id:'material_id' in product?product.material_id:'0'}>
                                <option value={0}>Не выбрано</option>
                                {
                                    productsMeta.materials.map(material =>
                                        <option value={material.id} key={material.id}>{material.name}</option>    
                                    )
                                }
                            </select>:product.material
                        }
                    </td>
                </tr>
                <tr>
                    <th>Описание</th>
                    <td>
                        {
                            edit?
                            <textarea style={{width:'100%', height:'100px'}} value={'description' in params?params.description:'description' in product?product.description:''} onChange={e => editParam('description', e.target.value)}/>
                            :product.description
                        }
                    </td>
                </tr>
                <tr>
                    <th>Размеры</th>
                    <td>
                        <table style={{border:'none', marginBottom:'0px'}}>
                            <tbody className="tableNoneBorder">
                                {
                                    productsMeta.sizes.map(size => 
                                        edit?
                                        <SizeEditor size={size} key={size.id} count={product[size.name]} editSize={editParam}/>:
                                        <tr key={size.id}>
                                            <td>{size.name}:</td>
                                            <td>{product[size.name]===null?'Не существует':product[size.name]>0?`${product[size.name]} шт.`:'На примерке'}</td>
                                        </tr>   
                                    )
                                }
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>Цена</th>
                    <td>
                        {
                            edit?
                            <input value={'price' in params?params.price:'price' in product?product.price:''} onChange={e => editParam('price', Number(e.target.value))}/>
                            :product.price
                        }
                    </td>
                </tr>
                <tr>
                    <th>Скидка</th>
                    <td>
                        {
                            edit?
                            <input value={'discount' in params?params.discount:'discount' in product?product.discount:''} onChange={e => editParam('discount', Number(e.target.value))}/>
                            :product.discount
                        }
                    </td>
                </tr>
                <tr hidden={product.id===undefined}>
                    <th>Показывать</th>
                    <td>
                        {
                            edit?
                            <select onChange={e => editParam('show', e.target.value==='true')} value={String('show' in params?params.show:('show' in product?product.show:'false'))}>
                                <option value={true}>Да</option>
                                <option value={false}>Нет</option>
                            </select>
                            :product.show?'Да':'Нет'
                        }
                    </td>
                </tr>
                <tr>
                    <th>Превью (464х612)</th>
                    <td>
                        {
                            edit?
                            <ImageLoader images={'image_preview' in params?[params.image_preview]:[product.image_preview]} okCallback={(array) => editParam('image_preview', array.tempname)}  />
                            :
                            <div style={{width:'50px',border:'1px grey solid',height:'50px',backgroundSize:'cover', backgroundImage:Api().cssimg(product.image_preview)}} />
                        }
                    </td>
                </tr>
                <tr>
                    <th>Изображения (464х612)</th>
                    <td>
                        {
                            edit?
                            <ImageLoader deleteCallback={deleteImage} okCallback={appendImage} images={('images' in params||'delete_images' in params)?actualImages(params):('images' in product?product.images.map(e => e.image):[])} />
                            :
                            product.images!==undefined?
                            product.images.map((image,i) => 
                                <div key={i} style={{marginBottom:'5px', border:'1px grey solid',width:'50px', height:'50px', backgroundImage: Api().cssimg(image.image), backgroundSize:'cover'}}></div>
                            ):<></>
                        }
                    </td>
                </tr>
                <tr>
                    <th></th>
                    <td>
                        {
                            edit?
                            <button onClick={() => update(params)}>сохранить</button>:
                            <button onClick={() => setEdit(true)}>редактировать</button>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    );

};

export default ProductTable;