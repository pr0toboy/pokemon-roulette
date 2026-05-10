import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { GenerationItem } from '../../../../interfaces/generation-item';
import { GenerationService } from '../../../../services/generation-service/generation.service';

import { MainAdventureRouletteComponent } from './main-adventure-roulette.component';

describe('MainAdventureRouletteComponent', () => {
  let component: MainAdventureRouletteComponent;
  let fixture: ComponentFixture<MainAdventureRouletteComponent>;
  let generationSubject: BehaviorSubject<GenerationItem>;

  const createGeneration = (id: number): GenerationItem => ({
    id,
    text: `Gen ${id}`,
    region: 'Test Region',
    fillStyle: 'black',
    weight: 1
  });

  beforeEach(async () => {
    generationSubject = new BehaviorSubject<GenerationItem>(createGeneration(1));

    await TestBed.configureTestingModule({
      imports: [MainAdventureRouletteComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: GenerationService,
          useValue: {
            getGeneration: () => generationSubject.asObservable(),
            getCurrentGeneration: () => createGeneration(1)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAdventureRouletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose 17 main-game adventure actions (Area Zero now postgame-only)', () => {
    expect(component.actions.length).toBe(17);
    expect(component.actions.some(action => action.text === 'game.main.roulette.adventure.actions.areaZero')).toBeFalse();
  });

  it('should emit the otherworld event from the last action slot', () => {
    spyOn(component.otherworldEncounterEvent, 'emit');

    component.onItemSelected(16);

    expect(component.otherworldEncounterEvent.emit).toHaveBeenCalled();
  });
});
