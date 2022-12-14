import SimpleItemsPage from './SimpleItemsPage';

const ContactsPage = () => {

    return (
        <SimpleItemsPage
            title='Контакты'
            apiRoutes={{update: 'contactsUpdate', get: 'contacts'}}
            tableHeaders={['Контакт','Значение','Редактировать']}
            itemProps={[{name: 'name', editable: false}, {name: 'value', editable: true}]}
        />
    );
};

export default ContactsPage;