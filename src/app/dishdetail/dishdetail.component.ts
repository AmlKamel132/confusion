import { Component, OnInit, ViewChild } from '@angular/core';

import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
})
export class DishdetailComponent implements OnInit {
  @ViewChild('commentform') commentFormDirective: any;
  commentForm: FormGroup;
  comment: Comment;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {

    this.createForm();

    this.dishservice
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));

    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishservice.getDish(params['id']))
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
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

  onSubmit(){

    this.comment = {date:new Date, ...this.commentForm.value};
    console.log(this.comment);

    this.dish?.comments.push(this.comment);

    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
    this.commentFormDirective.resetForm();


  }
}
