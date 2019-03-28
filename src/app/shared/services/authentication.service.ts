import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges } from 'angularfire2/database';
import { User } from './user.model';
import { SnackbarService } from '../snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tf;

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
        resolve(res),
        localStorage.setItem('log', 'loggedin'),
        this.router.navigate(['inventory'])
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
         localStorage.setItem('log', 'notloggedin');
         this.router.navigate(['/login']);
       } else {        
         reject();
       }
     })
   }

   isloggedIn() {
     if (localStorage.getItem('log') == 'loggedin') {
       return true
     }
     else {
       return false
     }
   }

   signUp(email, password) {
     return new Promise<any>((resolve, reject) => {
       this.afAuth.auth.createUserWithEmailAndPassword(email, password)
       .then(res => {
        this.setupUser(email)
         resolve(res)
         this.router.navigate(['/inventory'])
       }, err => reject(err));
      });
   }

   signup(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      this.setupUser(result.user.email),
      localStorage.setItem('log', 'loggedin'),
      this.router.navigate(['/inventory'])
    }).catch((error) => {
      window.alert(error.message)
    })
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
     this.db.database.ref().child('users/' + this.afAuth.auth.currentUser.uid + '/role/admin').toString();
     return this.queryList.filter(x => x.uid === this.afAuth.auth.currentUser.uid)[0];
     
   }

   isAdmin() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
     .child('admin').once('value').then(snapshot => {
       this.tf = snapshot.val();
       console.log(this.tf);
     })
     return this.tf;
   }

   isUser() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
     .child('user').once('value').then(snapshot => {
       this.tf = snapshot.val();
       console.log(this.tf);
     })
     return this.tf;
   }

   getrole() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
     .child('superuser').once('value').then(snapshot => {
       this.tf = snapshot.val();
       console.log(this.tf);
     })
     return this.tf;
     
   }

   isSuperUser() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
     .child('superuser').once('value').then(snapshot => {
       this.tf = snapshot.val();
       console.log(this.tf);
     })
     return this.tf;
   }

   updateUser(key: string, user: User) {
    this.db.object('/users/' + key).update(user);
   }

}
