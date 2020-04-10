import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { getChats, offFBConnection } from '../services/dataService';
import { IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';

import Login from '../components/login';
import Chats from './Tab2';
import Chat from './Chat';

const Tabs: React.FC = () => {
  const chatParam = useStoreState(state => state.openChat.id);
  const myUser = useStoreState(state => state.user.data);
  const contacts = useStoreState(state => state.contacts.list);
  const getContacts = useStoreActions((actions: any) => actions.contacts.getContacts);
  const loadChats = useStoreActions((actions: any) => actions.chats.loadChats);

  const onChangeChats = (chats: any) => {
    loadChats(
      Object.keys(chats).reduce((users: any, currentValue: any) => {
        const user = contacts.filter((contact: any) => contact.id == currentValue )[0];
        if(user) { 
          user['chatId'] = chats[currentValue].chatId; 
          user['receiverOnesignalId'] = chats[currentValue].onesignalId; 
          user['lastMessage'] = chats[currentValue].lastMessage;
          user['dateLastMessage'] = chats[currentValue].dateLastMessage; 
          user['unreadMessages'] = chats[currentValue].unreadMessages; 
          users = [...users, user]
        }
        return users
      }, [])
    )
  }

  React.useEffect(() => {
    if(Object.keys(myUser).length && !contacts.length) getContacts();
  }, [myUser])

  React.useEffect(() => {
    if(contacts.length) getChats(myUser, onChangeChats);

    return () => {
      if(contacts.length) offFBConnection();
    }
  }, [contacts])

  return (
    <IonPage>
      <Login />
      <IonGrid className="main-grid">
        <IonRow>
          <IonCol size="4" className="border">
            <Chats />    
          </IonCol>
          <IonCol size="8">
            { !!chatParam && <Chat /> }
            { !chatParam && <p className="empty-alert">Selecciona un chat de la lista o <br/> inicia una nueva conversación</p> }
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default Tabs;
