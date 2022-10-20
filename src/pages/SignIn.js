import React from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {
  const SignInwithProvider = async provider => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({
          Name: user.displayName,
          CreatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      Alert.success('Signed in', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const onGoogleSignIn = () => {
    SignInwithProvider(new firebase.auth.GoogleAuthProvider());
  };
  const onFacebookSignIn = () => {
    SignInwithProvider(new firebase.auth.FacebookAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h1>Welcome to Chatter</h1>
                <p>This is where fun starts</p>
              </div>
              <div className="mt-3">
                <Button block color="violet" onClick={onGoogleSignIn}>
                  <Icon icon="google" /> Continue with Google
                </Button>

                <Button block color="blue" onClick={onFacebookSignIn}>
                  <Icon icon="facebook" /> Continue with Facebook
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
