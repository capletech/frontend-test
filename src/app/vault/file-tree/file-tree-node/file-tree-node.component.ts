import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VaultFolder, VaultItem, VaultItemType} from '../../model/vault-item.model';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {VaultState} from '../../xs/vault.state';
import {debounceTime, delay, distinctUntilChanged, filter, map, take, takeUntil, tap} from 'rxjs/operators';
import {CollapseFolder} from '../../xs/actions/vault-explorer/collapse-folder.action';
import {ExpandFolder} from '../../xs/actions/vault-explorer/expand-folder.action';
import {expandCollapse, expandCollapseOnEnterLeave} from '../../../shared/animations/shared-animations';
import {VaultExplorerState} from '../../xs/vault-explorer.state';
import {SetIsDragging} from '../../xs/actions/vault-explorer/set-is-dragging.action';
import {CdkDragRelease, CdkDragStart} from '@angular/cdk/drag-drop';
import {VaultService} from '../../service/vault.service';
import {OpenNewItemZone} from '../../xs/actions/vault-explorer/open-new-item-zone.action';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-file-tree-node',
  templateUrl: './file-tree-node.component.html',
  styleUrls: ['./file-tree-node.component.scss'],
  animations: [expandCollapse, expandCollapseOnEnterLeave],
})
export class FileTreeNodeComponent implements OnInit, OnDestroy {
  @Input()
  nodeId!: string;

  node?: VaultItem;

  private destroy$ = new Subject<void>();

  isHover = false;

  isExpanded = false;

  isDragging = false;

  nodePath$!: Observable<string>;

  _showNewItemZone = false;

  public get showNewItemZone(): boolean {
    return this._showNewItemZone;
  }

  public set showNewItemZone(newVal: boolean) {
    this._showNewItemZone = newVal;
    this.evalShouldCollapseSelf();
  }

  shouldCollapseSelf$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly store: Store,
    private readonly vaultService: VaultService,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.store
      .select(VaultExplorerState.isDragging)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDragging) => {
        this.isDragging = isDragging;
      });

    this.store
      .select(VaultState.getNode)
      .pipe(
        map((nodes) => nodes(this.nodeId)),
        filter((node) => node != null),
        map((node) => node as VaultItem),
        takeUntil(this.destroy$),
        tap((node) => {
          this.node = node;
        }),
        take(1),
      )
      .subscribe((node) => {
        if (node.type === VaultItemType.FOLDER) {
          this.nodePath$ = this.vaultService.getReadableItemPath(node);
          this.store
            .select(VaultExplorerState.isExpanded(node.id))
            .pipe(takeUntil(this.destroy$), delay(20))
            .subscribe((isExpanded) => {
              this.isExpanded = isExpanded;
            });
          this.store
            .select(VaultExplorerState.hasNewItemZoneOpened(node.id))
            .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((showNewItemZone) => {
              this.showNewItemZone = showNewItemZone;
            });
        }
      });

    this.shouldCollapseSelf$.pipe(filter(Boolean), takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      this.store.dispatch(new CollapseFolder(this.nodeId));
    });
  }

  isFile(): boolean {
    return this.node?.type === VaultItemType.FILE;
  }

  isFolder(): boolean {
    return this.node?.type === VaultItemType.FOLDER;
  }

  childrenIds(): Observable<string[]> {
    return this.node?.type === VaultItemType.FOLDER
      ? this.store.select(VaultState.getNode).pipe(
        map((nodes) => nodes(this.nodeId)),
        filter((node) => node != null),
        map((node) => node as VaultFolder),
        map((node) => node.childrenIds),
        takeUntil(this.destroy$),
      )
      : of([]);
  }

  onClick(event: Event): void {
    event.stopPropagation();
    if (this.node?.type === VaultItemType.FOLDER) {
      if (this.isExpanded) {
        this.isExpanded = false;
        setTimeout(() => {
          this.store.dispatch(new CollapseFolder(this.nodeId));
        }, 300);
      } else {
        if (this.node.childrenIds.length < 1) {
          this.store.dispatch(new OpenNewItemZone(this.nodeId));
        }
        this.store.dispatch(new ExpandFolder(this.nodeId));
      }
    }
  }

  evalShouldCollapseSelf(): void {
    const shouldCollapseSelf =
      this.isExpanded &&
      !this.showNewItemZone &&
      this.node?.type === VaultItemType.FOLDER &&
      (this.node.childrenIds?.length ?? 0) === 0;

    if (this.shouldCollapseSelf$.value !== shouldCollapseSelf) {
      this.shouldCollapseSelf$.next(shouldCollapseSelf);
    }
  }

  // todo: depending on where you put "onClick", some calls may be redundant, maybe yeetable
  stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }

  nodeAsVaultFolder(): VaultFolder {
    return this.node as VaultFolder; // todo: make it cleaner
  }

  onNewItemButtonClicked(event: Event): void {
    event.stopPropagation();
    if (!this.isExpanded) {
      this.store.dispatch(new ExpandFolder(this.nodeId));
    }
    this.store.dispatch(new OpenNewItemZone(this.nodeId));
  }

  onRenameFolderButtonClicked(event: Event): void {
    event.stopPropagation();
    throw new Error();
  }

  onDeleteFolderButtonClicked(event: Event): void {
    event.stopPropagation();
    alert('stub');
  }

  icon(): string {
    if (this.node?.type === VaultItemType.FOLDER) {
      return 'folder';
    }

    switch (this.node?.name?.split('.')?.pop()) {
      default:
        return 'insert_drive_file';
    }
  }

  showToolbar(): boolean {
    return this.isFolder() && this.isHover && !this.isDragging;
  }

  isUnmovable(): boolean {
    return this.isExpanded;
  }

  onDragStarted(event: CdkDragStart): void {
    this.store.dispatch(new SetIsDragging(true));
    this.store.dispatch(new CollapseFolder(this.nodeId));
  }

  onDragRelease(event: CdkDragRelease): void {
    this.store.dispatch(new SetIsDragging(false));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
