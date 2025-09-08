import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'app',
    loadChildren: () =>
      import('src/app/main/main.module').then((m) => m.MainModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('src/app/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'links',
    loadChildren: () =>
      import('src/app/links/links.module').then((m) => m.LinksModule),
  },
  {
    // path: 'ranking',
    path: 'ranking/:id',
    loadChildren: () =>
      import('src/app/ranking/ranking.module').then((m) => m.RankingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
