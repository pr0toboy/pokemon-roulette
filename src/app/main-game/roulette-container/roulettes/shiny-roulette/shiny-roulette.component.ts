import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shiny-roulette',
  imports: [WheelComponent, TranslatePipe, CommonModule],
  templateUrl: './shiny-roulette.component.html',
  styleUrl: './shiny-roulette.component.css'
})
export class ShinyRouletteComponent implements OnInit {

  // Shiny Charm — postgame Battle Tower floor 20 reward. Triples roughly
  // the canonical shiny rate (1/64 → 1/16) like the mainline games.
  @Input() hasShinyCharm = false;

  @Output() isShinyEvent = new EventEmitter<boolean>();

  shinyOdds: WheelItem[] = [];

  ngOnInit(): void {
    const noWeight = this.hasShinyCharm ? 15 : 63;
    this.shinyOdds = [
      { text: 'game.main.roulette.shiny.yes', fillStyle: 'green',   weight: 1 },
      { text: 'game.main.roulette.shiny.no',  fillStyle: 'crimson', weight: noWeight },
    ];
  }

  onItemSelected(index: number): void {
    this.isShinyEvent.emit(this.shinyOdds[index].text === 'game.main.roulette.shiny.yes');
  }
}
