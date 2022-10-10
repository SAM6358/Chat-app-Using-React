/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusDatabaseRef;
    const authUnsub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userStatusDatabaseRef = database.ref(`/status/${authObj.uid}`);

        userRef.on('value', snap => {
          const { Name, CreatedAt, avatar } = snap.val();
          const data = {
            Name,
            CreatedAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setisLoading(false);
        });
        database.ref('.info/connected').on('value', snap => {
          if (snap.val() === false) {
            // eslint-disable-next-line no-useless-return
            return;
          }
        });
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      } else {
        if (userRef) {
          userRef.off();
        }
        if (userStatusDatabaseRef) {
          userStatusDatabaseRef.off();
        }
        database.ref('.info/connected');
        setProfile(null);
        setisLoading(false);
      }
    });
    return () => {
      authUnsub();
      if (userRef) {
        userRef.off();
      }
      if (userStatusDatabaseRef) {
        userStatusDatabaseRef.off();
      }
      database.ref('.info/connected');
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
