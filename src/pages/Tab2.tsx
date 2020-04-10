import React from 'react';
import { useStoreState } from 'easy-peasy';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import ChatItem from '../components/chatItem';
import ContactsList from './Tab1';

import './Tab2.css';

const Tab2: React.FC = () => {
  const [ openModal, setOpenModal ] = React.useState(false);
  const chats = useStoreState(state => state.chats.list);

  const renderChats = () => {
    return chats.map((chat: any) => {
      return <ChatItem key={`chat-${chat.id}`} chat={chat}/>
    })
  }

  return (
    <IonPage>
      <ContactsList 
        show={openModal}
        close={() => setOpenModal(false)}/>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton size="small" onClick={() => setOpenModal(true)}>
              <IonIcon icon={createOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Conversaciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        { !!chats.length && renderChats() }
        { !chats.length && 
          <p className="empty-alert">
            No tienes conversaciones activas <br /><br />
            Ve a <span onClick={() => setOpenModal(true)}>tus contactos</span> e inicia una nueva conversación
          </p> 
        }
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
