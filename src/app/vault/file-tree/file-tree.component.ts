import { Component } from '@angular/core';
import { VaultState } from '../xs/vault.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent {
  @Select(VaultState.getTopNodeIds)
  topNodeIds$!: Observable<string[]>;
}
