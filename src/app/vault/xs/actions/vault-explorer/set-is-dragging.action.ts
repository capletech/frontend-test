export class SetIsDragging {
  static readonly type = '[Vault Explorer] Set isDragging';

  constructor(public readonly isDragging: boolean) {}
}
