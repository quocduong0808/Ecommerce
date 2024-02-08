// eslint-disable-next-line @typescript-eslint/no-var-requires
import fs from 'fs';
export type Config = {
  APP: {
    PORT: number;
  };
  DB: {
    HOST: string;
    PORT: number;
    NAME: string;
  };
};
const ENV_TYPE = {
  PROD: 'prod',
  DEV: 'dev',
};
export default class AppConfig {
  public static ENV: Config = {
    APP: {
      PORT: 0,
    },
    DB: {
      HOST: '',
      PORT: 0,
      NAME: '',
    },
  };
  public static loadConfigFromENV(): void {
    switch (process.env.APP_ENV) {
      case ENV_TYPE.DEV:
        this.ENV.APP.PORT = Number.parseInt(process.env.DEV_APP_PORT || '0');
        this.ENV.DB.HOST = process.env.DEV_DB_HOST || '';
        this.ENV.DB.PORT = Number.parseInt(process.env.DEV_DB_PORT || '0');
        this.ENV.DB.NAME = process.env.DEV_DB_NAME || '';
        break;
      case ENV_TYPE.PROD:
        this.ENV.APP.PORT = Number.parseInt(process.env.PROD_APP_PORT || '0');
        this.ENV.DB.HOST = process.env.PROD_DB_HOST || '';
        this.ENV.DB.PORT = Number.parseInt(process.env.PROD_DB_PORT || '0');
        this.ENV.DB.NAME = process.env.PROD_DB_NAME || '';
        break;
      default:
        break;
    }
    console.log(`Load ${process.env.APP_ENV} environment success`);
  }
  public static loadConfigFromFile(): void {
    const pathResource = `src/configs/env/config.${process.env.APP_ENV}.json`;
    this.ENV = JSON.parse(fs.readFileSync(pathResource, 'utf8')) as Config;
    console.log(`Load ${process.env.APP_ENV} environment success`);
  }
  public static loadConfig(): void {
    switch (process.env.USE_RESOURCE_CONFIG) {
      case '0':
        this.loadConfigFromENV();
        break;
      case '1':
        this.loadConfigFromFile();
        break;
      default:
        this.loadConfigFromFile();
        break;
    }
  }
}
