import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_image: new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(private heroesSvc: HeroesService){}

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void{

    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesSvc.updateHero(this.currentHero)
      .subscribe( hero => {
        //todo: mostrar snackbar
      });
      return;
    }

    if(this.currentHero.publisher === Publisher.DCComics){
      this.heroForm.value.id = 'dc-' + this.currentHero.superhero;
    }
    else{
      this.heroForm.value.id = 'marvel-' + this.currentHero.superhero;
    }

    this.heroesSvc.addHero(this.currentHero)
    .subscribe(hero => {
      //todo: mostrar snackbar, navegar a heores/edit/hero.id
    });

  }

}
