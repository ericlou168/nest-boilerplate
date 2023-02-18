import stack from 'callsites';
import { readFile } from 'fs';
import { dirname, resolve } from 'path';
import { DataSource, ObjectLiteral } from 'typeorm';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
export async function ReadSQLFile(sqlPath: string) {
  const caller = stack()[0].getFileName() || '';
  const callerDirname = dirname(caller);
  return readFileAsync(resolve(callerDirname, '../', sqlPath), 'utf8');
}
export async function RawQuery(path: string, dataSource: DataSource, params: ObjectLiteral) {
  const sql = await ReadSQLFile(path);
  const [q, p] = dataSource.driver.escapeQueryWithParameters(sql, params, {});
  return await dataSource.query(q, p);
}
