/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-types
interface NameClass {
  getName(): string;
}
const beans: Object[] = [];
const getBeanContext = <T extends NameClass>(type: any, init: () => T): T => {
  let value: any;
  beans.forEach((bean) => {
    if (bean instanceof type) {
      value = bean;
    }
  });
  if (!value) {
    value = init();
    beans.push(value);
    console.log(`init ${value.getName()}`);
  }
  return value;
};
export { getBeanContext, NameClass };
