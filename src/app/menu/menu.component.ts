import { Component, Inject, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  dishes!: Dish[];

  selectedDish!: Dish;
  errorMessage: string;

  constructor(
    private dishService: DishService,
    @Inject('baseURL') public baseURL
  ) {}

  ngOnInit() {
    this.dishService.getDishes().subscribe(
      (dishes) => (this.dishes = dishes),
      (errorMessage) => (this.errorMessage = <any>errorMessage)
    );
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }
}
