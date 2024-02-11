export const AppConst = {
  HTTP: {
    CODE: {
      ERROR: 'XXXXX',
      SUCCESS: '20000',
    },
    STATUS: {
      ERROR: 'ERROR',
      SUCCESS: 'SUCCESS',
    },
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
      SHOP: 'Shops',
      KEY_STORE: 'Keys',
    },
    DOCUMENT: {
      SHOP: 'Shops',
      KEY_STORE: 'Key',
    },
  },
  PRIVILEGE: {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    READ: 'READ',
    ADMIN: 'ADMIN',
  },
};
