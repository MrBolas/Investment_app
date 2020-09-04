import { FileTransfer } from "../file_transfer_utils";

describe('File Transfer Utilities helper class', () => {

  /** CSV URI test generator
   */
  it('should be a csv URI', () => {
      const content = 'test';
      const csv_URI = FileTransfer.generateURI(content)  
      expect(csv_URI).toBe('data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content));
  });

  /** TXT URI test generator
   */
  it('should be a txt URI', () => {
    const content = 'test';
    const txt_URI = FileTransfer.generateURI(content, 'txt')  
    expect(txt_URI).toBe('data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  });  
  
  /** JSON URI test generator
   */
  it('should be a json URI', () => {
    const content = 'test';
    const json_URI = FileTransfer.generateURI(content, 'json')  
    expect(json_URI).toBe('data:application/json;charset=utf-8,' + encodeURIComponent(content));
  });  
  
  /** XLS URI test generator
   */
  it('should be a xls URI', () => {
    const content = 'test';
    const xls_URI = FileTransfer.generateURI(content, 'xls')  
    expect(xls_URI).toBe('data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(content));
  });  
  
  /** XLM URI test generator
   */
  it('should be a xlm URI', () => {
    const content = 'test';
    const xls_URI = FileTransfer.generateURI(content, 'xml')  
    expect(xls_URI).toBe('data:application/xml;charset=utf-8,' + encodeURIComponent(content));
  });  
  
  /** failed URI test generator
   */
  it('should be a failed URI creation', () => {
    const content = 'test';
    const xls_URI = FileTransfer.generateURI(content, 'random')  
    expect(xls_URI).toBe('');
  });  

});