/// <reference types="cheerio" />
/// <reference types="node" />
import { Table } from './interfaces';
export default class Get {
    /**
     * Builds an array of elements out of all the children of a given parent element
     */
    static findChildren(obj: CheerioElement, filter: (element: CheerioElement) => boolean): CheerioElement[];
    /**
     * Takes a given HTML element and nicely parses the text within
     */
    static findText(obj: CheerioElement): string;
    static tables(data: string | Buffer, { columnNames }?: {
        columnNames?: string[];
    }): [Table, Table];
}
