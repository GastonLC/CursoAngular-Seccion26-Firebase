import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Game } from '../../interfaces/interfaces';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  juegos: any[] = [];
  year: string = process.env['MY_VARIABLE']!;
  constructor( private db : AngularFirestore) { }

  ngOnInit(): void {

    this.db.collection<Game>('goty').valueChanges()
      .pipe(
        map( (resp: Game[]) => {

          return resp.map( ({ name, votos}) => ({ name, value: votos}))

        })
      )
      .subscribe( juegos =>{
        //console.log(juegos);
        this.juegos = juegos;

      })

  }

}
