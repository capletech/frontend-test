export class ExpandFolder {
  static readonly type = '[Vault Explorer] Expand Folder';

  constructor(public readonly folderId: string) {}
}
