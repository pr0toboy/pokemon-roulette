import { Routes } from '@angular/router';
import { MainGameComponent } from './main-game/main-game.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CreditsComponent } from './credits/credits.component';
import { SettingsComponent } from './settings/settings.component';

// The /coffee donation page is intentionally not routed in this fork:
// the upstream CoffeeComponent ships a hardcoded Pix code belonging to
// the original author. The page stays in the repo but is not reachable
// from URLs; restore the route once the donation target is your own.
export const routes: Routes = [
    { path: '', component: MainGameComponent },
    { path: 'credits', component: CreditsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', component: NotFoundComponent },
];
