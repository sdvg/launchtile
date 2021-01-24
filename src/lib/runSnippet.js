import * as ExecutionTypes from '@/constants/executionTypes.js'

export default ({ code, executionType = ExecutionTypes.EXECUTE_SCRIPT }) => {
  if (executionType === ExecutionTypes.INJECT) {
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
