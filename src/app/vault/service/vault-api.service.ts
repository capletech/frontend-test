import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {VaultItem} from '../model/vault-item.model';
import {Observable, of} from 'rxjs';
import {PostFolderDto} from '../dto/post-folder.dto';
import {PatchVaultItemDto} from '../dto/patch-vault-item.dto';
import getResponse from 'src/assets/mocks/mock-response.json'

@Injectable({providedIn: 'root'})
export class VaultApiService {
  constructor(public store: Store) {
  }

  public fetchVault(): Observable<VaultItem[]> {
    return of(getResponse as VaultItem[]);
    // return this.http.get<VaultItem[]>(`${this.apiBaseUrl}/vault`);
  }

  public postNewFolder(body: PostFolderDto): Observable<void> {
    return of((() => {
    })());
  }

  public patchVaultItem(itemId: string, body: PatchVaultItemDto): Observable<void> {
    return of((() => {
    })());
  }

  public delete(itemId: string, cascade: boolean = false): Observable<void> {
    return of((() => {
    })());
  }

  public initVaultForDev(): void {
    // this.http.get(`${this.apiBaseUrl}/vault/test-setup`).subscribe();
  }
}
