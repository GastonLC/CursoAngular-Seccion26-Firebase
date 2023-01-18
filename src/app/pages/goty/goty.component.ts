import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-goty',
  templateUrl: './goty.component.html',
  styleUrls: ['./goty.component.css']
})
export class GotyComponent implements OnInit {

  juegos: Game[] = [];

  constructor( private gameService :GameService) { }

  ngOnInit(): void {

    this.gameService.getNominados()
      .subscribe( juegos => {
        console.log(juegos);
        this.juegos = juegos;
      })

  }


  votarJuego(id :string){
    this.gameService.votarJuego(id)
      .subscribe ( (resp:any) => {

        if ( resp.ok ){
          Swal.fire('Votación realizada',resp.msg,'success')
        } else {
          Swal.fire('Oops',resp.msg,'error')
        }

      });
  }

}
