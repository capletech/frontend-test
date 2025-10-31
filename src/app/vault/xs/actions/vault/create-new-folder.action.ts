export class CreateNewFolder {
  static readonly type = '[Vault] Create File';

  constructor(public readonly parentFolderId: string, public readonly name: string) {}
}
