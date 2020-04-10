import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import ContactItem from '../components/contactItem';
import './Tab1.css';

interface CustomInputProps {
  show: boolean,
  close: () => void
}

const Tab1: React.FC<CustomInputProps> = (props: any) => {
  const { history, show, close } = props;
  const contacts = useStoreState(state => state.contacts.list);
  const setNavigation = useStoreActions((actions: any) => actions.navigation.setNavigation);
  const chatParam = useStoreState(state => state.openChat.id);

  React.useEffect(() => {
    if(chatParam) close();
  }, [chatParam]);

  React.useEffect(() => {
    setNavigation(history)
  }, []);

  const renderContacts = () => {
    return contacts.map((contact: any) => {
      return <ContactItem key={`contact-${contact.id}`} contact={contact} />
    })
  }

  return (
      <IonModal 
        isOpen={show} 
        swipeToClose={true}
        onDidDismiss={() => close()}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => close()}>Cerrar</IonButton>
            </IonButtons>
            <IonTitle>Contactos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {renderContacts()}
        </IonContent>
      </IonModal>
  );
};

export default Tab1;
