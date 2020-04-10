import React from 'react';
import { Route } from 'react-router-dom';
import { IonPage, isPlatform } from '@ionic/react';
import { IonReactHashRouter, IonReactRouter } from '@ionic/react-router';
import Tabs from './pages/Tabs';
import Chat from './pages/Chat';

const Navigation: React.FC = (props: any) => {
  const { match } = props;
  const Router:any = isPlatform("electron") ? IonReactHashRouter : IonReactRouter;

  return (
    <IonPage>
      <Router>
        <Route path={`${match.url}/tabs`} component={Tabs} />
        <Route path={`${match.url}/chat/:userId`} component={Chat} />
      </Router> 
    </IonPage>
  )
};

export default Navigation;