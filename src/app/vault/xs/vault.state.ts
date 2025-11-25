import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {VaultFolder, VaultItem, VaultItemType} from '../model/vault-item.model';
import {ClearVaultState} from './actions/vault/clear-vault-state.action';
import {VaultApiService} from '../service/vault-api.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {InitVaultTree} from './actions/vault/init-vault-tree.action';
import {CreateNewFolder} from './actions/vault/create-new-folder.action';
import {DeleteVaultItem} from './actions/vault/delete-vault-item.action';
import {CollapseFolder} from './actions/vault-explorer/collapse-folder.action';
import {MoveVaultItem} from './actions/vault/move-vault-item.action';

export interface VaultStateModel {
  nodes: { [id: string]: VaultItem };
  topNodeIds: string[];
  isInitialised: boolean;
}

@State<VaultStateModel>({
  name: 'Vault',
  defaults: {
    nodes: {},
    topNodeIds: [],
    isInitialised: false,
  },
})
@Injectable()
export class VaultState {
  constructor(private readonly vaultApiService: VaultApiService, private readonly store: Store) {
  }

  @Selector()
  static getNodes(state: VaultStateModel): { [id: string]: VaultItem } {
    return state.nodes;
  }

  @Selector()
  static getTopNodeIds(state: VaultStateModel): string[] {
    return state.topNodeIds;
  }

  @Selector()
  static isInitialised(state: VaultStateModel): boolean {
    return state.isInitialised;
  }

  @Selector()
  static getNode(state: VaultStateModel) {
    return (nodeId: string): VaultItem | undefined => state.nodes[nodeId];
  }

  @Action(InitVaultTree)
  initVault(ctx: StateContext<VaultStateModel>): Observable<void> {
    this.clearState(ctx);

    return this.vaultApiService.fetchVault().pipe(
      tap((response) => {
        ctx.patchState({
          nodes: Object.fromEntries(response.map((node) => [node.id, node])),
          topNodeIds: response
            .filter((node) => node.parentFolderId == null)
            .sort((a, b) => a.sort - b.sort)
            .map((node) => node.id),
          isInitialised: true,
        });
      }),
      map(() => undefined),
    );
  }

  @Action(CreateNewFolder)
  createNewFolder(ctx: StateContext<VaultStateModel>, action: CreateNewFolder): Observable<VaultFolder> {
    const {nodes} = ctx.getState();
    const {parentFolderId} = action;
    const parentNode = nodes[parentFolderId];

    if (parentNode == null || parentNode.type !== VaultItemType.FOLDER) {
      throw new Error();
    }

    throw new Error();
  }

  @Action(DeleteVaultItem)
  deleteVaultItem(ctx: StateContext<VaultStateModel>, action: DeleteVaultItem): Observable<void> {
    const {itemId, cascade} = action;

    this.store.dispatch(new CollapseFolder(itemId));

    return this.vaultApiService.delete(itemId, cascade).pipe(
      tap(() => {
        const {nodes, topNodeIds} = ctx.getState();
        const itemToDelete = nodes[itemId];

        if (itemToDelete == null) {
          throw new Error();
        }

        const nodeIdsToDelete = [] as string[];
        const nodeIdsToProcess = [itemId];

        while (nodeIdsToProcess.length !== 0) {
          const nodeId = nodeIdsToProcess.pop();

          if (nodeId == null || nodeIdsToDelete.includes(nodeId)) {
            // eslint-disable-next-line no-continue
            continue;
          }

          nodeIdsToDelete.push(nodeId);
          const item = nodes[nodeId];

          if (item?.type === VaultItemType.FOLDER) {
            nodeIdsToProcess.push(...item.childrenIds);
          }
        }

        let {parentFolderId} = itemToDelete;

        if (parentFolderId == null || nodes[parentFolderId]?.type !== VaultItemType.FOLDER) {
          parentFolderId = null;
        }

        ctx.patchState({
          topNodeIds: topNodeIds.filter((x) => x !== itemId),
          nodes: {
            ...Object.keys(nodes).reduce((acc, id) => {
              if (!nodeIdsToDelete.includes(id)) {
                acc[id] = nodes[id];
              }

              return acc;
            }, {} as { [id: string]: VaultItem }),
            ...(parentFolderId != null && {
              [parentFolderId]: {
                ...nodes[parentFolderId],
                childrenIds: (nodes[parentFolderId] as VaultFolder).childrenIds.filter((x) => x !== itemId),
              } as VaultFolder,
            }),
          },
        });
      }),
    );
  }

  @Action(MoveVaultItem)
  moveVaultItem(ctx: StateContext<VaultStateModel>, action: MoveVaultItem): Observable<void> {
    const {nodeId, targetFolderId, precedingSiblingId} = action;
    const {nodes} = ctx.getState();

    const targetFolder = targetFolderId == null ? null : nodes[targetFolderId];
    let newSort = 0;

    if (targetFolderId != null && targetFolder?.type !== VaultItemType.FOLDER) {
      throw new Error();
    }

    if (precedingSiblingId != null) {
      const precedingSibling = nodes[precedingSiblingId];

      if (
        precedingSibling != null &&
        ((precedingSibling.parentFolderId == null && targetFolderId == null) ||
          (targetFolder as VaultFolder)?.childrenIds.includes(precedingSiblingId))
      ) {
        newSort = precedingSibling.sort + 1;
      } else {
        throw new Error();
      }
    }

    return this.vaultApiService
      .patchVaultItem(
        nodeId,
        {
          parentFolderId: targetFolderId,
          sort: newSort,
        }
      )
      .pipe(
        tap(() => {
          /// Please implement the state update logic here
          /*
            Note:
            - subsequent siblings of the node in the new folder will have their sort increased by 1
            - do not decrease the sort of subsequent siblings in the old folder
            - lists of node ids must be sorted by the sort property of associated nodes
           */
          /// This comment denotes the end of the required implementation
        }),
      );
  }

  @Action(ClearVaultState)
  clearState(ctx: StateContext<VaultStateModel>): void {
    ctx.setState({
      nodes: {},
      topNodeIds: [],
      isInitialised: false,
    });
  }
}
