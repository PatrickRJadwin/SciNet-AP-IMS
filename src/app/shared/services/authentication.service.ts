import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Userm } from './user.model';
import { SnackbarService } from '../snackbar.service';
import { User } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tf;

  duration = 10;
  public authInfo: Observable<firebase.User>;
  userList: AngularFireList<Userm>;
  u: AngularFireObject<Userm>;
  user: Userm;
  uid: string;
  queryList: Userm[];
  firebaseUser: User;

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
        this.queryList.push(json as Userm);
      });
     });

     this.afAuth.authState.subscribe(user => {
       if (user) {
         this.firebaseUser = user;
         localStorage.setItem('user', JSON.stringify(this.firebaseUser));
       } else {
         localStorage.setItem('user', null);
       }
     })
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
     
     if (localStorage.getItem('user') != 'null') {
       return true;
     }
     else {
       return false;
     }
   }

   signup(email, password, conpassword) {
    if (password !== conpassword) {
      this.snack.openSnackBar('Your password does not match', 2500);
    }
    else {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setupUser(result.user.email),
        localStorage.setItem('log', 'loggedin'),
        this.router.navigate(['/inventory'])
      }).catch((error) => {
        window.alert(error.message);
      });
    }
   }

   setupUser(email) {
     this.user = new Userm(this.afAuth.auth.currentUser.uid, email);
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
     if (this.afAuth.auth.currentUser == null) {
       return false;
     }
     else {
       return true;
     }
   }

   getUser(): Userm {
     this.db.database.ref().child('users/' + this.afAuth.auth.currentUser.uid + '/role/admin').toString();
     return this.queryList.filter(x => x.uid === this.afAuth.auth.currentUser.uid)[0];
     
   }

   isAdmin():boolean {
    if (this.isloggedIn() == true) {
      return this.queryList.filter(x => x.$key === this.afAuth.auth.currentUser.uid)[0].role.admin;
    }
    else {
      return false;
    }
   }

   isUser():boolean {
    if (this.isloggedIn() == true) {
      return this.queryList.filter(x => x.$key === this.afAuth.auth.currentUser.uid)[0].role.user;
    }
    else {
      return false;
    }
   }

   isSuperUser():boolean {
    if (this.isloggedIn() == true) {
      return this.queryList.filter(x => x.$key === this.afAuth.auth.currentUser.uid)[0].role.superuser;
    }
    else {
      return false;
    }
   }

   getrole() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
     .child('superuser').once('value').then(snapshot => {
       this.tf = snapshot.val();
     })
     return this.tf;   
   }

   updateUser(key: string, user: Userm) {
    this.db.object('/users/' + key).update(user);
   }

}
