import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public isParent: Boolean
  private error: String = '';
  user: User = new User();

  constructor(private loginService: LoginService, private parentService: ParentService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  parentLogin() {
      sessionStorage.clear();
    if (!this.parentService.ValidateEmail(this.user.email)) {
      this.error = '*Email format not valid';
      setTimeout(() => {
        this.error = '';
      }, 3000);
    } else {
      this.parentService.checkParent(this.user.email);
      this.parentService.dataUpdated.subscribe((resp) => {          
         if(resp.length == 0){
            this.error = '*Email not found';
            setTimeout(() => {
              this.error = '';
            }, 3000);
         } else if (resp[0].email == this.user.email && resp[0].pw != this.user.pw || resp[0].email != this.user.email && resp[0].pw == this.user.pw) {
          this.error = '*Email address and password do not match';
          setTimeout(() => {
            this.error = '';
          }, 4000);
        } else if (resp[0].email == this.user.email && resp[0].pw == this.user.pw && resp[0].is_parent == true) {
          sessionStorage.setItem("loggedIn", "true");
          sessionStorage.setItem("isParent", "user");
          sessionStorage.setItem("currentUser", resp[0].email);
          this.router.navigate(['user-main']);
        } else if (resp[0].email == this.user.email && resp[0].pw == this.user.pw && resp[0].is_parent == false) {
            sessionStorage.setItem("loggedIn", "true");
            sessionStorage.setItem("isParent", "child");
            sessionStorage.setItem("currentUser", resp[0].email);
                this.error = '';
                this.router.navigate(['child-tasks/' + resp[0].user_id]);
        }
      });
    }
  }

  addUser(){
      this.loginService.addNewUser();
  }
}