import * as executionTypes from '@/constants/executionTypes.js'

export default ({ code, executionType = executionTypes.EXECUTE_SCRIPT }) => {
  if (executionType === executionTypes.INJECT) {
    const generatedCode = `{
      const scriptElement = document.createElement('script');
      scriptElement.textContent = unescape('${escape(code)}');
      document.body.appendChild(scriptElement);
      scriptElement.remove();
    }`

    browser.tabs.executeScript(null, { code: generatedCode })
  } else {
    browser.tabs.executeScript(null, { code })
  }
}
