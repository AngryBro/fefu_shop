import SimpleItemsPage from "./SimpleItemsPage";

const MaterialsPage = () => (
    <SimpleItemsPage
        title='Материалы'
        apiRoutes={{
            get: 'materials',
            update: 'materialsUpdate',
            create: 'materialCreate',
            delete: 'materialDelete'
        }}
        tableHeaders={[
            'Материал',
            'Редактировать'
        ]}
        itemProps={[
            {name: 'name', editable: true}
        ]}
        deleteFailMsg='Есть товары с таким материалом'
    />
);

export default MaterialsPage;