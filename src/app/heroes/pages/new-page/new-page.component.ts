import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

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

  constructor(
    private heroesSvc: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ){}

  ngOnInit(): void {

    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesSvc.getHeroById(id))
      )
      .subscribe(hero => {

        if(!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;

      });

  }

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void{

    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesSvc.updateHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar(`${hero.superhero} updated!`)
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
      this.showSnackbar(`${hero.superhero} created!`);
      this.router.navigate(['/heores/edit', hero.id])
    });

  }

  showSnackbar(message: string): void{
    this.snackbar.open(message, 'done', {
      duration: 2500
    })
  }

}
