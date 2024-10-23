import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent implements OnInit{

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public heroesAutoCompleted: Hero[] = [];
  public selectedHero?: Hero;

  constructor(private heroSvc: HeroesService){}

  ngOnInit(): void {
    this.heroSvc.getHeroes()
      .subscribe(
        heroes => this.heroes = heroes
      );
  }

  searchHero(): void{
    const value: string = this.searchInput.value || '';

    this.heroesAutoCompleted = this.heroes.filter(
      hero => hero.superhero.toLowerCase().includes(value.toLowerCase())
    );

  }

  onSelectedOption(event: MatOptionSelectionChange): void{

    if(!event.source.value){
      this.selectedHero = undefined;
      return;
    }
    this.selectedHero = event.source.value;
    this.searchInput.setValue(this.selectedHero!.superhero);
  }

}
