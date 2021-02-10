import { initDevTools } from '@front'
import Bridge from '@utils/bridge'
import { installHook } from '@back/hook'

/**
 * @param {HTMLDivElement} el - where to mount the vue app
 * @param {HTMLIFrameElement} iframe - the iframe
 */
export function inlineDevtools(el, iframe) {
  function inject(src, done) {
    console.log('Injecting', src)
    if (!src || src === 'false') {
      return done()
    }
    const script = iframe.contentDocument.createElement('script')
    script.src = src
    script.onload = done
    iframe.contentDocument.body.appendChild(script)
  }

  console.log('inlineDevtools')
  const source = ';(' + installHook.toString() + ')(window)'
  const targetWindow = iframe.contentWindow
  console.log(targetWindow)
  targetWindow.eval(source)

  initDevTools({
    connect (cb) {
      console.log('Inject')
      // 3. called by devtools: inject backend
      inject('./backend.js', () => {
        // 4. send back bridge
        cb(new Bridge({
          listen (fn) {
            targetWindow.parent.addEventListener('message', evt => fn(evt.data))
          },
          send (data) {
            console.log('devtools -> backend', data)
            targetWindow.postMessage(data, '*')
          }
        }))
      })
    },
    onReload (reloadFn) {
      iframe.onload = reloadFn
    },
    el,
  })
}

