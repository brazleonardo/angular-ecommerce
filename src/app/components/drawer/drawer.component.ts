import { Component } from '@angular/core'
import { RouterModule, RouterLinkActive } from '@angular/router'
import { MatListModule } from '@angular/material/list'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, MatListModule, MatRippleModule, MatIconModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {}
