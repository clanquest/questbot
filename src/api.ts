export interface IBotConfig {
  commandPrefix: string
  token: string
  game?: string
}

export interface IWebhookConfig {
  id: string
  token: string
}

export interface ILoggerMethod {
  (msg: string, ...args: any[]): void
  (obj: object, msg?: string, ...args: any[]): void
}

export interface ILogger {
  debug: ILoggerMethod
  info: ILoggerMethod
  warn: ILoggerMethod
  error: ILoggerMethod
}
