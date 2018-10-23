import * as Discord from 'discord.js';
import { IBotConfig, ILogger } from '../api';

export class QuestBot {
  private _cfg: IBotConfig
  private _logger: ILogger;

  private _client?: Discord.Client

  constructor(cfg: IBotConfig, logger: ILogger) {
    this._cfg = cfg
    this._logger = logger;
  }
  
  start(): void {
    this._client = new Discord.Client();

    this._client.on('ready', () => {
      if (this._cfg.game) {
          this._client!.user.setGame(this._cfg.game)
      }
      this._client!.user.setStatus('online')
      this._logger.info('started...')
    })

    this._client.login(this._cfg.token)
  }
}
