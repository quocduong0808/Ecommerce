export const AppConst = {
  HTTP: {
    CODE: {
      ERROR: 'XXXXX',
      TOKEN_EXPIRE_ERROR: '000000',
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
    CLIENT_ID: 'x-client-id',
  },
  AUTH: {
    PERMISSION_DENIED: 'Permission denied',
    APIKEY_NOTFOUND: 'API key not found',
    SHOP_NOT_REG: 'Shop is not registed',
    TOKEN_SECURITY_ERROR: 'Something wrong. Please register',
    TOKEN_EXPIRE: 'jwt expired',
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
    LOGOUT: {
      LOGOUT_SUCCESS: 'Logout successfully',
    },
  },
  MONGO_MODEL: {
    COLLECTION: {
      SHOP: 'shops',
      KEY_STORE: 'keys',
      API_KEY: 'apikeys',
      PRODUCT: 'products',
      CLOTHING: 'clothings',
      ELECTRONIC: 'electronics',
    },
    DOCUMENT: {
      SHOP: 'shop',
      KEY_STORE: 'key',
      API_KEY: 'apikey',
      PRODUCT: 'product',
      CLOTHING: 'clothing',
      ELECTRONIC: 'electronic',
    },
  },
  PRIVILEGE: {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    READ: 'READ',
    ADMIN: 'ADMIN',
  },
  SHOP: {
    PRODUCT_TYPE_ERROR: 'Product type does not exit',
  },
};
