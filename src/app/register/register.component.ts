import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';
@Component({ templateUrl: 'register.component.html', styleUrls: ['register.component.css'] , providers: [AccountService, FormBuilder] })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    isSuccessful = false;
    isSignUpFailed = false;
    errorMessage = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        public _HttpClientModule: HttpClientModule
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            company: ['', Validators.required],
            title: ['', Validators.required],
            country: ['', Validators.required],
            phone: ['', Validators.required],
            keep_updated: ['0'],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value).subscribe(
          data => {
            console.log(data);
            this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            this.router.navigate(['../home'], { relativeTo: this.route });
            this.isSuccessful = true;
            this.isSignUpFailed = false;
          }
        );
    }
}
