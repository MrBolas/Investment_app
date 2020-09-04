    /**
     * Helper class that deals with Downloading and Uploading Files
     */
export class FileTransfer {

  constructor() { }

  /**
   * Method responsable by downloading a file in browser
   * @param data_uri URI of the file to be downloaded
   */
  static downloadFile(data_uri : string, filename :string = 'downloaded')
  {
      const anchor = document.createElement('a')
      anchor.href = data_uri
    
      anchor.download = filename;
      anchor.setAttribute('style', 'visibility:hidden')
    
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
  }

  /**
   * Method responsable by generating the URI for content
   * @param content Stringified content to be included.
   * @param format Format of the resulting URI
   */
  static generateURI(content:string, format:string = 'csv')
  {
      switch (format) {
          case 'txt': {
            return 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
          }
          case 'json': {
            return 'data:application/json;charset=utf-8,' + encodeURIComponent(content)
          }
          case 'csv': {
            return 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content)
          }
          case 'xls': {
            return 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(content)
          }
          case 'xml': {
            return 'data:application/xml;charset=utf-8,' + encodeURIComponent(content)
          }
          default : {
            return ''
          }
      }
  }
}