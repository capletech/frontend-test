import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FileTreeComponent} from './vault/file-tree/file-tree.component';
import {VaultExplorerComponent} from './vault/file-explorer/vault-explorer.component';
import {FileTreeNodeComponent} from './vault/file-tree/file-tree-node/file-tree-node.component';
import {NestedFileTreeComponent} from './vault/file-tree/nested-file-tree/nested-file-tree.component';
import {
  FileTreeNodeNewItemZoneComponent
} from './vault/file-tree/file-tree-node-new-item-zone/file-tree-node-new-item-zone.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {VaultState} from './vault/xs/vault.state';
import {VaultExplorerState} from './vault/xs/vault-explorer.state';
import {DragDropModule} from '@angular/cdk/drag-drop'
import {NgxsModule} from "@ngxs/store";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {VaultApiService} from "./vault/service/vault-api.service";
import {VaultService} from "./vault/service/vault.service";


@NgModule({
  declarations: [
    AppComponent,
    FileTreeComponent,
    NestedFileTreeComponent,
    VaultExplorerComponent,
    FileTreeNodeComponent,
    NestedFileTreeComponent,
    FileTreeNodeNewItemZoneComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([VaultState, VaultExplorerState]),
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    DragDropModule,
    FlexModule,
    FlexLayoutModule,
  ],
  providers: [VaultApiService, VaultService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
