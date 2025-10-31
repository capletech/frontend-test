import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VaultFolder } from '../../model/vault-item.model';
import { interval } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { CreateNewFolder } from '../../xs/actions/vault/create-new-folder.action';

@Component({
  selector: 'app-file-tree-node-new-item-zone',
  templateUrl: './file-tree-node-new-item-zone.component.html',
  styleUrls: ['./file-tree-node-new-item-zone.component.scss'],
})
export class FileTreeNodeNewItemZoneComponent {
  @Input()
  parentNode!: VaultFolder;

  @ViewChild('newFileNameInput') newFileInputElement?: ElementRef<HTMLInputElement>;

  viewState: 'default' | 'new-folder' = 'default';

  newFolderName: string | null = null;

  isLoading = false;

  constructor(private readonly store: Store) {}

  getIcon(): string {
    switch (this.viewState) {
      case 'default':
        return 'upload_file_2';
      case 'new-folder':
        return 'folder';
      default:
        return 'upload_file_2';
    }
  }

  funNameTodo(): void {
    this.viewState = 'new-folder';
    this.focusOnFileInputElement();
  }

  focusOnFileInputElement(): void {
    if (this.newFileInputElement != null) {
      this.newFileInputElement.nativeElement.focus();

      return;
    }

    interval(20)
      .pipe(
        take(3),
        takeWhile(() => this.newFileInputElement == null),
      )
      .subscribe({
        complete: () => {
          if (this.newFileInputElement != null) {
            this.newFileInputElement.nativeElement.focus();
          }
        },
      });
  }

  onNewFolderSubmit(): void {
    this.isLoading = true;
    this.store.dispatch(new CreateNewFolder(this.parentNode.id, this.newFolderName ?? '')).subscribe(() => {
      this.isLoading = false;
      this.newFolderName = null;
      this.viewState = 'default';
    }); // todo: disallow nulls
  }

  onCancelNewFolderCreation(): void {
    this.viewState = 'default';
    this.isLoading = false;
  }
}
