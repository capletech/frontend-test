import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {VaultItem, VaultItemType} from '../model/vault-item.model';
import {VaultState} from '../xs/vault.state';
import {map} from 'rxjs/operators';

@Injectable()
export class VaultService {
  @Select(VaultState.getNodes) nodes$!: Observable<{ [id: string]: VaultItem }>;

  constructor(public store: Store) {
  }

  public getItemPath(item: VaultItem): Observable<VaultItem[]> {
    return this.nodes$.pipe(
      map((nodes) => {
        const result = [] as VaultItem[];
        let node = nodes[item.id] as VaultItem | null;

        while (node != null && !result.includes(node)) {
          result.push(node);

          node = node.parentFolderId == null ? null : nodes[node.parentFolderId];
        }

        return result.reverse();
      }),
    );
  }

  public getReadableItemPath(item: VaultItem): Observable<string> {
    return this.getItemPath(item).pipe(map((items) => items.map((x) => x.name).join('/')));
  }

  public getDescendantCount(itemId: string): Observable<number> {
    return this.nodes$.pipe(map((nodes) => VaultService.countDescendants(itemId, nodes)));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static countDescendants(itemId: string, nodes: { [id: string]: VaultItem }, depthLeft = 25): number {
    const node = nodes[itemId];

    if (node == null) {
      return -1;
    }

    if (depthLeft <= 0 || node.type !== VaultItemType.FOLDER) {
      return 0;
    }

    return node.childrenIds.reduce(
      (count, child) => count + 1 + VaultService.countDescendants(child, nodes, depthLeft - 1),
      0,
    );
  }
}
