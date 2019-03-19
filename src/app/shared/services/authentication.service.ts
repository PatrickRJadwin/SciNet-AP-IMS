import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public authInfo: Observable<firebase.User>;
  userList: AngularFireList<User>;
  u: AngularFireObject<User>;
  user: User;
  uid: string;
  queryList: User[];

  constructor(private afAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {
    this.authInfo = this.afAuth.authState;
    this.userList = this.db.list('users');

    let data = this.db.list('users');
    data.snapshotChanges().subscribe(item => {
      this.queryList = [];

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.queryList.push(json as User);
      });
     });
   }

   login(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
        this.setLocalStorage();
        this.router.navigate(['/inventory']);
      }, err => reject(err));
    });
   }

   signout() {
     return new Promise<any>((resolve, reject) => {
       if (this.afAuth.auth.currentUser) {
         this.afAuth.auth.signOut();
         resolve();
         localStorage.clear();
         this.router.navigate(['/login']);
       } else {
         reject();
       }
     })
   }

   signUp(email, password) {
     return new Promise<any>((resolve, reject) => {
       this.afAuth.auth.createUserWithEmailAndPassword(email, password)
       .then(res => {
         resolve(res);
         this.setupUser(email);
         this.router.navigate(['/inventory']);
       }, err => reject(err));
     });
   }

   setupUser(email) {
     this.user = new User(this.afAuth.auth.currentUser.uid, email);
     this.userList.push(this.user);
     localStorage.setItem('uid', this.user.uid);
     localStorage.setItem('displayName', this.user.displayName);
   }

   setLocalStorage() {
    let u = this.afAuth.auth.currentUser;
    localStorage.setItem('uid', u.uid);
    localStorage.setItem('displayName', this.getUser().displayName);
   }

   getCurrentUser() {
     return new Promise<any>((resolve, reject) => {
       const currentUser = this.afAuth.auth.onAuthStateChanged(function(user) {
         if (user) {
           resolve(user);
         } else {
           reject('No user logged in');
         }
       });
     });
   }

   getUser(): User {
     return this.queryList.filter(x => x.uid === this.afAuth.auth.currentUser.uid)[0];
   }

   //testing for reading roles, you can see this in action on the inventory page, the add item dissappears or is shown
   //To test, go to the realtime database after signing up, and change your noaccess to false
   canRead(): boolean {
     let k = this.getUser();
     if (k.role.noaccess === true) {return false} else {return true}
   }
}
