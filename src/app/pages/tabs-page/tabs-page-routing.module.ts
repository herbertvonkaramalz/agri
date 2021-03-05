import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

// Routes used inside the tabs-page.html-File have to be referenced here!
const routes: Routes = [
  {
    // If Route is '/app/tabs/*'
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        // If Route is '/app/tabs/start/' - Redirect to Page 'Start'
        path: 'start',
        children: [
          {
            path: '',
            loadChildren: () => import('../start/start.module').then(m => m.StartPageModule)
          }
        ]
      },
      {
        // If Route is '/app/tabs/about/' - Redirect to Page 'About'
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        // If Route is '/app/tabs/about/' - Redirect to Page 'About'
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        // If there is no specific route given, redirect to Start-Route (see above)
        path: '',
        redirectTo: '/app/tabs/start',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

