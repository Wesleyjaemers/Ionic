import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ScoreItem } from '../home/home';

export interface ScoreItem {
  Score: number;
  Rolls: number;
  Name: string;
}

@Component({
  selector: 'page-highscore',
  templateUrl: 'highscore.html'
})

export class ContactPage {

  items: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    private db: AngularFirestore
  ) {
    this.items = db.collection<ScoreItem>('items').valueChanges();
  }
}
