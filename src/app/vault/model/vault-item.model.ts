export interface BaseVaultItem {
  id: string;
  type: VaultItemType;
  name: string;
  parentFolderId: string | null;
  userId: string | null;
  sort: number;
  createdAt: Date | string; // todo: proper date conversion and handling
  updatedAt: Date | string;
}

export interface VaultFile extends BaseVaultItem {
  type: VaultItemType.FILE;
  size: number;
}

export interface VaultFolder extends BaseVaultItem {
  type: VaultItemType.FOLDER;
  childrenIds: string[];
}

// eslint-disable-next-line no-shadow
export enum VaultItemType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export type VaultItem = VaultFile | VaultFolder;
