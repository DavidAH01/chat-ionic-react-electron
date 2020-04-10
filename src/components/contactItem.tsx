import React from 'react';
import { useStoreActions } from 'easy-peasy';
import { IonItem, IonLabel } from '@ionic/react';

interface CustomInputProps {
  contact: any
}

const ContactItem: React.FC<CustomInputProps> = (props: any) => {
  const { contact } = props;
  const setId = useStoreActions((actions: any) => actions.openChat.setId);

  return (
    <IonItem onClick={() => setId(contact.id)}>
      <IonLabel>
        <h2>{contact.name}</h2>
        <h3>{contact.phone}</h3>
        <p>{contact.website}</p>
      </IonLabel>
    </IonItem>
  );
};

export default React.memo((props: any) => (<ContactItem {...props} />));