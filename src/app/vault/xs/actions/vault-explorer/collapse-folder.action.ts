export class CollapseFolder {
  static readonly type = '[Vault Explorer] Collapse Folder';

  constructor(public readonly folderId: string) {}
}
