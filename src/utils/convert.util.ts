import _ from 'lodash';
import { NameClass, getBeanContext } from '../commons/app.context';
class ConvertUtil implements NameClass {
  getName(): string {
    return 'ConvertUtil';
  }
  public getInfosData(prop: string[], object: object) {
    return _.pick(object, ...prop);
  }
}

const convertUtil = getBeanContext<ConvertUtil>(
  ConvertUtil,
  () => new ConvertUtil()
);

export { convertUtil };
