import { initDevTools } from '@front'
import Bridge from '@utils/bridge'
import { installHook } from '@back/hook'

// const target = document.getElementById('target')
// const targetWindow = target.contentWindow

// lol
// https://stackoverflow.com/questions/16194398/inject-a-javascript-function-into-an-iframe
// const source = ';(' + installHook.toString() + ')(window)'
// frames[0].window.eval(source)
// console.log(targetWindow)
// target.contentWindow.eval(source)
  // if (document instanceof HTMLDocument) {
  //   console.log('### yes')

  //   const script = document.createElement('script')
  //   script.textContent = source
  //   document.documentElement.appendChild(script)
  //   script.parentNode.removeChild(script)
  // }
// }

/**
 * @param {HTMLDivElement} el - where to mount the vue app
 * @param {HTMLIFrameElement} iframe - the iframe
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
  console.log(targetWindow)
  targetWindow.eval(source)

  initDevTools({
    el: '#app',
    connect (cb) {
      // 3. called by devtools: inject backend
      inject('./build/backend.js', () => {
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
      target.onload = reloadFn
    },
    el,
  })
}

// 1. load user app
// target.src = 'target.html'
target.onload = () => {
  inlineDevtools('#app', document.getElementById('target'))
}

