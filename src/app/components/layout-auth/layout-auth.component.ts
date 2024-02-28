import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MatGridListModule } from '@angular/material/grid-list'

@Component({
  selector: 'app-layout-auth',
  standalone: true,
  imports: [RouterOutlet, MatGridListModule],
  templateUrl: './layout-auth.component.html',
  styleUrl: './layout-auth.component.scss',
})
export class LayoutAuthComponent {}
