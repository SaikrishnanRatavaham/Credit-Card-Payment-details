import { Component, OnInit ,ViewChild , ElementRef, ChangeDetectorRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
 import { Router } from '@angular/router';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { PaymentServicesService } from '../payment-services.service';

declare var stripe: any;
declare var elements: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  
  public subscribeForm : FormGroup;
  public user: any = {};
  public cardNumber: any;
  public cardExpiry: any;
  public cardCVC: any;
  public cardNumberHandler = this.oncardNumberChange.bind(this);
  public cardExpiryHandler = this.oncardExpiryChange.bind(this);
  public cardCVCHandler = this.oncardCVCChange.bind(this);
  public cardNumberError: string;
  public cardExpiryError: string;
  public cardCVCError: string;
  public isCardNumberValid: boolean = false;
  public isCardExpiryValid: boolean = false;
  public isCardCVCValid: boolean = false;
  public isUpdatePaymentMethod: boolean = false;
  public subscribeUserDetails: any;
  public subscribeUserData: any;
  public stripeTest: FormGroup;
    
  @ViewChild('cardNumberElement', { static: false }) cardNumberContainer: ElementRef;
  @ViewChild('cardExpiryElement', { static: false }) cardExpiryContainer: ElementRef;
  @ViewChild('cardCVCElement', { static: false }) cardCVCContainer: ElementRef;
 
  constructor( private router: Router,  private toastr: ToastrService,public cd: ChangeDetectorRef,private fb: FormBuilder,private PaymentService: PaymentServicesService) { }
 
  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
      	this.subscribeForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        // payAmount: [null, Validators.compose([Validators.required])],
        agree:['', Validators.compose([Validators.required])],
		
		});
    
  }
  	loadStripeElement() {
		this.cardNumber = elements.create('cardNumber');
		this.cardNumber.mount('#cardNumberElement');
		
		this.cardExpiry = elements.create('cardExpiry');
		this.cardExpiry.mount('#cardExpiryElement');
		
		this.cardCVC = elements.create('cardCvc');
		this.cardCVC.mount('#cardCVCElement');


		this.cardNumber.addEventListener('change', this.cardNumberHandler);
		this.cardExpiry.addEventListener('change', this.cardExpiryHandler);
		this.cardCVC.addEventListener('change', this.cardCVCHandler);
	}

	ngAfterViewInit() {
		this.loadStripeElement();
	}

	ngOnDestroy() {
		this.cardNumber.removeEventListener('change', this.cardNumberHandler);
		this.cardNumber.destroy();

		this.cardExpiry.removeEventListener('change', this.cardExpiryHandler);
		this.cardExpiry.destroy();

		this.cardCVC.removeEventListener('change', this.cardCVCHandler);
		this.cardCVC.destroy();
	}

	oncardNumberChange(event) {

		if(event.complete) {
			this.isCardNumberValid = true
		} else {
			this.isCardNumberValid = false
		}
		this.cd.detectChanges();
	}

	oncardExpiryChange(event) {
		if(event.complete) {
			this.isCardExpiryValid = true
		} else {
			this.isCardExpiryValid = false
		}
		this.cd.detectChanges();
	}

	oncardCVCChange(event) {
		if(event.complete) {
			this.isCardCVCValid = true
		} else {
			this.isCardCVCValid = false
		}
		this.cd.detectChanges();
	}

  async subscribe() {
    var params = {};
    var subscribedAmount:any = "$40.00"
		const { token, error } = await stripe.createToken(this.cardNumber);
		if (error) {
			let err = error && error.message ? error.message : 'Something went wrong. Try sometime later';
			this.toastr.error(err);
    } else {
        params["email"] = this.subscribeForm.value.email;
        stripe.createToken(this.cardNumber, params).then(result => {
        this.subscribeUserDetails = result.token
        this.subscribeUserData = this.subscribeUserDetails;
		Object.assign(this.subscribeUserData, { amountSubscribed: subscribedAmount });
		this.toastr.success('Payment method has been Subscribed successfully');
		this.router.navigate(['/dashboard']);
       this.PaymentService.getPaymentDetails(this.subscribeUserData)
        
    })

		}
	}


  
  	isFormDisabled() { 
		if(this.subscribeForm.invalid) {
			return true;
		} else if(!this.isCardExpiryValid || !this.isCardNumberValid || !this.isCardCVCValid ) {
			return true;
		} else {
			return false;
		}
	}

	updatePaymentMethod() {
		this.isUpdatePaymentMethod = true;
	}


}
