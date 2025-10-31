export class MoveVaultItem {
  static readonly type = '[Vault] Move Item';

  constructor(
    readonly nodeId: string,
    readonly targetFolderId: string | null,
    readonly precedingSiblingId: string | null,
  ) {}
}
