import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { VaultExplorerState } from '../../xs/vault-explorer.state';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MoveVaultItem } from '../../xs/actions/vault/move-vault-item.action';

@Component({
  selector: 'app-nested-file-tree',
  templateUrl: './nested-file-tree.component.html',
  styleUrls: ['./nested-file-tree.component.scss'],
})
export class NestedFileTreeComponent implements OnInit, OnDestroy {
  @Input()
  nodeIds$!: Observable<string[]>;

  @Input()
  containingNodeId!: string | null;

  fragments: (string | string[])[] = [];

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    combineLatest(this.nodeIds$, this.store.select(VaultExplorerState.expandedFolders))
      .pipe(takeUntil(this.destroy$))
      .subscribe(([nodeIds, expandedNodes]) => {
        if (this.containingNodeId != null && !expandedNodes.includes(this.containingNodeId)) {
          this.fragments = [];

          return;
        }

        const fragments = [] as (string | string[])[];
        let lastList = [] as string[];

        for (const nodeId of nodeIds) {
          if (expandedNodes.includes(nodeId)) {
            if (lastList.length > 0) {
              fragments.push(lastList);
              lastList = [];
            }
            fragments.push(nodeId);
          } else {
            lastList.push(nodeId);
          }
        }

        if (lastList.length > 0) {
          fragments.push(lastList);
        }

        this.fragments = fragments;
      });
  }

  onDrop(
    event: CdkDragDrop<
      { containingNodeId: string | null; fragmentIndex: number },
      { containingNodeId: string | null; fragmentIndex: number },
      string
    >,
  ): void {
    const targetFragmentIndex = event.container.data.fragmentIndex;
    const nodeId = event.item.data;
    let newNodeIndex = event.currentIndex;
    let predecessorId = null as string | null;
    let predecessorSearchIndex = targetFragmentIndex - 1;

    if (
      this.containingNodeId === event.previousContainer.data.containingNodeId &&
      targetFragmentIndex === event.previousContainer.data.fragmentIndex &&
      newNodeIndex > event.previousIndex
    ) {
      newNodeIndex += 1;
    }

    if (newNodeIndex > 0) {
      predecessorId = this.asElemArr(this.fragments[targetFragmentIndex])[newNodeIndex - 1];
    }

    while (predecessorSearchIndex >= 0 && predecessorId == null) {
      const searchFragment = this.fragments[predecessorSearchIndex];

      if (this.isArray(searchFragment)) {
        const searchArray = this.asElemArr(searchFragment);

        if (searchArray.length > 0) {
          predecessorId = searchArray[searchArray.length - 1];
        }
      } else {
        predecessorId = this.asElem(searchFragment);
      }

      predecessorSearchIndex -= 1;
    }

    this.store.dispatch(new MoveVaultItem(nodeId, this.containingNodeId, predecessorId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isArray<T>(x: T | T[]): boolean {
    return Array.isArray(x);
  }

  asElem<T>(x: T | T[]): T {
    return x as T;
  }

  asElemArr<T>(x: T | T[]): T[] {
    return x as T[];
  }
}
