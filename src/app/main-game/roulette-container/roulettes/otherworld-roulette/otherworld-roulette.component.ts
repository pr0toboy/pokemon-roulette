import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';

@Component({
  selector: 'app-otherworld-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './otherworld-roulette.component.html',
  styleUrl: './otherworld-roulette.component.css'
})
export class OtherworldRouletteComponent {

  @Output() paradoxPathEvent = new EventEmitter<void>();
  @Output() ultraBeastPathEvent = new EventEmitter<void>();

  paths: WheelItem[] = [
    { text: 'game.main.roulette.otherworld.paradox', fillStyle: 'darkslateblue', weight: 1 },
    { text: 'game.main.roulette.otherworld.ultraBeast', fillStyle: 'mediumvioletred', weight: 1 },
  ];

  onItemSelected(index: number): void {
    if (this.paths[index].text === 'game.main.roulette.otherworld.paradox') {
      this.paradoxPathEvent.emit();
    } else {
      this.ultraBeastPathEvent.emit();
    }
  }
}
