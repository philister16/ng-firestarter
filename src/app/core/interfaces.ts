/**
 * @description Interface for database status
 */
export interface DbStatus extends Array<any> {
  0: boolean; // isUpdating
  1: string; // error message
  2: string; // success message
}
