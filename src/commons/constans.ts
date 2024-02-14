export const AppConst = {
  HTTP: {
    CODE: {
      ERROR: 'XXXXX',
      SUCCESS: '20000',
      PERMISSION_DENIED: '403',
    },
    STATUS: {
      ERROR: 'ERROR',
      SUCCESS: 'SUCCESS',
      PERMISSION_DENIED: 'FORBIDDEN',
    },
  },
  HEADER: {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
  },
  AUTH: {
    PERMISSION_DENIED: 'Permission denied',
    APIKEY_NOTFOUND: 'API key not found',
  },
  HOME: {
    WELCOME: 'Welcome to Ecommerce server',
    SIGN_UP: {
      SHOP_EXISTED_ERROR: 'This shop already existed',
      REGISTRATION_ERROR: 'Some thing error, cannot registration',
      CREATE_SHOP_ERROR: 'Cannot create new shop',
      CREATE_TOKEN_ERROR: 'Cannot create new token',
      SUCCESS: 'Registration success',
    },
  },
  MONGO_MODEL: {
    COLLECTION: {
      SHOP: 'shops',
      KEY_STORE: 'keys',
      API_KEY: 'apikeys',
    },
    DOCUMENT: {
      SHOP: 'shop',
      KEY_STORE: 'key',
      API_KEY: 'apikey',
    },
  },
  PRIVILEGE: {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    READ: 'READ',
    ADMIN: 'ADMIN',
  },
};
