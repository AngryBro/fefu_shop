import SimpleItemsPage from "./SimpleItemsPage";

const BrandsPage = () => (
    <SimpleItemsPage
        title='Брэнды'
        apiRoutes={{
            get: 'brands',
            update: 'brandUpdate',
            create: 'brandCreate',
            delete: 'brandDelete'
        }}
        tableHeaders={[
            'Брэнд',
            'Редактировать'
        ]}
        itemProps={[
            {name: 'name', editable: true}
        ]}
        deleteFailMsg='Есть товары такого брэнда'
    />
);

export default BrandsPage;