import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { InitVaultTree } from '../xs/actions/vault/init-vault-tree.action';
import { VaultApiService } from '../service/vault-api.service';

@Component({
  selector: 'app-vault-explorer',
  templateUrl: './vault-explorer.component.html',
  styleUrls: ['./vault-explorer.component.scss'],
})
export class VaultExplorerComponent implements OnInit {
  constructor(private readonly store: Store, private readonly tmpService: VaultApiService) {}

  ngOnInit(): void {
    this.store.dispatch(new InitVaultTree());
  }

  debugInit(): void {
    this.tmpService.initVaultForDev();
  }
}
