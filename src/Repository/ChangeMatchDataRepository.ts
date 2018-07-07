export interface ChangeMatchDateRepository {
  get(): Promise<Date>
  save(date: Date): Promise<void>
}