import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { getMessages, saveMessage, offFBConnection, markAsReadMessages } from '../services/dataService';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon } from '@ionic/react';
import DeleteMessage from '../components/deleteMessage';
import ChatBubble from '../components/chatBubble';
import { sendOutline } from 'ionicons/icons';
import './Chat.css';

const Chat: React.FC = (props: any) => {
  const mainContent = React.useRef<any>();
  const [ chatId, setChatId ] = React.useState()
  const [ message, setMessage ]: any = React.useState()
  const [ showAlertDelete, setShowAlertDelete ]: any = React.useState({ show: false })
  const myUser = useStoreState(state => state.user.data);
  const anotherUser = useStoreState(state => state.openChat.user);
  const contacts = useStoreState(state => state.contacts.list);
  const chats = useStoreState(state => state.chats.list);
  const chatParam = useStoreState(state => state.openChat.id);
  const messages = useStoreState(state => state.openChat.messages);
  const loadMessages = useStoreActions((actions: any) => actions.openChat.loadMessages);
  const setUser = useStoreActions((actions: any) => actions.openChat.setUser);

  const scrollToBottom = () => {
    if(mainContent && mainContent.current) mainContent.current.scrollToBottom()
  }

  const getContactByID = (userId: number) => {
    const user = contacts.filter((contact: any) => contact.id == userId)[0];
    setUser(user)
  }

  const validateChatID = () => {
    const user = chats.filter((user: any) => user.id == anotherUser.id)[0];
    const chatId = user ? user['chatId'] : uuidv4()
    setChatId(chatId ? chatId : uuidv4())
  }

  const renderMessages = () => {
    return [...messages]
      .map((data: any, index: number) => {
        data.index = index;
        return ( <ChatBubble key={`fragment-message-${data.index}`} data={data} chatId={chatId} setShowAlertDelete={setShowAlertDelete} /> );
      })
  }

  const sendMessage = () => {
    if(!message || !message.trim().length) return;
    saveMessage({
      message,
      chatId,
      owner: myUser.id,
      addressee: anotherUser.id
    })
    setMessage("");
  }

  React.useEffect(() => {
    loadMessages([])
    getContactByID(chatParam);
  }, [chatParam]);

  React.useEffect(() => {
    markAsReadMessages(messages, myUser, anotherUser, chatId);
  }, [messages, myUser, anotherUser, chatId])

  React.useEffect(() => {
    if(Object.values(anotherUser).length) validateChatID();
  }, [anotherUser]);

  React.useEffect(() => {
    async function getData() {
      await getMessages(chatId, loadMessages)
    }
    if(Object.values(anotherUser).length && chatId){
      getData();
    }
    return () => {
      if(Object.values(anotherUser).length && chatId){ offFBConnection(chatId) }
      loadMessages([])
    }
  }, [chatId]);

  React.useEffect(() => {
    if(messages.length){
      setTimeout(() => {
        scrollToBottom();
      }, 300)
    }
  }, [messages]);

  return (
    <IonPage className="chat-view">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{ anotherUser && anotherUser.name ? anotherUser.name : 'Chat' }</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={mainContent}>
        <DeleteMessage 
          message={showAlertDelete.message} 
          show={showAlertDelete.show} 
          close={() => setShowAlertDelete({ ...showAlertDelete, show: false })}/>
        { !!messages.length && renderMessages() }
      </IonContent>
      <IonFooter>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput placeholder="Escríbe aquí" 
                        value={message}  
                        onIonChange={(e: any) => setMessage(e.detail.value)}
                        onKeyPress={(e) => { if(e.key === 'Enter') sendMessage(); }}></IonInput>
            </IonCol>
            <IonCol size="2">
              <IonButton onClick={sendMessage}>
                <IonIcon icon={sendOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default React.memo((props: any) => <Chat {...props} />);
