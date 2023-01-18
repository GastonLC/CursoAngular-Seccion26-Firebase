import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tickStep } from 'd3';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Game } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private juegos: Game[] = [];
  

  constructor( private http :HttpClient) { }

  getNominados(){

    if( this.juegos.length > 0){
      //no tenemos juegos
      return of(this.juegos);

    } else {
      return this.http.get<Game[]>(`${environment.url}/api/goty`)
        .pipe(
          tap(juegos => this.juegos = juegos)
        );
    }


  }

  votarJuego(id :string){
   console.log(id);
   return this.http.post<Game>(`${environment.url}/api/goty/${id}`,{})//Las peticiones POST generalmente piden un BODY, pero en este caso, solo bandamos en la url. mandamos body VACIO = "{}"
       .pipe(
        catchError( err => {
          return of( err.error )
          
        })
           )
   
  }



}
