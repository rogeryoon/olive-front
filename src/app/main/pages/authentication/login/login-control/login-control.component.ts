import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseConfigService } from '@fuse/services/config.service';

import { AlertService, MessageSeverity } from '@quick/services/alert.service';
import { AuthService } from '@quick/services/auth.service';
import { Utilities } from '@quick/services/utilities';
import { UserLogin } from '@quick/models/user-login.model';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-login-control',
  templateUrl: './login-control.component.html',
  styleUrls: ['./login-control.component.scss']
})
export class OliveLoginControlComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginFormErrors: any;

  isLoading = false;
  formResetToggle = true;
  modalClosedCallback: () => void;
  loginStatusSubscription: any;

  @Input()
  isModal = false;

  constructor(
    private alertService: AlertService, private authService: AuthService,
    private fuseConfig: FuseConfigService, private formBuilder: FormBuilder,
    private translator: FuseTranslationLoaderService
  ) {
    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.loginFormErrors = {
      userName: {},
      password: {}
    };
  }

  ngOnInit(): void {
    this.buildForm();

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    }
    else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent()
        .subscribe(isLoggedIn => {
          if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['groupadmin', requiredValidator()],
      password: ['tempP@ss123', requiredValidator()],
      rememberMe: [this.authService.rememberMe]
    });
  }

  onLoginFormValuesChanged() {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.loginFormErrors[field] = {};

      // Get the control
      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  getShouldRedirect() {
    return this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }

  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  getUserLogin(): UserLogin {
    const formModel = this.loginForm.value;
    return new UserLogin(formModel.userName, formModel.password, formModel.rememberMe);
  }

  login() {
    this.isLoading = true;
    this.alertService.startLoadingMessage('', this.translator.get('common.message.attemptingLogin'));

    this.authService.login(this.getUserLogin())
      .subscribe(
        () => this.onConfigsLoadSuccessful(),
        error => this.showLoginError(error)
      );
  }

  showLoginError(error: any) {
    this.alertService.stopLoadingMessage();

    if (Utilities.checkNoNetwork(error)) {
      this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
    }
    else {
      const errorMessage = Utilities.findHttpResponseMessage('error_description', error) || Utilities.findHttpResponseMessage('error', error);

      if (errorMessage) {
        this.alertService.showStickyMessage(this.translator.get('common.title.unableLogin'), this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
      }
      else {
        this.alertService.showStickyMessage(
          this.translator.get('common.title.unableLogin'), this.translator.get('common.message.errorOccurredAt') +
          error.statusText || error.status, MessageSeverity.error, error
        );
      }
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private onConfigsLoadSuccessful() {
    const user = this.authService.currentUser;
    setTimeout(() => {
      this.alertService.stopLoadingMessage();
      this.isLoading = false;
      this.reset();

      if (!this.isModal) {
        this.alertService.showMessage(this.translator.get('common.title.login'), 
          String.Format(this.translator.get('common.message.welcomeTemplate'), user.userName), 
          MessageSeverity.success);
      }
      else {
        this.alertService.showMessage(this.translator.get('common.title.login'), 
          String.Format(this.translator.get('common.message.sessionRestoredTemplate'), user.userName), 
          MessageSeverity.success);
        setTimeout(() => {
          this.alertService.showStickyMessage(this.translator.get('common.title.sessionRestored'), 
            this.translator.get('common.message.tryLastOperation'), MessageSeverity.default);
        }, 500);

        this.closeModal();
      }
    }, 500);
  }

  mapLoginErrorMessage(error: string) {

    if (error === 'invalid_username_or_password') {
      return this.translator.get('common.message.invalidUserNamePassword');
    }

    if (error === 'invalid_grant') {
      return this.translator.get('common.message.accountDisabled');
    }

    return error;
  }

  reset() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }
}
