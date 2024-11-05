/**
 * @description An interface for asynchronous status in components
 */
export interface AsyncStatus extends Array<any> {
  0: boolean; // isUpdating
  1: string | null; // error message
  2: string | null; // success message
}
