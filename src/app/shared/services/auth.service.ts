import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  user: any;

  constructor(

    public afs: AngularFirestore,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone

  ) { 
    this.afAuth.authState.subscribe(user => {

      if (user) {

        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));

      } else {

        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));

      }

    });

  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/${user.uid}');
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    console.log(userData);
    return userRef.set(userData, {
      merge: true
    })
  }

  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['inventory']);
        });
        this.SetUserData(result.user);

      }).catch((error) => {
        window.alert(error.message)
      })
  }

  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }

  SignOut() {
    console.log(localStorage.getItem('user'));
    this.afAuth.auth.signOut().then(() => {
      console.log(localStorage.getItem('user'));
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

}
