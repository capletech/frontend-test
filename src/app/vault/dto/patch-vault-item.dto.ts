export interface PatchVaultItemLocationDto {
  parentFolderId: string | null;
  sort: number;
}

export interface PatchVaultItemNameDto {
  name: string;
}

export type PatchVaultItemDto = PatchVaultItemLocationDto | PatchVaultItemNameDto;
