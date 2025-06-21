export class FailureAnalysis {
  constructor(
    public description: string,
    public action: string,
    public cause: Error,
  ) {}
}
