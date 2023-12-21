import Api from './Api';
import ApiURIs from './ApiURIs';
import ApiConstants from './ApiConstants';

import {BASE_URL} from './ApiConstants';
export default {
  API: Api.create(BASE_URL),
  ApiURIs,
  ApiConstants,
};
