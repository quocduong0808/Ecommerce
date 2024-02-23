export class CommonUtils {
  public static removeAnElFromArray<T>(value: T, array: Array<T>) {
    const index = array.indexOf(value, 0);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }
}
