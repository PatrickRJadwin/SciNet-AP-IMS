import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { User } from './user.model';
import { SnackbarService } from '../snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  duration = 10;
  public authInfo: Observable<firebase.User>;
  userList: AngularFireList<User>;
  u: AngularFireObject<User>;
  user: User;
  uid: string;
  queryList: User[];

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private snack: SnackbarService) {
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

   getallUsers() {
     return this.userList;
   }

   signout() {
     return new Promise<any>((resolve, reject) => {
       if (this.afAuth.auth.currentUser) {
         this.afAuth.auth.signOut();
         resolve();
         localStorage.setItem('uid', null);
         localStorage.setItem('displayName', null);
         this.router.navigate(['/login']);
       } else {
         reject();
       }
     })
   }

   isloggedIn() {
     if (localStorage.getItem('uid') === 'null') {
       return false;
     }
     else return true;
   }

   signUp(email, password) {
     return new Promise<any>((resolve, reject) => {
       this.afAuth.auth.createUserWithEmailAndPassword(email, password)
       .then(res => {
         resolve(res);
         this.setupUser(email);
         this.router.navigate(['/inventory']);
       }, err => reject(err));
       this.snack.openSnackBar('Could not create this user. Try another Email.', 2000);
     });
   }

   setupUser(email) {
     this.user = new User(this.afAuth.auth.currentUser.uid, email);
     this.userList.set(this.afAuth.auth.currentUser.uid, {
       uid: this.afAuth.auth.currentUser.uid,
       displayName: this.user.displayName,
       email: this.user.email,
       role: {
         noaccess: true,
         user: false,
         admin: false,
         superuser: false
       },
       rolestring: "noaccess"
     });
     //this.userList.push(this.user);
     localStorage.setItem('uid', this.user.uid);
     localStorage.setItem('displayName', this.user.displayName);
   }

   setLocalStorage() {
    //let u = this.afAuth.auth.currentUser;
    let k = this.getUser();
    localStorage.setItem('uid', k.uid);
    localStorage.setItem('displayName', k.displayName);
   }

   getCurrentUser() {
     return new Promise<any>((resolve, reject) => {
       const currentUser = this.afAuth.auth.onAuthStateChanged(function(user) {
         if (user) {
           resolve(user);
         } else {
           this.router.navigate(['/login']);
           reject('No user logged in');
         }
       });
     });
   }

   authenticated(): boolean {
     if (this.afAuth.auth.currentUser.uid !== null) {
       return true;
     } else {return false;}
   }

   getUser(): User {
     return this.queryList.filter(x => x.uid === this.afAuth.auth.currentUser.uid)[0];
   }

   //testing for reading roles, you can see this in action on the inventory page, the add item dissappears or is shown
   //To test, go to the realtime database after signing up, and change your noaccess to false
   canRead(): boolean {
     //let k = this.getUser();
    //if (k.role.noaccess === true) {return false} else {return true}
    let k = this.getUser();
    if (k.role.user === true) return true;
    else if (k.role.admin === true) return true;
    else if (k.role.superuser === true) return true;
    else return false;
   }

   canEdit(): boolean {
     let k = this.getUser();
     if (k.role.admin === true) return true;
     else if (k.role.superuser === true) return true;
     else return false;
   }

   canDelete(): boolean {
     let k = this.getUser();
     if (k.role.superuser === true) return true;
     else return false;
   }

   updateUser(key: string, user: User) {
    this.db.object('/users/' + key).update(user);
   }

}
