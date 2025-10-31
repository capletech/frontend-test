export class DeleteVaultItem {
  static readonly type = '[Vault] Delete Item';

  constructor(readonly itemId: string, readonly cascade = false) {}
}
