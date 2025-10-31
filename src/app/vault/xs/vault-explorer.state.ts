import { Action, createSelector, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ExpandFolder } from './actions/vault-explorer/expand-folder.action';
import { VaultState } from './vault.state';
import { CollapseFolder } from './actions/vault-explorer/collapse-folder.action';
import { VaultItemType } from '../model/vault-item.model';
import { SetIsDragging } from './actions/vault-explorer/set-is-dragging.action';
import { OpenNewItemZone } from './actions/vault-explorer/open-new-item-zone.action';
import { CloseNewItemZone } from './actions/vault-explorer/close-new-item-zone.action';

export interface VaultExplorerStateModel {
  expandedFolders: string[];
  isDragging: boolean;
  folderWithNewItemZoneOpen: string | null;
}

// to-do: Expanded folder ID cleanup
@State<VaultExplorerStateModel>({
  name: 'VaultExplorer',
  defaults: {
    expandedFolders: [],
    isDragging: false,
    folderWithNewItemZoneOpen: null,
  },
})
@Injectable()
export class VaultExplorerState {
  constructor(private readonly store: Store) {}

  static isExpanded(folderId: string): (state: VaultExplorerStateModel) => boolean {
    return createSelector([VaultExplorerState], (state: VaultExplorerStateModel) =>
      state.expandedFolders.includes(folderId),
    );
  }

  static hasNewItemZoneOpened(folderId: string): (state: VaultExplorerStateModel) => boolean {
    return createSelector(
      [VaultExplorerState],
      (state: VaultExplorerStateModel) => state.folderWithNewItemZoneOpen === folderId,
    );
  }

  @Selector()
  static expandedFolders(state: VaultExplorerStateModel): string[] {
    return state.expandedFolders;
  }

  @Selector()
  static isDragging(state: VaultExplorerStateModel): boolean {
    return state.isDragging;
  }

  @Selector()
  static folderWithNewItemZoneOpen(state: VaultExplorerStateModel): string | null {
    return state.folderWithNewItemZoneOpen;
  }

  @Action(SetIsDragging)
  setIsDragging(ctx: StateContext<VaultExplorerStateModel>, action: SetIsDragging): void {
    const { isDragging } = action;

    if (ctx.getState().isDragging === isDragging) {
      return;
    }

    ctx.patchState({ isDragging });
  }

  @Action(ExpandFolder)
  expandFolder(ctx: StateContext<VaultExplorerStateModel>, action: ExpandFolder): void {
    const { expandedFolders } = ctx.getState();
    const { folderId } = action;

    if (expandedFolders.includes(folderId)) {
      return;
    }

    ctx.patchState({ expandedFolders: [...expandedFolders, folderId] });
  }

  @Action(CollapseFolder)
  collapseFolder(ctx: StateContext<VaultExplorerStateModel>, action: CollapseFolder): void {
    const nodes = this.store.selectSnapshot(VaultState.getNodes);
    const { expandedFolders, folderWithNewItemZoneOpen } = ctx.getState();
    const idsToCollapse = [] as string[];
    const idsToCheck = [action.folderId];
    const idsChecked = [];

    while (idsToCheck.length > 0) {
      const id = idsToCheck.pop();

      if (id == null || idsToCheck.includes(id)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      idsChecked.push(id);
      const folder = nodes[id];

      if (folder?.type === VaultItemType.FOLDER && expandedFolders.includes(id)) {
        idsToCollapse.push(folder.id);
        idsToCheck.push(...folder.childrenIds);
      }
    }

    if (idsToCollapse.length < 1) {
      return;
    }
    const closeNewItemZone = folderWithNewItemZoneOpen != null && idsToCollapse.includes(folderWithNewItemZoneOpen);

    ctx.patchState({
      expandedFolders: expandedFolders.filter((x) => !idsToCollapse.includes(x)),
      ...(closeNewItemZone && { folderWithNewItemZoneOpen: null }),
    });
  }

  @Action(OpenNewItemZone)
  showNewItemZone(ctx: StateContext<VaultExplorerStateModel>, action: OpenNewItemZone): void {
    ctx.patchState({ folderWithNewItemZoneOpen: action.folderId });
  }

  @Action(CloseNewItemZone)
  hideNewItemZone(ctx: StateContext<VaultExplorerStateModel>): void {
    ctx.patchState({ folderWithNewItemZoneOpen: null });
  }

  clearState(ctx: StateContext<VaultExplorerStateModel>): void {
    ctx.setState({
      expandedFolders: [],
      isDragging: false,
      folderWithNewItemZoneOpen: null,
    });
  }
}
