import EE from 'events'

export interface Teamify extends EE.EventEmitter {
  $url: Readonly<string>
  $raw: Readonly<any>
  $connected: Readonly<boolean>
  $disconnected: Readonly<boolean>

  open(): void
  close(): void
  emit(event: string, body: any): void
  request(event: string, body: any): Promise<any>
}
