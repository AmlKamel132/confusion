import { Component, Inject, OnInit } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;',
  },
  animations: [flyInOut(), expand()],
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  errorMessage: string;

  constructor(
    private leaderservice: LeaderService,
    @Inject('baseURL') public baseURL
  ) {}

  ngOnInit(): void {
    this.leaderservice.getLeaders().subscribe(
      (leaders) => (this.leaders = leaders),
      (errorMessage) => (this.errorMessage = <any>errorMessage)
    );
  }
}
