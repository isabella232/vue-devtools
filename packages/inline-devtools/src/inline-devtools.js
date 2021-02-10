import { initDevTools } from '@front'
import Bridge from '@utils/bridge'
import { installHook } from '@back/hook'

/**
 * @param {HTMLDivElement} el - where to mount the devtools app
 * @param {HTMLIFrameElement} iframe - the iframe containing the Vue app
 */
export function inlineDevtools(el, iframe) {
  function inject(src, done) {
    if (!src || src === 'false') {
      return done()
    }
    const script = iframe.contentDocument.createElement('script')
    script.src = src
    script.onload = done
    iframe.contentDocument.body.appendChild(script)
  }

  const source = ';(' + installHook.toString() + ')(window)'
  const targetWindow = iframe.contentWindow
  targetWindow.eval(source)

  initDevTools({
    el,
    connect (cb) {
      inject('./build/backend.js', () => {
        cb(new Bridge({
          listen (fn) {
            targetWindow.parent.addEventListener('message', evt => fn(evt.data))
          },
          send (data) {
            targetWindow.postMessage(data, '*')
          }
        }))
      })
    },
    onReload (reloadFn) {
      iframe.onload = reloadFn
    }
  })
}

