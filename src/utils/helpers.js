/**
 * Helper functions to apply proper syntax highlighting
 */
const renderUtils = {
  /**
   * Check if an entry is empty
   * @param {Object} content The respective content
   * @return {Boolean}
   */
  isEmpty: content => content.length === 0 || Object.keys(content).length === 0,

  /**
   * Adds syntax highlighting to JSON codeblock
   * @param {String} key The hoppscotch-collection.json key
   * @param {String} content The codeblock
   * @returns {String}
   */
  prettifyJSON: (key, content) => {
    return (
      ` - ${key}:` + '\n```json\n' + JSON.stringify(content, null, 2) + '\n```'
    )
  },

  /**
   * Adds syntax highlighting to JS codeblock
   * @param {String} key The hoppscotch-collection.json key
   * @param {String} content The codeblock
   * @returns {String}
   */
  prettifyJs: (key, content) =>
    ` - ${key}:` + '\n```javascript\n' + content + '\n```',

  /**
   * Adds syntax highlighting to JSON codeblock
   * @param {String} key The hoppscotch-collection.json key
   * @param {String} content The codeblock
   * @returns {String}
   */
  prettifyJSONWithCheck: (key, content) =>
    renderUtils.isEmpty(content) ? '' : renderUtils.prettifyJSON(key, content),

  /**
   * Adds syntax highlighting to raw-params
   * @param {String} key The hoppscotch-collection.json key
   * @param {String} content The codeblock
   * @returns {String}
   */
  rawParams: (key, content) => {
    const parsed = JSON.parse(content)
    return renderUtils.isEmpty(parsed)
      ? ''
      : renderUtils.prettifyJSON(key, parsed)
  },

  /**
   * Format text content
   * @param {String} key The hoppscotch-collection.json key
   * @param {String} content The content
   * @returns {String}
   */
  formatKey: (key, content) => ` - ${key}: ${content}`,

  /**
   * Format text content for request buttons
   * @param {Object} request The hoppscotch-collection.json Object
   * @returns {String}
   */
  requestButton: request => {
    const { url, path } = request
    return `<HoppRequest url="${url}" path="${path}" />`
  },

  auth: (key, content) =>
    content === 'None' ? '' : renderUtils.formatKey(key, content),
  headers: (key, content) => renderUtils.prettifyJSONWithCheck(key, content),
  params: (key, content) => renderUtils.prettifyJSONWithCheck(key, content),
  bodyParams: (key, content) => renderUtils.prettifyJSONWithCheck(key, content),
  preRequestScript: (key, content) => renderUtils.prettifyJs(key, content),
  testScript: (key, content) => renderUtils.prettifyJs(key, content)
}

module.exports = renderUtils
