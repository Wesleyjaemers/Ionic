import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Shake } from '@ionic-native/shake';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { database } from 'firebase';

export interface ScoreItem {
  Score: number;
  Rolls: number;
  Name: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private watch: any
  private myrolls: number
  private mydice1: number
  private mydice2: number
  private myscore: number
  private itemsCollection: AngularFirestoreCollection<ScoreItem>;
  items: Observable<ScoreItem[]>; // Wordt gebruikt om de scores gaan tonen op een highscore-page

  constructor(public navCtrl: NavController, private shake: Shake, private alertCtrl: AlertController, private platform: Platform, private db: AngularFirestore) {

    try {
      if (this.platform.is('android') || this.platform.is('ios')) {

        this.watch = this.shake.startWatch(80).subscribe(() => {
          console.log('shake')
          this.roll()
        });
      }
    } catch (error) {
      // doe niks
    }
    this.itemsCollection = db.collection<ScoreItem>('items')

    this.init()
  }

  public get rolls() {
    return this.myrolls
  }

  public get score() {
    return this.myscore
  }

  roll() {
    console.log('roll');
    if (this.myrolls > 5) {
      this.init()
    }
    setTimeout(() => {
      this.myrolls++
      this.mydice1 = Math.round(Math.random() * 5) + 1;
      this.myscore = this.myscore + this.mydice1
      console.log('roll done', this.mydice1);


    })
    setTimeout(() => {
      this.mydice2 = Math.round(Math.random() * 5) + 1;
      this.myscore = this.myscore + this.mydice2
      console.log('roll done', this.mydice2);
    })
    setTimeout(() => {
      if (this.myrolls > 5) {
        this.setScore({ Score: this.myscore, Rolls: this.myrolls, Name: null })
      }
    }, 100)

  }

  dice(num) { // return de waarde van dobbelsteen 1 of 2

    switch (num) {
      case 1:
        return this.mydice1
      case 2:
        return this.mydice2
    }
    return null

  }

  init() {
    this.mydice1 = 1
    this.mydice2 = 1
    this.myscore = 0
    this.myrolls = 0
  }

  setScore(score) {
    console.log('score', score)
    this.presentPrompt()
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'High Score!',
      inputs: [
        {
          name: 'Name',
          placeholder: 'Your Nick Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enter High Score',
          handler: data => {
            if (data) {
              console.log(data)
              this.setFirebaseScore(data)
            }
          }
        }
      ]
    });
    alert.present();
  }

  setFirebaseScore(data: any){
    const scoreItem: ScoreItem = { Name: data.Name, Score: this.myscore, Rolls: this.myrolls }
    this.itemsCollection.add(scoreItem).then(()=>{
      console.log('saved')
    }).catch((error) =>{
      console.log(error);
    })
    }
}
