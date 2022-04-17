import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state(
        'shown',
        style({
          transform: 'scale(1.0)',
          opacity: 1,
        })
      ),
      state(
        'hidden',
        style({
          transform: 'scale(0.5)',
          opacity: 0,
        })
      ),
      transition('* => *', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class DishdetailComponent implements OnInit {
  @ViewChild('commentform') commentFormDirective: any;
  commentForm: FormGroup;
  comment: Comment;

  dish: Dish | null;
  dishcopy: Dish | null;
  dishIds: string[];
  prev: string;
  next: string;
  errorMessage: string;
  visibility = 'shown';

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('baseURL') public baseURL
  ) {}

  ngOnInit() {
    this.createForm();

    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = 'hidden';
          return this.dishService.getDish(+params['id']);
        })
      )

      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishcopy = dish;
          this.visibility = 'shown';
          this.setPrevNext(dish.id);
        },
        (errorMessage) => (this.errorMessage = <any>errorMessage)
      );
  }

  formErrors = {
    author: '',
    comment: '',
    rating: 5,
  };

  validationMessages = {
    author: {
      required: 'Author is required.',
      minlength: 'Author must be at least 2 characters long.',
      maxlength: 'Author cannot be more than 25 characters long.',
    },
    comment: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 2 characters long.',
      maxlength: 'Comment cannot be more than 50 characters long.',
    },
    rating: {
      required: 'rating is required.',
      min: 'rating cannot be more than 5.',
    },
  };

  createForm() {
    this.commentForm = this.formBuilder.group({
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      rating: [5, [Validators.required, Validators.max(5)]],
    });

    this.commentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev =
      this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next =
      this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = { date: new Date(), ...this.commentForm.value };
    this.dishcopy?.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy as Dish).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errorMessage) => {
        this.dish = null;
        this.dishcopy = null;
        this.errorMessage = <any>errorMessage;
      }
    );

    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5,
    });
    this.commentFormDirective.resetForm();
  }
}
