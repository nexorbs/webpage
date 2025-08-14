<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps(['color', 'speed'])

const iconColor = ref(props.color === 'white' ? '#faf9f6' : '#0c0c0c')

onMounted(() => {
  !(function (t, e) {
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = e())
      : 'function' == typeof __SVGATOR_DEFINE__ && __SVGATOR_DEFINE__.amd
        ? __SVGATOR_DEFINE__(e)
        : (((t = 'undefined' != typeof globalThis ? globalThis : t || self).__SVGATOR_PLAYER__ =
            t.__SVGATOR_PLAYER__ || {}),
          (t.__SVGATOR_PLAYER__['5c7f360c'] = e()))
  })(this, function () {
    'use strict'
    const t = n(Math.pow(10, -6)),
      e = n(Math.pow(10, -2))
    function n(t, e = 6) {
      return (function (t, e, n) {
        if (Number.isInteger(t)) return t
        const r = Math.pow(10, e)
        return Math[n]((+t + Number.EPSILON) * r) / r
      })(t, e, 'round')
    }
    function r(e, n, r = t) {
      return Math.abs(e - n) < r
    }
    n(Math.pow(10, -4))
    const i = Math.PI / 180
    function s(t) {
      return t * i
    }
    function o(t) {
      return t / i
    }
    function u(t) {
      return 'number' != typeof t && (t = Number(t)), isNaN(t) || !isFinite(t) ? 0 : t
    }
    let l = { iD: !1 }
    function a(t) {
      return `${t}`.replace(/['"]/g, '')
    }
    function c(t, e = 'px') {
      return t.endsWith(e) ? t : `${t}${e}`
    }
    function f(t = '') {
      return l.iD ? t : void 0
    }
    function h(t) {
      const e = [
          '^',
          '\\s*',
          '(matrix\\()',
          '(?<a>-?[0-9]*\\.?[0-9]+)',
          '\\s*',
          ',?',
          '\\s*',
          '(?<b>-?[0-9]*\\.?[0-9]+)',
          '\\s*',
          ',?',
          '\\s*',
          '(?<c>-?[0-9]*\\.?[0-9]+)',
          '\\s*',
          ',?',
          '\\s*',
          '(?<d>-?[0-9]*\\.?[0-9]+)',
          '\\s*',
          ',?',
          '\\s*',
          '(?<e>-?[0-9]*\\.?[0-9]+)',
          '\\s*',
          ',?',
          '\\s*',
          '(?<f>-?[0-9]*\\.?[0-9]+)',
          '\\)',
        ].join(''),
        n = t.match(new RegExp(e, 'i'))
      if (n)
        return [
          u(n.groups.a),
          u(n.groups.b),
          u(n.groups.c),
          u(n.groups.d),
          u(n.groups.e),
          u(n.groups.f),
        ]
    }
    function d(t, e = 'inline') {
      return t && t !== e ? ((t = a(t)) === e ? f(e) : t) : f(e)
    }
    function g(t, e = '1px') {
      if (!t || t === e) return f(e)
      if (t.endsWith('px') || t.endsWith('%')) return t
      const n = c((t = `${u(t)}`))
      return n === e ? f(e) : n
    }
    function p(t, e = 'none') {
      return t && t !== e
        ? (t = a(t)) === e
          ? f(e)
          : t.startsWith('url(#')
            ? t
            : (function (t) {
                const e = ['^', '\\s*', 'url\\(', '#', '(?<maskId>[a-zA-Z0-9\\-_]+)', '\\)'].join(
                    '',
                  ),
                  n = t.match(new RegExp(e, 'i'))
                if (n) return `url(#${n.groups.maskId})`
              })(t)
        : f(e)
    }
    function y(t, e = 'rgb(0, 0, 0)') {
      if (!t || t === e) return f(e)
      if ((t = a(t)) === e) return f(e)
      if (t.startsWith('rgb')) return t
      const n = (function (t) {
        const e = [
            '^',
            '\\s*',
            '#',
            '(?<red>[0-9A-Z]{1,2})',
            '(?<green>[0-9A-Z]{1,2})',
            '(?<blue>[0-9A-Z]{1,2})',
          ].join(''),
          n = t.match(new RegExp(e, 'i'))
        if (!n) return t
        const r = (t) => parseInt(t.length > 1 ? t : `${t}${t}`, 16)
        return `rgb(${r(n.groups.red)}, ${r(n.groups.green)}, ${r(n.groups.blue)})`
      })(t)
      return n === e ? f(e) : n
    }
    function m(t, e = '1') {
      return t && t !== e ? ((t = `${n(u(t), 3)}`) === e ? f(e) : t) : f(e)
    }
    let b = {}
    const v = {
      fill: 'none',
      stroke: 'none',
      opacity: '0.01',
      transform: 'matrix(0.001 0 0 0.001 -10000 -10000)',
    }
    function w({ element: t, tagType: e = 'path', property: n = 'd', attributeValue: r }) {
      return (
        b[r] ||
          (b[r] = (function ({
            element: t,
            tagType: e = 'path',
            property: n = 'd',
            attributeValue: r,
          }) {
            const i = t.ownerSVGElement,
              s = document.createElementNS(i.namespaceURI, e)
            s.setAttributeNS(null, n, r)
            for (const t in v) s.setAttributeNS(null, t, v[t])
            i.appendChild(s)
            const o = getComputedStyle(s)[n]
            return s.remove(), o
          })({ element: t, tagType: e, property: n, attributeValue: r })),
        b[r]
      )
    }
    const x = () => {
      b = {}
    }
    'object' == typeof window &&
      (window.removeEventListener('resize', x), window.addEventListener('resize', x))
    const A = {
        include: (t, e) => ['path'].includes(e),
        formatter: (t) =>
          (function (t, e = '') {
            return t && t !== e
              ? (t = a(t)) === e
                ? f(e)
                : t.startsWith('path(')
                  ? t
                  : `path('${t}')`
              : f(e)
          })(t),
      },
      _ = {
        include: (t, e) => ['rect', 'mask'].includes(e),
        formatter: (t, e, n) =>
          g(
            t,
            (function (t, e) {
              var n
              return (
                (null ===
                  (n = { mask: { x: '-150%', y: '-150%', width: '400%', height: '400%' } }[e]) ||
                void 0 === n
                  ? void 0
                  : n[t]) || (['x', 'y'].includes(t) ? '0px' : '100%')
              )
            })(e, n),
          ),
      },
      S = Object.freeze({
        d: A,
        display: (t) => d(t),
        height: _,
        fill: (t) => y(t),
        'fill-opacity': (t) => m(t),
        filter: (t) => d(t, 'none'),
        mask: (t) => p(t),
        opacity: (t) => m(t),
        stroke: (t) => y(t, 'none'),
        'stroke-opacity': (t) => m(t),
        'stroke-width': (t) => g(t),
        transform: (t) =>
          (function (t, e = 'none') {
            if (!t || t === e) return f(e)
            const n = h(t)
            return n ? `matrix(${n.join(', ')})` : t
          })(t),
        'transform-origin': (t) =>
          (function (t, e = '0px 0px') {
            if (!t || t === e) return f(e)
            const n = [
                '^',
                '\\s*',
                '(?<x>[0-9]+)',
                '(px)?',
                '\\s*',
                ',',
                '\\s*',
                '(?<y>[0-9]+)',
                '(px)?',
              ].join(''),
              r = t.match(new RegExp(n, 'i'))
            if (!r) return t
            let i = `${u(r.groups.x)}`
            i = c(i)
            let s = `${u(r.groups.y)}`
            s = c(s)
            const o = `${i} ${s}`
            return o === e ? f(e) : o
          })(t),
        visibility: (t) => d(t, 'visible'),
        width: _,
        x: _,
        y: _,
      }),
      k = Object.keys(S),
      E = e
    function M(t, e, n, i, s = window) {
      var o, u
      const l = t.getAttribute(e),
        a = 'transform' === e ? 'none' : '',
        c =
          (s.safari &&
            !s.chrome &&
            (null === (o = i.getPropertyValue) || void 0 === o ? void 0 : o.call(i, e)) === a) ||
          'mask' === n
            ? l
            : null === (u = i.getPropertyValue) || void 0 === u
              ? void 0
              : u.call(i, e)
      if (l && c) {
        if (l === c) return l
        switch (e) {
          case 'transform':
            return (function (t, e) {
              const n = h(t),
                i = h(e)
              if ((null == n ? void 0 : n.length) === (null == i ? void 0 : i.length)) {
                for (let t = 0, e = n.length; t < e; t++)
                  if (n[t] !== i[t] && ((s = i[t]), !r((((o = n[t]) - s) / (o || 1)) * 100, 0, E)))
                    return
                var s, o
                return t
              }
            })(l, c)
          case 'd':
            return (function (t, e, n) {
              return w({ element: t, attributeValue: e }) === n ? e : void 0
            })(t, l, c)
          default:
            return c
        }
      }
    }
    function I(t, e, n, r) {
      var i, s, o, u
      const l =
        'transform' === e ||
        (['mask', 'path'].includes(n) && ['x', 'y', 'width', 'height', 'd'].includes(e))
      return r && l
        ? M(t, e, n, r)
        : ((null === (i = r.getPropertyValue) || void 0 === i ? void 0 : i.call(r, e)) ??
            (null === (s = t.attrs) || void 0 === s || null === (o = s.style) || void 0 === o
              ? void 0
              : o[e]) ??
            (null === (u = t.attrs) || void 0 === u ? void 0 : u[e]))
    }
    function N(t, e, n = !1) {
      l.iD = n
      const r = 'undefined' != typeof window && getComputedStyle(t),
        i = {}
      for (let l = 0, a = k.length; l < a; l++) {
        var s, o, u
        const a = k[l],
          c = t.type || t.nodeName
        if (!1 === (null === (s = (o = S[a]).include) || void 0 === s ? void 0 : s.call(o, a, c)))
          continue
        const f = S[a].formatter || S[a]
        if (null != e && null !== (u = e[t.id]) && void 0 !== u && u[a]) continue
        const h = I(t, a, c, r)
        if (null == h && !n) continue
        const d = f.call(this, h, a, c)
        d && (i[a] = d)
      }
      return i
    }
    function j(t) {
      var e, n
      if (null == t || null === (e = t.wD) || void 0 === e || !e.length) return
      this.h = t.wD.shift()
      const r = null === (n = t.rootId) || void 0 === n ? void 0 : n.slice(0, -1)
      this.wIs = t.wD.map((t) => `${r}${t}`)
    }
    function O(t) {
      this.cF = function (i, s) {
        return s()
      }
    }
    function T(t) {
      return t
    }
    function F(t, e, n) {
      const r = 1 - n
      return 3 * n * r * (t * r + e * n) + n * n * n
    }
    function V(t = 0, e = 0, n = 1, i = 1) {
      return t < 0 || t > 1 || n < 0 || n > 1
        ? null
        : r(t, e) && r(n, i)
          ? T
          : (s) => {
              if (s <= 0) return t > 0 ? (s * e) / t : 0 === e && n > 0 ? (s * i) / n : 0
              if (s >= 1)
                return n < 1
                  ? 1 + ((s - 1) * (i - 1)) / (n - 1)
                  : 1 === n && t < 1
                    ? 1 + ((s - 1) * (e - 1)) / (t - 1)
                    : 1
              let o,
                u = 0,
                l = 1
              for (; u < l; ) {
                o = (u + l) / 2
                const e = F(t, n, o)
                if (r(s, e)) break
                e < s ? (u = o) : (l = o)
              }
              return F(e, i, o)
            }
    }
    function R() {
      return 1
    }
    function C(t) {
      return 1 === t ? 1 : 0
    }
    function P(t = 1, e = 0) {
      if (1 === t) {
        if (0 === e) return C
        if (1 === e) return R
      }
      const n = 1 / t
      return (t) => (t >= 1 ? 1 : (t += e * n) - (t % n))
    }
    Number.isInteger ||
      (Number.isInteger = function (t) {
        return 'number' == typeof t && isFinite(t) && Math.floor(t) === t
      }),
      Number.EPSILON || (Number.EPSILON = 2220446049250313e-31)
    const $ = Math.sin,
      D = Math.cos,
      L = Math.acos,
      q = Math.asin,
      z = Math.tan,
      G = Math.atan2,
      W = Math.sqrt
    function Y(t, e) {
      return {
        a: t[0] * e[0] + t[2] * e[1],
        b: t[1] * e[0] + t[3] * e[1],
        c: t[0] * e[2] + t[2] * e[3],
        d: t[1] * e[2] + t[3] * e[3],
        tx: t[0] * e[4] + t[2] * e[5] + t[4],
        ty: t[1] * e[4] + t[3] * e[5] + t[5],
      }
    }
    function U(t, e, n) {
      return t >= 0.5 ? n : e
    }
    function H(t, e, n) {
      return 0 === t || e === n ? e : t * (n - e) + e
    }
    function Z(t, e, n) {
      const r = H(t, e, n)
      return r <= 0 ? 0 : r
    }
    function J(t, e, n) {
      const r = H(t, e, n)
      return r <= 0 ? 0 : r >= 1 ? 1 : r
    }
    function Q(t, e, n) {
      return 0 === t ? e : 1 === t ? n : { x: H(t, e.x, n.x), y: H(t, e.y, n.y) }
    }
    function X(t, e, n) {
      return 0 === t ? e : 1 === t ? n : { x: Z(t, e.x, n.x), y: Z(t, e.y, n.y) }
    }
    function K(t, e, n) {
      const r = (function (t, e, n) {
        return Math.round(H(t, e, n))
      })(t, e, n)
      return r <= 0 ? 0 : r >= 255 ? 255 : r
    }
    function tt(t, e, n) {
      return 0 === t
        ? e
        : 1 === t
          ? n
          : {
              r: K(t, e.r, n.r),
              g: K(t, e.g, n.g),
              b: K(t, e.b, n.b),
              a: H(t, null == e.a ? 1 : e.a, null == n.a ? 1 : n.a),
            }
    }
    function et(t, e, n) {
      let r = e.length
      if (r !== n.length) return U(t, e, n)
      let i = Array.from(r)
      for (let s = 0; s < r; s++) i[s] = H(t, e[s], n[s])
      return i
    }
    function nt(t, e) {
      const n = []
      for (let r = 0; r < t; r++) n.push(e)
      return n
    }
    function rt(t, e) {
      if (--e <= 0) return t
      const n = (t = Object.assign([], t)).length
      do {
        for (let e = 0; e < n; e++) t.push(t[e])
      } while (--e > 0)
      return t
    }
    class it {
      constructor(t) {
        ;(this.list = t), (this.length = t.length)
      }
      setAttribute(t, e) {
        const n = this.list
        for (let r = 0; r < this.length; r++) n[r].setAttribute(t, e)
      }
      removeAttribute(t) {
        const e = this.list
        for (let n = 0; n < this.length; n++) e[n].removeAttribute(t)
      }
      style(t, e) {
        const n = this.list
        for (let r = 0; r < this.length; r++) n[r].style[t] = e
      }
    }
    const st = /-./g,
      ot = (t, e) => e.toUpperCase()
    let ut
    function lt(t) {
      return 'function' == typeof t ? t : U
    }
    function at(t) {
      return t
        ? 'function' == typeof t
          ? t
          : Array.isArray(t)
            ? (function (t, e = T) {
                if (!Array.isArray(t)) return e
                switch (t.length) {
                  case 1:
                    return P(t[0]) || e
                  case 2:
                    return P(t[0], t[1]) || e
                  case 4:
                    return V(t[0], t[1], t[2], t[3]) || e
                }
                return e
              })(t, null)
            : (function (t, e, n = T) {
                switch (t) {
                  case 'linear':
                    return T
                  case 'steps':
                    return P(e.steps || 1, e.jump || 0) || n
                  case 'bezier':
                  case 'cubic-bezier':
                    return V(e.x1 || 0, e.y1 || 0, e.x2 || 0, e.y2 || 0) || n
                }
                return n
              })(t.type, t.value, null)
        : null
    }
    function ct(t, e, n, r = !1) {
      const i = e.length - 1
      if (t <= e[0].t) return r ? [0, 0, e[0].v] : e[0].v
      if (t >= e[i].t) return r ? [i, 1, e[i].v] : e[i].v
      let s,
        o = e[0],
        u = null
      for (s = 1; s <= i; s++) {
        if (!(t > e[s].t)) {
          u = e[s]
          break
        }
        o = e[s]
      }
      return null == u
        ? r
          ? [i, 1, e[i].v]
          : e[i].v
        : o.t === u.t
          ? r
            ? [s, 1, u.v]
            : u.v
          : ((t = (t - o.t) / (u.t - o.t)),
            o.e && (t = o.e(t)),
            r ? [s, t, n(t, o.v, u.v)] : n(t, o.v, u.v))
    }
    function ft(t, e, n = null) {
      return t && t.length
        ? 'function' != typeof e
          ? null
          : ('function' != typeof n && (n = null),
            (r) => {
              let i = ct(r, t, e)
              return null != i && n && (i = n(i)), i
            })
        : null
    }
    function ht(t, e) {
      return t.t - e.t
    }
    function dt(t, e, n, r, i) {
      const s = '@' === n[0],
        o = '#' === n[0]
      let u = ut[n],
        l = U
      var a
      switch (
        (s ? ((a = n.substr(1)), (n = a.replace(st, ot))) : o && (n = n.substr(1)), typeof u)
      ) {
        case 'function':
          if (((l = u(r, i, ct, at, n, s, e, t)), o)) return l
          break
        case 'string':
          l = ft(r, lt(u))
          break
        case 'object':
          if (((l = ft(r, lt(u.i), u.f)), l && 'function' == typeof u.u)) return u.u(e, l, n, s, t)
      }
      return l
        ? (function (t, e, n, r = !1) {
            if (r) return t instanceof it ? (r) => t.style(e, n(r)) : (r) => (t.style[e] = n(r))
            if (Array.isArray(e)) {
              const r = e.length
              return (i) => {
                const s = n(i)
                if (null == s) for (let n = 0; n < r; n++) t[n].removeAttribute(e)
                else for (let n = 0; n < r; n++) t[n].setAttribute(e, s)
              }
            }
            return (r) => {
              const i = n(r)
              null == i ? t.removeAttribute(e) : t.setAttribute(e, i)
            }
          })(e, n, l, s)
        : null
    }
    function gt(t, e, n, r) {
      if (!r || 'object' != typeof r) return null
      let i = null,
        s = null
      return (
        Array.isArray(r)
          ? (s = (function (t) {
              if (!t || !t.length) return null
              for (let e = 0; e < t.length; e++) t[e].e && (t[e].e = at(t[e].e))
              return t.sort(ht)
            })(r))
          : ((s = r.keys), (i = r.data || null)),
        s ? dt(t, e, n, s, i) : null
      )
    }
    function pt(t, e, n) {
      if (!n) return null
      const r = []
      for (const i in n)
        if (n.hasOwnProperty(i)) {
          const s = gt(t, e, i, n[i])
          s && r.push(s)
        }
      return r.length ? r : null
    }
    function yt(t, e) {
      if (!e.settings.duration || e.settings.duration < 0) return null
      const n = (function (t, e) {
        if (!e) return null
        let n = []
        if (Array.isArray(e)) {
          const r = e.length
          for (let i = 0; i < r; i++) {
            const r = e[i]
            if (2 !== r.length) continue
            let s = null
            if ('string' == typeof r[0]) s = t.getElementById(r[0])
            else if (Array.isArray(r[0])) {
              s = []
              for (let e = 0; e < r[0].length; e++)
                if ('string' == typeof r[0][e]) {
                  const n = t.getElementById(r[0][e])
                  n && s.push(n)
                }
              s = s.length ? (1 === s.length ? s[0] : new it(s)) : null
            }
            if (!s) continue
            const o = pt(t, s, r[1])
            o && (n = n.concat(o))
          }
        } else
          for (const r in e) {
            if (!e.hasOwnProperty(r)) continue
            const i = t.getElementById(r)
            if (!i) continue
            const s = pt(t, i, e[r])
            s && (n = n.concat(s))
          }
        return n.length ? n : null
      })(t, e.elements)
      return n
        ? (function (t, e) {
            const n = e.duration,
              r = t.length
            let i = null
            return (s, o) => {
              const u = e.iterations || 1 / 0,
                l = (e.alternate && u % 2 == 0) ^ (e.direction > 0) ? n : 0
              let a = s % n,
                c = 1 + (s - a) / n
              ;(o *= e.direction), e.alternate && c % 2 == 0 && (o = -o)
              let f = !1
              if (c > u) (a = l), (f = !0), -1 === e.fill && (a = e.direction > 0 ? 0 : n)
              else if ((o < 0 && (a = n - a), a === i)) return !1
              i = a
              for (let e = 0; e < r; e++) t[e](a)
              return f
            }
          })(n, e.settings)
        : null
    }
    function mt(t, e = document, n = 0) {
      const r = (function (t, e) {
        const n = e.querySelectorAll('svg')
        for (let e = 0; e < n.length; e++)
          if (n[e].id === t.root && !n[e].svgatorAnimation)
            return (n[e].svgatorAnimation = !0), n[e]
        return null
      })(t, e)
      if (r) return r
      if (n >= 20) return null
      const i = (function (t) {
        const e = (t) => t.shadowRoot
        return document
          ? Array.from(
              t.querySelectorAll(
                ':not(' +
                  [
                    'a',
                    'area',
                    'audio',
                    'br',
                    'canvas',
                    'circle',
                    'datalist',
                    'embed',
                    'g',
                    'head',
                    'hr',
                    'iframe',
                    'img',
                    'input',
                    'link',
                    'object',
                    'path',
                    'polygon',
                    'rect',
                    'script',
                    'source',
                    'style',
                    'svg',
                    'title',
                    'track',
                    'video',
                  ].join() +
                  ')',
              ),
            )
              .filter(e)
              .map(e)
          : []
      })(e)
      for (let e = 0; e < i.length; e++) {
        const r = mt(t, i[e], n + 1)
        if (r) return r
      }
      return null
    }
    function bt(t, e = null, n = Number, r = 'undefined' != typeof BigInt && BigInt) {
      const i = '0x' + (t.replace(/[^0-9a-fA-F]+/g, '') || 27)
      return e && r && n.isSafeInteger && !n.isSafeInteger(+i) ? (n(r(i)) % e) + e : +i
    }
    function vt(t, e = 27) {
      return !t || t % e ? t % e : [0, 1].includes(e) ? e : vt(t / e, e)
    }
    function wt(t, e, n) {
      if (!t || !t.length) return
      const r = bt(n),
        i = vt(r) + 5
      let s = (function (t, e, n) {
        let r = ''
        for (; t && n && e <= t.length; )
          (r += t.substring(0, e)), (t = t.substring(e + 1)), (e = n)
        return r + t
      })(t, vt(r, 5), i)
      return (
        (s = s.replace(/\x7c$/g, '==').replace(/\x2f$/g, '=')),
        (s = atob(s)),
        (s = s.replace(/[\x41-\x5A]/g, '')),
        (s = (function (t, e, n) {
          const r = +('0x' + t.substring(0, 4))
          t = t.substring(4)
          const i = (bt(e, r) % r) + (n % 27),
            s = []
          for (let e = 0; e < t.length; e += 2) {
            if ('|' === t[e]) {
              const n = +('0x' + t.substring(e + 1, e + 1 + 4)) - i
              ;(e += 3), s.push(n)
              continue
            }
            const n = +('0x' + t[e] + t[e + 1]) - i
            s.push(n)
          }
          return String.fromCharCode(...s)
        })(s, e, r)),
        (s = JSON.parse(s)),
        s
      )
    }
    const xt = [
      { key: 'alternate', def: !1 },
      { key: 'fill', def: 1 },
      { key: 'iterations', def: 0 },
      { key: 'direction', def: 1 },
      { key: 'speed', def: 1 },
      { key: 'fps', def: 100 },
    ]
    function At(t) {
      return n(t) + ''
    }
    function _t(t, e = ' ') {
      return t && t.length ? t.map(At).join(e) : ''
    }
    function St(t) {
      return At(t.x) + ',' + At(t.y)
    }
    function kt(t) {
      return t
        ? null == t.a || t.a >= 1
          ? (function (t) {
              if (!t) return 'transparent'
              const e = (t) => parseInt(t).toString(16).padStart(2, '0')
              return (function (t) {
                const e = []
                let n = '#' === t[0] ? e.push('#') : 0
                for (; n < t.length; n += 2) {
                  if (t[n] !== t[n + 1]) return t
                  e.push(t[n])
                }
                return e.join('')
              })('#' + e(t.r) + e(t.g) + e(t.b) + (null == t.a || t.a >= 1 ? '' : e(255 * t.a)))
            })(t)
          : 'rgba(' + t.r + ',' + t.g + ',' + t.b + ',' + t.a + ')'
        : 'transparent'
    }
    function Et(t) {
      return t ? 'url(#' + t + ')' : 'none'
    }
    !(function () {
      for (
        var t = 0, e = ['ms', 'moz', 'webkit', 'o'], n = 0;
        n < e.length && !window.requestAnimationFrame;
        ++n
      )
        (window.requestAnimationFrame = window[e[n] + 'RequestAnimationFrame']),
          (window.cancelAnimationFrame =
            window[e[n] + 'CancelAnimationFrame'] || window[e[n] + 'CancelRequestAnimationFrame'])
      window.requestAnimationFrame ||
        ((window.requestAnimationFrame = function (e) {
          var n = Date.now(),
            r = Math.max(0, 16 - (n - t)),
            i = window.setTimeout(function () {
              e(n + r)
            }, r)
          return (t = n + r), i
        }),
        (window.cancelAnimationFrame = window.clearTimeout))
    })()
    var Mt = {
        f: null,
        i: X,
        u: (t, e) => (n) => {
          const r = e(n)
          t.setAttribute('rx', At(r.x)), t.setAttribute('ry', At(r.y))
        },
      },
      It = {
        f: null,
        i: function (t, e, n) {
          return 0 === t
            ? e
            : 1 === t
              ? n
              : { width: Z(t, e.width, n.width), height: Z(t, e.height, n.height) }
        },
        u: (t, e) => (n) => {
          const r = e(n)
          t.setAttribute('width', At(r.width)), t.setAttribute('height', At(r.height))
        },
      }
    Object.freeze({ M: 2, L: 2, Z: 0, H: 1, V: 1, C: 6, Q: 4, T: 2, S: 4, A: 7 })
    let Nt = {},
      jt = null
    function Bt(t) {
      let e = (function () {
        if (jt) return jt
        if ('object' != typeof document || !document.createElementNS) return {}
        let t = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        return t && t.style
          ? ((t.style.position = 'absolute'),
            (t.style.opacity = '0.01'),
            (t.style.zIndex = '-9999'),
            (t.style.left = '-9999px'),
            (t.style.width = '1px'),
            (t.style.height = '1px'),
            (jt = { svg: t }),
            jt)
          : {}
      })().svg
      if (!e)
        return function (t) {
          return null
        }
      let n = document.createElementNS(e.namespaceURI, 'path')
      n.setAttributeNS(null, 'd', t),
        n.setAttributeNS(null, 'fill', 'none'),
        n.setAttributeNS(null, 'stroke', 'none'),
        e.appendChild(n)
      let r = n.getTotalLength()
      return function (t) {
        let e = n.getPointAtLength(r * t)
        return { x: e.x, y: e.y }
      }
    }
    function Ot(t, e, n, r, i = 1) {
      let s = (function (t) {
        return Nt[t] ? Nt[t] : (Nt[t] = Bt(t))
      })(
        (function (t, e, n, r) {
          if (!t || !r) return !1
          let i = ['M', t.x, t.y]
          if (
            (e && n && (i.push('C'), i.push(e.x), i.push(e.y), i.push(n.x), i.push(n.y)),
            e ? !n : n)
          ) {
            let t = e || n
            i.push('Q'), i.push(t.x), i.push(t.y)
          }
          return e || n || i.push('L'), i.push(r.x), i.push(r.y), i.join(' ')
        })(t, e, n, r),
      )
      try {
        return s(i)
      } catch (t) {
        return null
      }
    }
    function Tt(t, e, n) {
      return t + (e - t) * n
    }
    function Ft(t, e, n, r = !1) {
      const i = { x: Tt(t.x, e.x, n), y: Tt(t.y, e.y, n) }
      return (
        r &&
          (i.a = (function (t, e) {
            return Math.atan2(e.y - t.y, e.x - t.x)
          })(t, e)),
        i
      )
    }
    function Vt(t, e, n, r) {
      const i = 1 - r
      return i * i * t + 2 * i * r * e + r * r * n
    }
    function Rt(t, e, n, r) {
      return 2 * (1 - r) * (e - t) + 2 * r * (n - e)
    }
    function Ct(t, e, n, r, i = !1) {
      let s = Ot(t, e, null, n, r)
      return (
        s || (s = { x: Vt(t.x, e.x, n.x, r), y: Vt(t.y, e.y, n.y, r) }),
        i &&
          (s.a = (function (t, e, n, r) {
            return Math.atan2(Rt(t.y, e.y, n.y, r), Rt(t.x, e.x, n.x, r))
          })(t, e, n, r)),
        s
      )
    }
    function Pt(t, e, n, r, i) {
      const s = i * i
      return i * s * (r - t + 3 * (e - n)) + 3 * s * (t + n - 2 * e) + 3 * i * (e - t) + t
    }
    function $t(t, e, n, r, i) {
      const s = 1 - i
      return 3 * (s * s * (e - t) + 2 * s * i * (n - e) + i * i * (r - n))
    }
    function Dt(t, e, n, r, i, s = !1) {
      let o = Ot(t, e, n, r, i)
      return (
        o || (o = { x: Pt(t.x, e.x, n.x, r.x, i), y: Pt(t.y, e.y, n.y, r.y, i) }),
        s &&
          (o.a = (function (t, e, n, r, i) {
            return Math.atan2($t(t.y, e.y, n.y, r.y, i), $t(t.x, e.x, n.x, r.x, i))
          })(t, e, n, r, i)),
        o
      )
    }
    function Lt(t, e, n, r = !1) {
      if (zt(e)) {
        if (Gt(n)) return Ct(e, n.start, n, t, r)
      } else if (zt(n)) {
        if (Wt(e)) return Ct(e, e.end, n, t, r)
      } else {
        if (Wt(e)) return Gt(n) ? Dt(e, e.end, n.start, n, t, r) : Ct(e, e.end, n, t, r)
        if (Gt(n)) return Ct(e, n.start, n, t, r)
      }
      return Ft(e, n, t, r)
    }
    function qt(t, e, n) {
      const r = Lt(t, e, n, !0)
      return (
        (r.a = o(
          (function (t, e = !1) {
            return e ? t + Math.PI : t
          })(r.a),
        )),
        r
      )
    }
    function zt(t) {
      return !t.type || 'corner' === t.type
    }
    function Gt(t) {
      return null != t.start && !zt(t)
    }
    function Wt(t) {
      return null != t.end && !zt(t)
    }
    const Yt = new (class {
      constructor(t = 1, e = 0, n = 0, r = 1, i = 0, s = 0) {
        ;(this.m = [t, e, n, r, i, s]), (this.i = null), (this.w = null), (this.s = null)
      }
      get determinant() {
        const t = this.m
        return t[0] * t[3] - t[1] * t[2]
      }
      get isIdentity() {
        if (null === this.i) {
          const t = this.m
          this.i = 1 === t[0] && 0 === t[1] && 0 === t[2] && 1 === t[3] && 0 === t[4] && 0 === t[5]
        }
        return this.i
      }
      point(t, e) {
        const n = this.m
        return { x: n[0] * t + n[2] * e + n[4], y: n[1] * t + n[3] * e + n[5] }
      }
      translateSelf(t = 0, e = 0) {
        if (!t && !e) return this
        const n = this.m
        return (
          (n[4] += n[0] * t + n[2] * e),
          (n[5] += n[1] * t + n[3] * e),
          (this.w = this.s = this.i = null),
          this
        )
      }
      rotateSelf(t = 0) {
        if ((t %= 360)) {
          t = s(t)
          const e = $(t),
            n = D(t),
            r = this.m,
            i = r[0],
            o = r[1]
          ;(r[0] = i * n + r[2] * e),
            (r[1] = o * n + r[3] * e),
            (r[2] = r[2] * n - i * e),
            (r[3] = r[3] * n - o * e),
            (this.w = this.s = this.i = null)
        }
        return this
      }
      scaleSelf(t = 1, e = 1) {
        if (1 !== t || 1 !== e) {
          const n = this.m
          ;(n[0] *= t), (n[1] *= t), (n[2] *= e), (n[3] *= e), (this.w = this.s = this.i = null)
        }
        return this
      }
      skewSelf(t, e) {
        if (((e %= 360), (t %= 360) || e)) {
          const n = this.m,
            r = n[0],
            i = n[1],
            o = n[2],
            u = n[3]
          t && ((t = z(s(t))), (n[2] += r * t), (n[3] += i * t)),
            e && ((e = z(s(e))), (n[0] += o * e), (n[1] += u * e)),
            (this.w = this.s = this.i = null)
        }
        return this
      }
      resetSelf(t = 1, e = 0, n = 0, r = 1, i = 0, s = 0) {
        const o = this.m
        return (
          (o[0] = t),
          (o[1] = e),
          (o[2] = n),
          (o[3] = r),
          (o[4] = i),
          (o[5] = s),
          (this.w = this.s = this.i = null),
          this
        )
      }
      recomposeSelf(t = null, e = null, n = null, r = null, i = null) {
        return (
          this.isIdentity || this.resetSelf(),
          t && (t.x || t.y) && this.translateSelf(t.x, t.y),
          e && this.rotateSelf(e),
          n && (n.x && this.skewSelf(n.x, 0), n.y && this.skewSelf(0, n.y)),
          !r || (1 === r.x && 1 === r.y) || this.scaleSelf(r.x, r.y),
          i && (i.x || i.y) && this.translateSelf(i.x, i.y),
          this
        )
      }
      decompose(t = 0, e = 0) {
        const r = this.m,
          i = r[0] * r[0] + r[1] * r[1],
          s = [
            [r[0], r[1]],
            [r[2], r[3]],
          ]
        let u = W(i)
        if (0 === u)
          return {
            origin: { x: n(r[4]), y: n(r[5]) },
            translate: { x: n(t), y: n(e) },
            scale: { x: 0, y: 0 },
            skew: { x: 0, y: 0 },
            rotate: 0,
          }
        ;(s[0][0] /= u), (s[0][1] /= u)
        const l = r[0] * r[3] - r[1] * r[2] < 0
        l && (u = -u)
        let a = s[0][0] * s[1][0] + s[0][1] * s[1][1]
        ;(s[1][0] -= s[0][0] * a), (s[1][1] -= s[0][1] * a)
        let c,
          f = W(s[1][0] * s[1][0] + s[1][1] * s[1][1])
        return 0 === f
          ? {
              origin: { x: n(r[4]), y: n(r[5]) },
              translate: { x: n(t), y: n(e) },
              scale: { x: n(u), y: 0 },
              skew: { x: 0, y: 0 },
              rotate: 0,
            }
          : ((s[1][0] /= f),
            (s[1][1] /= f),
            (a /= f),
            s[1][1] < 0 ? ((c = o(L(s[1][1]))), s[0][1] < 0 && (c = 360 - c)) : (c = o(q(s[0][1]))),
            l && (c = -c),
            (a = o(G(a, W(s[0][0] * s[0][0] + s[0][1] * s[0][1])))),
            l && (a = -a),
            {
              origin: { x: n(r[4]), y: n(r[5]) },
              translate: { x: n(t), y: n(e) },
              scale: { x: n(u), y: n(f) },
              skew: { x: n(a), y: 0 },
              rotate: n(c),
            })
      }
      multiply(t) {
        return this.clone().multiplySelf(t)
      }
      preMultiply(t) {
        return t.multiply(this)
      }
      multiplySelf(t) {
        const { a: e, b: n, c: r, d: i, tx: s, ty: o } = Y(this.m, t.m)
        return this.resetSelf(e, n, r, i, s, o), this
      }
      preMultiplySelf(t) {
        const { a: e, b: n, c: r, d: i, tx: s, ty: o } = Y(t.m, this.m)
        return this.resetSelf(e, n, r, i, s, o), this
      }
      clone() {
        const t = this.m
        return new this.constructor(t[0], t[1], t[2], t[3], t[4], t[5])
      }
      static create(t) {
        return t
          ? Array.isArray(t)
            ? new this(...t)
            : t instanceof this
              ? t.clone()
              : new this().recomposeSelf(t.origin, t.rotate, t.skew, t.scale, t.translate)
          : new this()
      }
      toString(t = ' ', e = !1) {
        if (null === this.s) {
          let r = this.m.map((t) => n(t))
          e || 1 !== r[0] || 0 !== r[1] || 0 !== r[2] || 1 !== r[3]
            ? (this.s = 'matrix(' + r.join(t) + ')')
            : (this.s = 'translate(' + r[4] + t + r[5] + ')')
        }
        return this.s
      }
    })()
    var Ut = {
        f: function (t) {
          return t ? t.join(' ') : ''
        },
        i: function (t, e, n) {
          if (0 === t) return e
          if (1 === t) return n
          let r = e.length
          if (r !== n.length) return U(t, e, n)
          let i,
            s = Array.from(r)
          for (let o = 0; o < r; o++) {
            if (((i = typeof e[o]), i !== typeof n[o])) return U(t, e, n)
            if ('number' === i) s[o] = H(t, e[o], n[o])
            else {
              if (e[o] !== n[o]) return U(t, e, n)
              s[o] = e[o]
            }
          }
          return s
        },
      },
      Ht = {
        f: null,
        i: et,
        u: (t, e) => (n) => {
          const r = e(n)
          t.setAttribute('x1', At(r[0])),
            t.setAttribute('y1', At(r[1])),
            t.setAttribute('x2', At(r[2])),
            t.setAttribute('y2', At(r[3]))
        },
      },
      Zt = { f: At, i: H },
      Jt = { f: At, i: J },
      Qt = {
        f: function (t, e = ' ') {
          return t && t.length > 0 && (t = t.map((t) => n(t, 4))), _t(t, e)
        },
        i: function (t, e, r) {
          let i = e.length,
            s = r.length
          if (i !== s)
            if (0 === i) (i = s), (e = nt(i, 0))
            else if (0 === s) (s = i), (r = nt(i, 0))
            else {
              const t = (function (t, e) {
                const n =
                  (t * e) /
                  (function (t, e) {
                    let n
                    for (; e; ) (n = e), (e = t % e), (t = n)
                    return t || 1
                  })(t, e)
                return n < 0 ? -n : n
              })(i, s)
              ;(e = rt(e, Math.floor(t / i))), (r = rt(r, Math.floor(t / s))), (i = s = t)
            }
          let o = []
          for (let s = 0; s < i; s++) o.push(n(Z(t, e[s], r[s])))
          return o
        },
      }
    function Xt(t, e, r) {
      return t.map((t) =>
        (function (t, e, r) {
          let i = t.v
          if (!i || 'g' !== i.t || i.s || !i.v || !i.r) return t
          const s = r.getElementById(i.r),
            o = (s && s.querySelectorAll('stop')) || []
          return (
            (i.s = i.v.map((t, e) => {
              let r = o[e] && o[e].getAttribute('offset')
              return (r = n(parseInt(r) / 100)), { c: t, o: r }
            })),
            delete i.v,
            t
          )
        })(t, 0, r),
      )
    }
    const Kt = {
      gt: 'gradientTransform',
      c: { x: 'cx', y: 'cy' },
      rd: 'r',
      f: { x: 'x1', y: 'y1' },
      to: { x: 'x2', y: 'y2' },
    }
    function te(t, e, n, r, i, s, o, u) {
      return (
        Xt(t, 0, u),
        (e = (function (t, e, n) {
          let r, i, s
          const o = t.length - 1,
            u = {}
          for (let l = 0; l <= o; l++)
            (r = t[l]),
              r.e && (r.e = e(r.e)),
              r.v &&
                ((i = r.v),
                'g' === i.t &&
                  i.r &&
                  ((s = n.getElementById(i.r)),
                  s && (u[i.r] = { e: s, s: s.querySelectorAll('stop') })))
          return u
        })(t, r, u)),
        (r) => {
          const i = n(r, t, ee)
          if (!i) return 'none'
          if ('c' === i.t) return kt(i.v)
          if ('g' === i.t) {
            if (!e[i.r]) return Et(i.r)
            const t = e[i.r]
            return (
              (function (t, e) {
                let n = t.s
                for (let r = n.length; r < e.length; r++) {
                  const e = n[n.length - 1].cloneNode()
                  ;(e.id = ie(e.id)), t.e.appendChild(e), (n = t.s = t.e.querySelectorAll('stop'))
                }
                for (let t = 0, r = n.length, i = e.length - 1; t < r; t++)
                  n[t].setAttribute('stop-color', kt(e[Math.min(t, i)].c)),
                    n[t].setAttribute('offset', e[Math.min(t, i)].o)
              })(t, i.s),
              Object.keys(Kt).forEach((e) => {
                if (void 0 === i[e]) return
                if ('object' == typeof Kt[e])
                  return void Object.keys(Kt[e]).forEach((n) => {
                    if (void 0 === i[e][n]) return
                    const r = i[e][n],
                      s = Kt[e][n]
                    t.e.setAttribute(s, r)
                  })
                const n =
                  'gt' === e
                    ? ((r = i[e]), Array.isArray(r) ? 'matrix(' + r.join(' ') + ')' : '')
                    : i[e]
                var r
                const s = Kt[e]
                t.e.setAttribute(s, n)
              }),
              Et(i.r)
            )
          }
          return 'none'
        }
      )
    }
    function ee(t, e, n) {
      if (0 === t) return e
      if (1 === t) return n
      if (e && n) {
        const r = e.t
        if (r === n.t)
          switch (e.t) {
            case 'c':
              return { t: r, v: tt(t, e.v, n.v) }
            case 'g':
              if (e.r === n.r) {
                const i = { t: r, s: ne(t, e.s, n.s), r: e.r }
                return (
                  e.gt && n.gt && (i.gt = et(t, e.gt, n.gt)),
                  e.c
                    ? ((i.c = Q(t, e.c, n.c)), (i.rd = Z(t, e.rd, n.rd)))
                    : e.f && ((i.f = Q(t, e.f, n.f)), (i.to = Q(t, e.to, n.to))),
                  i
                )
              }
          }
        if (('c' === e.t && 'g' === n.t) || ('c' === n.t && 'g' === e.t)) {
          const r = 'c' === e.t ? e : n,
            i = 'g' === e.t ? { ...e } : { ...n },
            s = i.s.map((t) => ({ c: r.v, o: t.o }))
          return (i.s = 'c' === e.t ? ne(t, s, i.s) : ne(t, i.s, s)), i
        }
      }
      return U(t, e, n)
    }
    function ne(t, e, n) {
      if (e.length === n.length) return e.map((e, r) => re(t, e, n[r]))
      const r = Math.max(e.length, n.length),
        i = []
      for (let s = 0; s < r; s++) {
        const r = re(t, e[Math.min(s, e.length - 1)], n[Math.min(s, n.length - 1)])
        i.push(r)
      }
      return i
    }
    function re(t, e, n) {
      return { o: J(t, e.o, n.o || 0), c: tt(t, e.c, n.c || {}) }
    }
    function ie(t) {
      return t.replace(/-fill-([0-9]+)$/, (t, e) => '-fill-' + (+e + 1))
    }
    function se(t, e, n) {
      return 0 === t
        ? e
        : 1 === t
          ? n
          : {
              blur: X(t, e.blur, n.blur),
              offset: Q(t, e.offset, n.offset),
              color: tt(t, e.color, n.color),
            }
    }
    const oe = {
      blur: X,
      brightness: Z,
      contrast: Z,
      'drop-shadow': se,
      'inner-shadow': se,
      grayscale: Z,
      'hue-rotate': H,
      invert: Z,
      opacity: Z,
      saturate: Z,
      sepia: Z,
    }
    function ue(t, e, n) {
      if (0 === t) return e
      if (1 === t) return n
      const r = e.length
      if (r !== n.length) return U(t, e, n)
      const i = []
      let s
      for (let o = 0; o < r; o++) {
        if (e[o].type !== n[o].type) return e
        if (((s = oe[e[o].type]), !s)) return U(t, e, n)
        i.push({ type: e.type, value: s(t, e[o].value, n[o].value) })
      }
      return i
    }
    const le = {
      blur: (t) =>
        t
          ? (e) => {
              t.setAttribute('stdDeviation', St(e))
            }
          : null,
      brightness: (t, e, n) =>
        (t = ce(n, e))
          ? (e) => {
              ;(e = At(e)), t.map((t) => t.setAttribute('slope', e))
            }
          : null,
      contrast: (t, e, n) =>
        (t = ce(n, e))
          ? (e) => {
              const n = At((1 - e) / 2)
              ;(e = At(e)),
                t.map((t) => {
                  t.setAttribute('slope', e), t.setAttribute('intercept', n)
                })
            }
          : null,
      'drop-shadow'(t, e, n) {
        const r = n.getElementById(e + '-blur')
        if (!r) return null
        const i = n.getElementById(e + '-offset')
        if (!i) return null
        const s = n.getElementById(e + '-flood')
        return s
          ? (t) => {
              r.setAttribute('stdDeviation', St(t.blur)),
                i.setAttribute('dx', At(t.offset.x)),
                i.setAttribute('dy', At(t.offset.y)),
                s.setAttribute('flood-color', kt(t.color))
            }
          : null
      },
      'inner-shadow'(t, e, n) {
        const r = n.getElementById(e + '-blur')
        if (!r) return null
        const i = n.getElementById(e + '-offset')
        if (!i) return null
        const s = n.getElementById(e + '-color-matrix')
        return s
          ? (t) => {
              r.setAttribute('stdDeviation', St(t.blur)),
                i.setAttribute('dx', At(t.offset.x)),
                i.setAttribute('dy', At(t.offset.y))
              const e = [
                0,
                0,
                0,
                0,
                t.color.r / 255,
                0,
                0,
                0,
                0,
                t.color.g / 255,
                0,
                0,
                0,
                0,
                t.color.b / 255,
                0,
                0,
                0,
                t.color.a,
                0,
              ]
              s.setAttribute('values', _t(e))
            }
          : null
      },
      grayscale: (t) =>
        t
          ? (e) => {
              t.setAttribute(
                'values',
                _t(
                  (function (t) {
                    return [
                      0.2126 + 0.7874 * (t = 1 - t),
                      0.7152 - 0.7152 * t,
                      0.0722 - 0.0722 * t,
                      0,
                      0,
                      0.2126 - 0.2126 * t,
                      0.7152 + 0.2848 * t,
                      0.0722 - 0.0722 * t,
                      0,
                      0,
                      0.2126 - 0.2126 * t,
                      0.7152 - 0.7152 * t,
                      0.0722 + 0.9278 * t,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                    ]
                  })(e),
                ),
              )
            }
          : null,
      'hue-rotate': (t) => (t ? (e) => t.setAttribute('values', At(e)) : null),
      invert: (t, e, n) =>
        (t = ce(n, e))
          ? (e) => {
              ;(e = At(e) + ' ' + At(1 - e)), t.map((t) => t.setAttribute('tableValues', e))
            }
          : null,
      opacity: (t, e, n) =>
        (t = n.getElementById(e + '-A'))
          ? (e) => t.setAttribute('tableValues', '0 ' + At(e))
          : null,
      saturate: (t) => (t ? (e) => t.setAttribute('values', At(e)) : null),
      sepia: (t) =>
        t
          ? (e) =>
              t.setAttribute(
                'values',
                _t(
                  (function (t) {
                    return [
                      0.393 + 0.607 * (t = 1 - t),
                      0.769 - 0.769 * t,
                      0.189 - 0.189 * t,
                      0,
                      0,
                      0.349 - 0.349 * t,
                      0.686 + 0.314 * t,
                      0.168 - 0.168 * t,
                      0,
                      0,
                      0.272 - 0.272 * t,
                      0.534 - 0.534 * t,
                      0.131 + 0.869 * t,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                    ]
                  })(e),
                ),
              )
          : null,
    }
    const ae = ['R', 'G', 'B']
    function ce(t, e) {
      const n = ae.map((n) => t.getElementById(e + '-' + n) || null)
      return -1 !== n.indexOf(null) ? null : n
    }
    var fe = {
      fill: te,
      'fill-opacity': Jt,
      stroke: te,
      'stroke-opacity': Jt,
      'stroke-width': Zt,
      'stroke-dashoffset': { f: At, i: H },
      'stroke-dasharray': Qt,
      opacity: Jt,
      transform: function (t, e, n, r) {
        if (
          !(t = (function (t, e) {
            if (!t || 'object' != typeof t) return null
            let n = !1
            for (const r in t)
              t.hasOwnProperty(r) &&
                (t[r] && t[r].length
                  ? (t[r].forEach((t) => {
                      t.e && (t.e = e(t.e))
                    }),
                    (n = !0))
                  : delete t[r])
            return n ? t : null
          })(t, r))
        )
          return null
        const i = (r, i, s, o = null) => (t[r] ? n(i, t[r], s) : e && e[r] ? e[r] : o)
        return e && e.a && t.o
          ? (e) => {
              const r = n(e, t.o, qt)
              return Yt.recomposeSelf(
                r,
                i('r', e, H, 0) + r.a,
                i('k', e, Q),
                i('s', e, Q),
                i('t', e, Q),
              ).toString()
            }
          : (t) =>
              Yt.recomposeSelf(
                i('o', t, Lt, null),
                i('r', t, H, 0),
                i('k', t, Q),
                i('s', t, Q),
                i('t', t, Q),
              ).toString()
      },
      '#filter': function (t, e, n, r, i, s, o, u) {
        if (!e.items || !t || !t.length) return null
        const l = (function (t, e) {
          const n = (t = t.map((t) =>
            t && le[t[0]]
              ? (e.getElementById(t[1]), le[t[0]](e.getElementById(t[1]), t[1], e))
              : null,
          )).length
          return (e) => {
            for (let r = 0; r < n; r++) t[r] && t[r](e[r].value)
          }
        })(e.items, u)
        return l
          ? ((t = (function (t, e) {
              return t.map((t) => ((t.e = e(t.e)), t))
            })(t, r)),
            (e) => {
              l(n(e, t, ue))
            })
          : null
      },
      '#line': Ht,
      points: { f: _t, i: et },
      d: Ut,
      r: Zt,
      '#size': It,
      '#radius': Mt,
      _(t, e) {
        if (Array.isArray(t)) for (let n = 0; n < t.length; n++) this[t[n]] = e
        else this[t] = e
      },
    }
    let he = function (t, e, n = n) {
      let r = !1,
        i = null
      return function (s) {
        r && clearTimeout(r),
          (r = setTimeout(
            () =>
              (function () {
                let s = 0,
                  o = n.innerHeight,
                  u = 0,
                  l = n.innerWidth,
                  a = t.parentNode
                for (; a instanceof Element; ) {
                  let t = n.getComputedStyle(a)
                  if ('visible' !== t.overflowY || 'visible' !== t.overflowX) {
                    let e = a.getBoundingClientRect()
                    'visible' !== t.overflowY &&
                      ((s = Math.max(s, e.top)), (o = Math.min(o, e.bottom))),
                      'visible' !== t.overflowX &&
                        ((u = Math.max(u, e.left)), (l = Math.min(l, e.right)))
                  }
                  if (a === a.parentNode) break
                  a = a.parentNode
                }
                r = !1
                let c = t.getBoundingClientRect(),
                  f = Math.min(c.height, Math.max(0, s - c.top)),
                  h = Math.min(c.height, Math.max(0, c.bottom - o)),
                  d = Math.min(c.width, Math.max(0, u - c.left)),
                  g = Math.min(c.width, Math.max(0, c.right - l)),
                  p = (c.height - f - h) / c.height,
                  y = (c.width - d - g) / c.width,
                  m = Math.round(p * y * 100)
                ;(null !== i && i === m) || ((i = m), e(m))
              })(),
            100,
          ))
      }
    }
    class de {
      constructor(t, e, n) {
        const r = (function (t) {
          var e, n
          const r =
              t &&
              1 ===
                (null === (e = t.ownerDocument) ||
                void 0 === e ||
                null === (n = e.childNodes) ||
                void 0 === n
                  ? void 0
                  : n.length) &&
              window.parent !== window,
            i = { el: t, window: window }
          if (!r) return i
          let s
          try {
            s = window.parent.document
          } catch (t) {
            return i
          }
          return (
            (i.window = window.parent),
            (i.el =
              Array.from(s.querySelectorAll('iframe,object')).filter(
                (t) => t.contentWindow === window,
              )[0] || i.el),
            i
          )
        })(t)
        ;(e = Math.max(1, e || 1)),
          (e = Math.min(e, 100)),
          (this.el = r.el),
          (this._handlers = []),
          (this.onThresholdChange = n && n.call ? n : () => {}),
          (this.thresholdPercent = e || 1),
          (this.currentVisibility = null),
          (this.visibilityCalculator = he(this.el, this.onVisibilityUpdate.bind(this), r.window)),
          this.bindScrollWatchers(),
          this.visibilityCalculator()
      }
      bindScrollWatchers() {
        let t = this.el.parentNode
        for (
          ;
          t &&
          (this._handlers.push({ element: t, event: 'scroll', handler: this.visibilityCalculator }),
          t.addEventListener('scroll', this.visibilityCalculator),
          t !== t.parentNode && t !== document);

        )
          t = t.parentNode
      }
      onVisibilityUpdate(t) {
        let e = this.currentVisibility >= this.thresholdPercent,
          n = t >= this.thresholdPercent
        if (null === this.currentVisibility || e !== n)
          return (this.currentVisibility = t), void this.onThresholdChange(n)
        this.currentVisibility = t
      }
      destruct() {
        this._handlers.forEach((t) => {
          t.element.removeEventListener(t.event, t.handler)
        })
      }
    }
    class ge {
      static adjustLink(t) {
        var e, n
        const r =
            t &&
            1 ===
              (null === (e = t.ownerDocument) ||
              void 0 === e ||
              null === (n = e.childNodes) ||
              void 0 === n
                ? void 0
                : n.length) &&
            window.parent !== window,
          i = null == t ? void 0 : t.firstElementChild
        r &&
          i &&
          'a' === i.tagName &&
          !i.getAttribute('target') &&
          i.setAttributeNS(null, 'target', '_parent')
      }
      static autoPlay(t, e, n, r = []) {
        if ('click' === n.start) {
          const i = () => {
            switch (n.click) {
              case 'freeze':
                return !t._running && t.reachedToEnd() ? t.restart() : t.toggle()
              case 'restart':
                return t.offset > 0 ? t.restart() : t.play()
              case 'reverse':
                return t._running
                  ? t.reverse()
                  : t.reachedToEnd()
                    ? 1 === t.fill
                      ? t.reverse(!0)
                      : t.restart()
                    : t.play()
              case 'none':
              default:
                if (t._running) return
                return t.reachedToEnd() ? t.restart() : t.play()
            }
          }
          return (
            r.push({ element: e, event: 'click', handler: i }), void e.addEventListener('click', i)
          )
        }
        if ('hover' === n.start) {
          const i = () => (t.reachedToEnd() ? t.restart() : t._rollingBack ? t.reverse() : t.play())
          r.push({ element: e, event: 'mouseenter', handler: i }),
            e.addEventListener('mouseenter', i)
          const s = () => {
            switch (n.hover) {
              case 'freeze':
                return t.pause()
              case 'reset':
                return t.stop()
              case 'reverse':
                if ((t.reverse(), t._running)) return
                return t.play()
              case 'none':
              default:
                return
            }
          }
          return (
            r.push({ element: e, event: 'mouseleave', handler: s }),
            void e.addEventListener('mouseleave', s)
          )
        }
        if ('scroll' !== n.start) 'programmatic' !== n.start && t.play()
        else {
          const i = new de(e, n.scroll || 25, function (e) {
            e ? (t.reachedToEnd() ? t.restart() : t.play()) : t.pause()
          })
          r.push({ callback: () => i.destruct() })
        }
      }
    }
    class pe extends class {
      _svg
      _rootId
      constructor(t) {
        ;(t.animationSettings.fps = 65),
          (t.animationSettings.speed = props.speed),
          (this._id = 0),
          (this._running = !1),
          (this._rollingBack = !1),
          (this._animations = t.animations),
          (this._settings = t.animationSettings),
          t.version < '2022-05-02' && delete this._settings.speed,
          xt.forEach((t) => {
            this._settings[t.key] = this._settings[t.key] || t.def
          }),
          (this.duration = t.animationSettings.duration),
          (this.offset = t.animationSettings.offset || 0),
          (this.rollbackStartOffset = 0),
          (this._rootId = t.root),
          (this._svg = t.svg),
          (this._originalAnimations = t.originalAnimations),
          (this._fTC = new O(this))
      }
      get svg() {
        return this._svg
      }
      get rootId() {
        return this._rootId
      }
      get alternate() {
        return this._settings.alternate
      }
      get fill() {
        return this._settings.fill
      }
      get iterations() {
        return this._settings.iterations
      }
      get direction() {
        return this._settings.direction
      }
      get speed() {
        return this._settings.speed
      }
      get fps() {
        return this._settings.fps
      }
      get wD() {
        return this._settings.w
      }
      get originalAnimations() {
        return this._originalAnimations
      }
      get maxFiniteDuration() {
        return this.iterations > 0 ? this.iterations * this.duration : this.duration
      }
      static build(t, e) {
        if (
          (delete t.animationSettings,
          (t.options = wt(t.options, t.root, '5c7f360c')),
          t.animations.map((e) => {
            ;(e.settings = wt(e.s, t.root, '5c7f360c')),
              delete e.s,
              t.animationSettings || (t.animationSettings = e.settings)
          }),
          Object.assign(
            t,
            { originalAnimations: t.animations },
            (function (t, e) {
              if (((ut = e), !t || !t.root || !Array.isArray(t.animations))) return null
              const n = mt(t)
              if (!n) return null
              const r = t.animations.map((t) => yt(n, t)).filter((t) => !!t)
              return r.length ? { svg: n, animations: r } : null
            })(t, e),
          ),
          !t)
        )
          return null
        const n = t.options || {},
          r = new this(t)
        return { el: t.svg, options: n, player: r }
      }
      static push(t) {
        return this.build(t)
      }
      static init() {
        const t = window.__SVGATOR_PLAYER__ && window.__SVGATOR_PLAYER__['5c7f360c']
        Array.isArray(t) && t.splice(0).forEach((t) => this.build(t))
      }
      _apply(t, e = {}) {
        const n = this._animations,
          r = n.length
        let i = 0
        for (let s = 0; s < r; s++) e[s] ? i++ : ((e[s] = n[s](t, 1)), e[s] && i++)
        return i
      }
      _rollback(t) {
        let e = 1 / 0,
          n = null
        ;(this.rollbackStartOffset = t), (this._rollingBack = !0), (this._running = !0)
        const r = (i) => {
          if (!this._rollingBack) return
          null == n && (n = i)
          let s = Math.round(t - (i - n) * this.speed)
          if (s > this.duration && e !== 1 / 0) {
            const t = !!this.alternate && (s / this.duration) % 2 > 1
            let e = s % this.duration
            ;(e += t ? this.duration : 0), (s = e || this.duration)
          }
          const o = (this.fps ? 1e3 / this.fps : 0) * this.speed,
            u = Math.max(0, s)
          u <= e - o && ((this.offset = u), (e = u), this._apply(u))
          const l = this.iterations > 0 && -1 === this.fill && s >= this.maxFiniteDuration
          ;(s <= 0 || this.offset < s || l) && this.stop(),
            (this._id = window.requestAnimationFrame(r))
        }
        this._id = window.requestAnimationFrame(r)
      }
      _start(t = 0) {
        let e,
          n = -1 / 0
        const r = {}
        this._running = !0
        const i = (s) => {
          e ??= s
          const o = Math.round((s - e) * this.speed + t),
            u = (this.fps ? 1e3 / this.fps : 0) * this.speed
          ;(o >= n + u &&
            !this._rollingBack &&
            this._fTC.cF(s, () => {
              ;(this.offset = o), (n = o)
              if (this._apply(o, r) === this._animations.length) return this.pause(!0), !0
            })) ||
            (this._id = window.requestAnimationFrame(i))
        }
        this._id = window.requestAnimationFrame(i)
      }
      _pause() {
        this._id && window.cancelAnimationFrame(this._id), (this._running = !1)
      }
      play() {
        if (!this._running)
          return this._rollingBack ? this._rollback(this.offset) : this._start(this.offset)
      }
      stop() {
        this._pause(),
          (this.offset = 0),
          (this.rollbackStartOffset = 0),
          (this._rollingBack = !1),
          this._apply(0)
      }
      reachedToEnd() {
        return this.iterations > 0 && this.offset >= this.iterations * this.duration
      }
      restart(t = !1) {
        this.stop(t), this.play(t)
      }
      pause() {
        this._pause()
      }
      toggle() {
        return this._running ? this.pause() : this.reachedToEnd() ? this.restart() : this.play()
      }
      trigger(t, e) {}
      _adjustOffset(t = !1) {
        const e = this.alternate ? 2 * this.duration : this.duration
        if (t) {
          if (!this._rollingBack && 0 === this.offset) return void (this.offset = e)
          this._rollingBack && (this.offset, this.maxFiniteDuration)
        }
        !this._rollingBack || this.rollbackStartOffset <= this.duration
          ? 0 !== this.iterations && (this.offset = Math.min(this.offset, this.maxFiniteDuration))
          : ((this.offset =
              this.rollbackStartOffset - ((this.rollbackStartOffset - this.offset) % e)),
            (this.rollbackStartOffset = 0))
      }
      reverse(t = !1) {
        if (!this._running)
          return (
            this._adjustOffset(t),
            (this._rollingBack = !this._rollingBack),
            t && this.play(!1),
            void this.trigger('reverse', this.offset)
          )
        this.pause(!1, !1),
          this._adjustOffset(),
          (this._rollingBack = !this._rollingBack),
          this.play(!1),
          this.trigger('reverse', this.offset)
      }
    } {
      static build(t) {
        let e = super.build(t, fe)
        if (!e) return null
        let { el: n, options: r, player: i } = e
        ge.adjustLink(n), ge.autoPlay(i, n, r)
      }
    }
    return pe.init(), pe
  })
  ;(function (s, i, o, w, d, a, b) {
    w[o] = w[o] || {}
    w[o][s] = w[o][s] || []
    w[o][s].push(i)
  })(
    '5c7f360c',
    {
      root: 'eWZEfwPv3ti1',
      version: '2025-04-07',
      animations: [
        {
          elements: {
            eWZEfwPv3ti7: {
              transform: {
                data: { r: -0.345037, t: { x: -0.000417, y: -0.000069 } },
                keys: {
                  o: [
                    {
                      t: 0,
                      v: {
                        x: 257.765442,
                        y: 375.030853,
                        type: 'cusp',
                        end: { x: 295.129624, y: 191.728107 },
                      },
                      e: [0.233035, 0.341522, 0.616517, 0.830248],
                    },
                    {
                      t: 490,
                      v: {
                        x: 535.971191,
                        y: 23.161869,
                        type: 'cusp',
                        start: { x: 392.628663, y: 28.608995 },
                        end: { x: 645.465264, y: 14.709802 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 1090,
                      v: {
                        x: 838.956055,
                        y: 541.142822,
                        type: 'cusp',
                        start: { x: 833.380552, y: 163.496009 },
                        end: { x: 825.921822, y: 908.603843 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 1690,
                      v: {
                        x: 537.86322,
                        y: 1057.79126,
                        type: 'cusp',
                        start: { x: 665.07928, y: 1059.445482 },
                        end: { x: 381.142056, y: 1070.052611 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 2290,
                      v: {
                        x: 240.758835,
                        y: 544.774414,
                        type: 'cusp',
                        start: { x: 239.810558, y: 822.654216 },
                        end: { x: 239.847897, y: 307.190196 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 2890,
                      v: {
                        x: 535.971191,
                        y: 23.161869,
                        type: 'cusp',
                        start: { x: 348.94647, y: 30.506616 },
                        end: { x: 644.3493, y: 13.443838 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 3490,
                      v: {
                        x: 838.956055,
                        y: 541.142822,
                        type: 'cusp',
                        start: { x: 832.990831, y: 162.531958 },
                        end: { x: 825.952624, y: 911.832269 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 4090,
                      v: {
                        x: 537.86322,
                        y: 1057.79126,
                        type: 'cusp',
                        start: { x: 664.356663, y: 1060.01942 },
                        end: { x: 381.377931, y: 1070.896281 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 4690,
                      v: {
                        x: 240.758835,
                        y: 544.774414,
                        type: 'cusp',
                        start: { x: 239.810558, y: 822.654216 },
                        end: { x: 239.847897, y: 307.190196 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 5290,
                      v: {
                        x: 535.971191,
                        y: 23.161869,
                        type: 'cusp',
                        start: { x: 348.94647, y: 30.506616 },
                        end: { x: 644.3493, y: 13.443838 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 5890,
                      v: {
                        x: 838.956055,
                        y: 541.142822,
                        type: 'cusp',
                        start: { x: 832.990831, y: 162.531958 },
                        end: { x: 825.952624, y: 911.832269 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 6490,
                      v: {
                        x: 537.86322,
                        y: 1057.79126,
                        type: 'cusp',
                        start: { x: 664.356663, y: 1060.01942 },
                        end: { x: 381.377931, y: 1070.896281 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 7090,
                      v: {
                        x: 240.758835,
                        y: 544.774414,
                        type: 'cusp',
                        start: { x: 239.810558, y: 822.654216 },
                        end: { x: 239.847897, y: 307.190196 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 7690,
                      v: {
                        x: 535.971191,
                        y: 23.161869,
                        type: 'cusp',
                        start: { x: 348.94647, y: 30.506616 },
                        end: { x: 644.3493, y: 13.443838 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 8290,
                      v: {
                        x: 838.956055,
                        y: 541.142822,
                        type: 'cusp',
                        start: { x: 832.990831, y: 162.531958 },
                        end: { x: 825.952624, y: 911.832269 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 8890,
                      v: {
                        x: 537.86322,
                        y: 1057.79126,
                        type: 'cusp',
                        start: { x: 664.356663, y: 1060.01942 },
                        end: { x: 381.377931, y: 1070.896281 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 9490,
                      v: {
                        x: 240.758835,
                        y: 544.774414,
                        type: 'cusp',
                        start: { x: 239.810558, y: 822.654216 },
                        end: { x: 240.390169, y: 448.62173 },
                      },
                      e: [0, 0, 0.402949, 0.477787],
                    },
                    {
                      t: 9690,
                      v: {
                        x: 290.771912,
                        y: 259.770782,
                        type: 'cusp',
                        end: { x: 344.816092, y: 126.413017 },
                      },
                      e: [0.276715, 0.395929, 0.638357, 0.8251],
                    },
                    {
                      t: 10090,
                      v: {
                        x: 535.971191,
                        y: 23.161869,
                        type: 'cusp',
                        start: { x: 428.309963, y: 24.220551 },
                        end: { x: 645.465264, y: 14.709802 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 10690,
                      v: {
                        x: 838.956055,
                        y: 541.142822,
                        type: 'cusp',
                        start: { x: 833.380552, y: 163.496009 },
                        end: { x: 825.921822, y: 908.603843 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 11290,
                      v: {
                        x: 537.86322,
                        y: 1057.79126,
                        type: 'cusp',
                        start: { x: 665.07928, y: 1059.445482 },
                        end: { x: 381.142056, y: 1070.052611 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 11890,
                      v: {
                        x: 240.758835,
                        y: 544.774414,
                        type: 'cusp',
                        start: { x: 239.810558, y: 822.654216 },
                        end: { x: 240.544141, y: 488.925672 },
                      },
                      e: [0, 0, 0.380756, 0.426236],
                    },
                    {
                      t: 12000,
                      v: {
                        x: 257.765442,
                        y: 375.030853,
                        type: 'cusp',
                        start: { x: 246.347725, y: 431.043087 },
                      },
                      e: [0.233035, 0.341522, 0.616517, 0.830248],
                    },
                  ],
                },
              },
            },
            eWZEfwPv3ti8: {
              transform: {
                data: { r: -0.345037, t: { x: -0.000562, y: -0.000196 } },
                keys: {
                  o: [
                    {
                      t: 0,
                      v: {
                        x: 443.850078,
                        y: 432.41847,
                        type: 'cusp',
                        end: { x: 220.904438, y: 617.627124 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 750,
                      v: {
                        x: 150.758488,
                        y: 873.795961,
                        type: 'cusp',
                        start: { x: 104.204029, y: 821.75172 },
                        end: { x: 198.792365, y: 932.258063 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 1500,
                      v: {
                        x: 630.947878,
                        y: 651.351569,
                        type: 'cusp',
                        start: { x: 434.514695, y: 827.789384 },
                        end: { x: 780.365708, y: 521.330757 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 2250,
                      v: {
                        x: 926.016051,
                        y: 210.445256,
                        type: 'cusp',
                        start: { x: 978.975094, y: 305.840361 },
                        end: { x: 880.069883, y: 152.007857 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 3000,
                      v: {
                        x: 443.850078,
                        y: 432.41847,
                        type: 'cusp',
                        start: { x: 662.079708, y: 243.495351 },
                        end: { x: 220.454472, y: 616.530076 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 3750,
                      v: {
                        x: 150.758488,
                        y: 873.795961,
                        type: 'cusp',
                        start: { x: 104.1655, y: 822.584726 },
                        end: { x: 198.792365, y: 932.258063 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 4500,
                      v: {
                        x: 630.947878,
                        y: 651.351569,
                        type: 'cusp',
                        start: { x: 434.514695, y: 827.789384 },
                        end: { x: 779.504525, y: 520.819356 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 5250,
                      v: {
                        x: 926.016051,
                        y: 210.445256,
                        type: 'cusp',
                        start: { x: 978.518314, y: 306.22951 },
                        end: { x: 879.918276, y: 150.737667 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 6000,
                      v: {
                        x: 443.850078,
                        y: 432.41847,
                        type: 'cusp',
                        start: { x: 663.80646, y: 241.917196 },
                        end: { x: 220.904438, y: 617.627124 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 6750,
                      v: {
                        x: 150.758488,
                        y: 873.795961,
                        type: 'cusp',
                        start: { x: 104.204029, y: 821.75172 },
                        end: { x: 198.792365, y: 932.258063 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 7500,
                      v: {
                        x: 630.947878,
                        y: 651.351569,
                        type: 'cusp',
                        start: { x: 434.514695, y: 827.789384 },
                        end: { x: 780.365708, y: 521.330757 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 8250,
                      v: {
                        x: 926.016051,
                        y: 210.445256,
                        type: 'cusp',
                        start: { x: 978.975094, y: 305.840361 },
                        end: { x: 880.069883, y: 152.007857 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 9000,
                      v: {
                        x: 443.850078,
                        y: 432.41847,
                        type: 'cusp',
                        start: { x: 662.079708, y: 243.495351 },
                        end: { x: 220.454472, y: 616.530076 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 9750,
                      v: {
                        x: 150.758488,
                        y: 873.795961,
                        type: 'cusp',
                        start: { x: 104.1655, y: 822.584726 },
                        end: { x: 198.792365, y: 932.258063 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 10500,
                      v: {
                        x: 630.947878,
                        y: 651.351569,
                        type: 'cusp',
                        start: { x: 434.514695, y: 827.789384 },
                        end: { x: 779.504525, y: 520.819356 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 11250,
                      v: {
                        x: 926.016051,
                        y: 210.445256,
                        type: 'cusp',
                        start: { x: 978.518314, y: 306.22951 },
                        end: { x: 881.103689, y: 151.296887 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 12000,
                      v: {
                        x: 443.850078,
                        y: 432.41847,
                        type: 'cusp',
                        start: { x: 664.205006, y: 242.153495 },
                      },
                      e: [0.5, 0.2, 1, 1],
                    },
                  ],
                },
              },
            },
            eWZEfwPv3ti9: {
              transform: {
                data: { r: -0.345037, t: { x: -0.000317, y: 0.000002 } },
                keys: {
                  o: [
                    {
                      t: 0,
                      v: {
                        x: 608.048401,
                        y: 819.113281,
                        type: 'cusp',
                        end: { x: 765.045776, y: 855.832194 },
                      },
                      e: [0.239501, 0.349959, 0.61975, 0.830063],
                    },
                    {
                      t: 800,
                      v: {
                        x: 1007.618421,
                        y: 742.418724,
                        type: 'cusp',
                        start: { x: 949.749717, y: 858.362521 },
                        end: { x: 1065.838328, y: 587.470969 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 1800,
                      v: {
                        x: 636.387024,
                        y: 318.18387,
                        type: 'cusp',
                        start: { x: 832.097237, y: 399.011132 },
                        end: { x: 336.71813, y: 189.706602 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 2800,
                      v: {
                        x: 73.100776,
                        y: 340.467633,
                        type: 'cusp',
                        start: { x: 108.158047, y: 240.617022 },
                        end: { x: 46.898741, y: 412.623966 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 3800,
                      v: {
                        x: 444.332173,
                        y: 764.70249,
                        type: 'cusp',
                        start: { x: 63.62887, y: 578.981132 },
                        end: { x: 599.000696, y: 835.276941 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 4800,
                      v: {
                        x: 1007.618421,
                        y: 742.418724,
                        type: 'cusp',
                        start: { x: 926.849752, y: 904.244125 },
                        end: { x: 1065.838328, y: 587.470969 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 5800,
                      v: {
                        x: 636.387024,
                        y: 318.18387,
                        type: 'cusp',
                        start: { x: 832.097237, y: 399.011132 },
                        end: { x: 336.71813, y: 189.706602 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 6800,
                      v: {
                        x: 73.100776,
                        y: 340.467633,
                        type: 'cusp',
                        start: { x: 108.158047, y: 240.617022 },
                        end: { x: 46.890847, y: 411.313322 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 7800,
                      v: {
                        x: 444.332173,
                        y: 764.70249,
                        type: 'cusp',
                        start: { x: 63.628872, y: 578.981135 },
                        end: { x: 599.000696, y: 835.276941 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 8800,
                      v: {
                        x: 1007.618421,
                        y: 742.418724,
                        type: 'cusp',
                        start: { x: 926.849752, y: 904.244125 },
                        end: { x: 1065.838328, y: 587.470969 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 9800,
                      v: {
                        x: 636.387024,
                        y: 318.18387,
                        type: 'cusp',
                        start: { x: 832.097237, y: 399.011132 },
                        end: { x: 336.71813, y: 189.706602 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 10800,
                      v: {
                        x: 73.100776,
                        y: 340.467633,
                        type: 'cusp',
                        start: { x: 108.158047, y: 240.617022 },
                        end: { x: 47.13979, y: 411.044761 },
                      },
                      e: [0.345489, 0.189097, 0.693414, 0.576165],
                    },
                    {
                      t: 11300,
                      v: {
                        x: 133.080124,
                        y: 546.015015,
                        type: 'cusp',
                        start: { x: 83.182534, y: 482.594388 },
                        end: { x: 188.287785, y: 611.754756 },
                      },
                      e: [0.571933, 0.46257, 1, 1],
                    },
                    {
                      t: 11800,
                      v: {
                        x: 444.332173,
                        y: 764.70249,
                        type: 'cusp',
                        start: { x: 284.053425, y: 686.512502 },
                        end: { x: 488.184621, y: 784.712136 },
                      },
                      e: [0, 0, 0.383377, 0.432022],
                    },
                    {
                      t: 12000,
                      v: {
                        x: 608.048401,
                        y: 819.113281,
                        type: 'cusp',
                        start: { x: 545.958467, y: 804.592579 },
                      },
                      e: [0.239501, 0.349959, 0.61975, 0.830063],
                    },
                  ],
                },
              },
            },
            eWZEfwPv3ti10: {
              transform: {
                data: { r: -0.345037, t: { x: -0.000413, y: -0.00005 } },
                keys: {
                  o: [
                    {
                      t: 0,
                      v: {
                        x: 948.196289,
                        y: 536.597351,
                        type: 'cusp',
                        end: { x: 873.165453, y: 446.155974 },
                      },
                      e: [0.571933, 0.46257, 1, 1],
                    },
                    {
                      t: 500,
                      v: {
                        x: 636.387024,
                        y: 318.18387,
                        type: 'cusp',
                        start: { x: 748.532523, y: 364.499356 },
                        end: { x: 336.71813, y: 189.706602 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 1500,
                      v: {
                        x: 73.100776,
                        y: 340.467633,
                        type: 'cusp',
                        start: { x: 108.158047, y: 240.617022 },
                        end: { x: 46.898741, y: 412.623966 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 2500,
                      v: {
                        x: 444.332173,
                        y: 764.70249,
                        type: 'cusp',
                        start: { x: 63.62887, y: 578.981132 },
                        end: { x: 599.000696, y: 835.276941 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 3500,
                      v: {
                        x: 1007.618421,
                        y: 742.418724,
                        type: 'cusp',
                        start: { x: 926.849752, y: 904.244125 },
                        end: { x: 1065.838328, y: 587.470969 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 4500,
                      v: {
                        x: 636.387024,
                        y: 318.18387,
                        type: 'cusp',
                        start: { x: 832.097237, y: 399.011132 },
                        end: { x: 336.71813, y: 189.706602 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 5500,
                      v: {
                        x: 73.100776,
                        y: 340.467633,
                        type: 'cusp',
                        start: { x: 108.158047, y: 240.617022 },
                        end: { x: 46.890847, y: 411.313322 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 6500,
                      v: {
                        x: 444.332173,
                        y: 764.70249,
                        type: 'cusp',
                        start: { x: 63.628872, y: 578.981135 },
                        end: { x: 599.000696, y: 835.276941 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 7500,
                      v: {
                        x: 1007.618421,
                        y: 742.418724,
                        type: 'cusp',
                        start: { x: 926.849752, y: 904.244125 },
                        end: { x: 1065.838328, y: 587.470969 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 8500,
                      v: {
                        x: 636.387024,
                        y: 318.18387,
                        type: 'cusp',
                        start: { x: 832.097237, y: 399.011132 },
                        end: { x: 336.71813, y: 189.706602 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 9500,
                      v: {
                        x: 73.100776,
                        y: 340.467633,
                        type: 'cusp',
                        start: { x: 108.158047, y: 240.617022 },
                        end: { x: 47.263988, y: 413.075379 },
                      },
                      e: [0.495, 0.2, 1, 1],
                    },
                    {
                      t: 10500,
                      v: {
                        x: 444.332173,
                        y: 764.70249,
                        type: 'cusp',
                        start: { x: 62.494928, y: 577.763685 },
                        end: { x: 596.249596, y: 838.061377 },
                      },
                      e: [0, 0, 0.5, 0.8],
                    },
                    {
                      t: 11500,
                      v: {
                        x: 1007.618421,
                        y: 742.418724,
                        type: 'cusp',
                        start: { x: 924.882572, y: 906.235141 },
                        end: { x: 1032.477266, y: 676.258841 },
                      },
                      e: [0.345489, 0.189097, 0.693414, 0.576165],
                    },
                    {
                      t: 12000,
                      v: {
                        x: 948.196289,
                        y: 536.597351,
                        type: 'cusp',
                        start: { x: 1004.107673, y: 603.989252 },
                      },
                      e: [0.571933, 0.46257, 1, 1],
                    },
                  ],
                },
              },
            },
            eWZEfwPv3ti20: {
              transform: {
                data: {
                  o: { x: 135.33781, y: 207.03926, type: 'corner' },
                  t: { x: -135.33781, y: -207.03926 },
                },
                keys: {
                  r: [
                    { t: 0, v: 720, e: [0.415, 0.08, 0.115, 0.955] },
                    { t: 7700, v: 0, e: [1, 0] },
                    { t: 10000, v: 720, e: [0.415, 0.08, 0.115, 0.955] },
                    { t: 17700, v: 0, e: [1, 0] },
                  ],
                },
              },
              fill: [
                { t: 0, v: { t: 'c', v: { r: 210, g: 219, b: 237, a: 1 } } },
                { t: 7700, v: { t: 'c', v: { r: 210, g: 219, b: 236, a: 1 } } },
                { t: 10000, v: { t: 'c', v: { r: 210, g: 219, b: 237, a: 1 } } },
                { t: 17700, v: { t: 'c', v: { r: 210, g: 219, b: 236, a: 1 } } },
              ],
            },
            eWZEfwPv3ti21: {
              transform: {
                data: {
                  o: { x: 11.12, y: 29.9, type: 'corner' },
                  s: { x: 0.3, y: 0.3 },
                  t: { x: -95.902813, y: -108.465 },
                },
                keys: {
                  r: [
                    { t: 0, v: -720, e: [0.415, 0.08, 0.115, 0.955] },
                    { t: 7700, v: 0, e: [1, 0] },
                    { t: 10000, v: -720, e: [0.415, 0.08, 0.115, 0.955] },
                    { t: 17700, v: 0, e: [1, 0] },
                  ],
                },
              },
            },
          },
          s: 'MVDBjZWE2NGRUOGZhMDWlkOGM5Zjk0OWE5OTRSkVzY1NWM1ZDViNWJNWNWI1NzRkOGZUOTQ5ZADkwOGU5Zjk0OWE5OTCRkNjU1YzU3NGQ5NDlXmOTA5ZDhjOWY5NDlhHRzk5OWU0ZDY1NWI1NX1c0ZDkxOTQ5Nzk3NGNQ2NTVjNTc0ZDhjOTcC5ZjkwOWQ5OThjOWY5NMEw0ZDY1OTFWOGM5NKzllOTA1NzRkQjllOWXI5MDkwOGY0ZDY1NWMC1NzRkVDkxUTliOWU0KZDY1NjE1YjU3NGRhMWjRkNjU4NjRkOGY1ZjIVmNjM2MzY0OGVPNWUQ2MjkwOTFSNWM1YjhjGNWI1ZTYzNjQ2MjhjNXjI1ZDYxNWM1ZThlNjRQ1ZTYyNjQ2MDYyNWID2NDVmNjA2MDYzNWI1DZjVjNWY4ZjhlNWM1ZMjhkNjA2MTVlNWQ2MzNhlOGY1YjViOGU1YzhNmOGU2MTVkNjE4ZjRkINTc0ZDVjNWZTNGQ1NQzRkNWM2MDRkNTc0ZDIVjNjE0ZDU3NGQ1YzYMyNGQ1NzRkNWM2MzRkXNTc0ZDVjNjQ0ZDU3NUGQ1ZDViNGQ1NzRkNWJQ1YzRkODhhOA|',
        },
      ],
      options: 'MYDAxMDg4MmY4MDgxNmNU3ZjgxMmY0NzJmNzlKEN2M2ZTcxMmY4YQ|',
    },
    '__SVGATOR_PLAYER__',
    window,
    document,
  )
})
</script>
<template>
  <svg
    id="eWZEfwPv3ti1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 1080 1080"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    cached="false"
  >
    <g transform="matrix(.933043 0.005619-.005619 0.933043 41.572346 33.137696)">
      <path
        d="M540.00084,-0.000935c-93.93243,0-179.89577,62.611129-240.20848,164.264015s-92.79166,235.87128-92.79166,375.7375c0,5.26274.0462,10.51781.1379,15.76312c8.14488,8.17055,16.77639,16.30223,25.85618,24.36427c11.45183-13.76684,23.47141-27.61854,36.00657-41.5047.21898-129.62656,31.341-253.77956,84.11335-342.7237C406.07394,106.64046,473.74094,62.000199,539.99922,62.000199c64.29695,0,129.92255,42.037311,182.14546,126.090921c1.04151-.49927,2.08036-.99498,3.11806-1.48756c18.98347-9.01116,37.47167-16.243,55.19124-21.92261-.0824-.13919-.16415-.27743-.24665-.41649C719.89462,62.61157,633.93327,-0.000935,540.00084,-0.000935ZM816.27271,236.63451c-.86397.23879-1.73519.48528-2.61278.73841.87665-.25274,1.74788-.49754,2.6128-.73645l-.00002-.00196Zm6.29216,15.73779c-17.25511,4.72641-36.29521,11.53819-56.13459,20.95562-.66949.3178-1.3397.63797-2.01183.9594c29.82513,77.76049,46.58148,170.2819,46.58148,265.71257c0,90.05598-14.92279,177.52214-41.66803,252.43716c8.14855.0137,16.1285-.17076,23.92092-.55618c15.60241-.7717,30.03971-2.29757,43.33911-4.46811c23.9016-76.00874,36.40717-160.62387,36.40717-247.41319c0-102.42994-17.42015-201.82871-50.43423-287.62727Zm-63.55683,5.67387c-.30545.14506-.61134.29135-.9173.43717.003.007.005.0127.008.0195.23164-.11038.46394-.22042.69529-.33036.065-.0309.14058-.0807.21408-.12629ZM216.40785,668.87595c.005.0359.0109.0715.0163.10733c2.10928,1.82734,4.1607,3.68076,6.44301,5.4359c1.9161,1.47352,4.01128,2.84616,6.14453,4.19745-4.24924-3.22412-8.45064-6.47251-12.60381-9.74068Zm20.30531,37.01511c-2.33946,3.44191-4.62055,6.85828-6.84075,10.24841c1.98709-3.03418,4.79945-6.36764,7.60577-9.70223-.25554-.18206-.5098-.36394-.76502-.54618Zm13.93003,9.74441c-2.24137,3.2989-4.42539,6.57222-6.55038,9.81697-4.50263,6.87528-8.63687,13.67023-12.42073,20.33493c15.64217,62.36816,38.53088,120.07724,68.1204,169.94832c60.31271,101.65291,146.276,164.26341,240.20843,164.26341s179.89383-62.6092,240.20654-164.26203c5.36118-9.0359,10.50232-18.32933,15.42039-27.86095-22.82437,1.0327-46.37554.71434-70.46566-.89597-52.69944,87.34002-119.61956,131.01975-185.1616,131.01975-66.25828,0-133.92669-44.64124-186.88593-133.90035-23.85907-40.2128-43.29338-87.62255-57.44649-139.4808-15.45606-9.34359-30.48232-19.01497-45.02497-28.98328Zm580.0372,89.72728c-11.37934,1.58423-23.27664,2.81845-35.97978,3.46674c12.70117-.64462,24.67065-1.81811,35.97015-3.44325.003-.008.007-.0152.01-.0235l-.00037.00001Z"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-linecap="square"
      />
      <path
        d="M255.34959,213.14294C157.12156,223.18595,81.210311,262.0914,51.496158,331.17546C19.202132,406.2576,50.314957,496.43187,122.52305,580.61357s182.20024,159.92714,307.71372,213.91249s256.14652,81.73736,366.91903,76.25852s197.63201-44.91212,229.9261-119.99426s1.1812-165.25834-71.02693-249.44007c-21.18359-24.69627-45.61983-48.66573-72.74485-71.57298c3.66817,29.78976,5.84287,60.16146,6.48669,90.85126c6.74104,6.9987,13.14708,14.034,19.19766,21.08789c63.7601,74.33287,80.18614,140.27705,61.1322,184.57661s-78.22063,77.72963-176.0333,82.56746-221.23674-20.48324-339.3593-71.28964-221.39042-122.99058-285.15053-197.32345-80.188081-140.27509-61.13413-184.57464c15.18776-35.31086,55.86357-63.7162,121.28135-76.23957c7.50783-22.91359,16.0548-45.06502,25.61883-66.29025Zm107.64426-.36897c-10.5009,18.63058-20.08914,38.84811-28.66049,60.35534c58.90911,2.73464,124.24798,14.65984,190.61047,34.95821c21.43224-15.62522,42.79338-30.36393,63.90722-44.13957-76.70393-27.62623-153.84528-45.20481-225.8572-51.17398Zm316.00898,88.43057c-20.47237,12.21755-41.50369,25.58455-62.83099,39.92988c21.31053-14.32835,42.35704-27.69813,62.84861-39.92217-.006-.003-.0118-.005-.0176-.008l-.00002.00029Zm18.26208,8.76127c-20.38768,11.82824-41.43464,24.8859-62.84996,39.05108c55.13622,24.49339,106.82201,53.58915,152.49099,85.28634-3.94064-29.12302-9.46504-57.44832-16.42746-84.55299-23.46375-14.05273-47.93577-27.35506-73.21357-39.78443Z"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-linecap="square"
      />
      <path
        d="M886.41289,164.34948c-7.88697-.18171-16.2949.11462-25.26274.87871-35.87134,3.05635-80.49995,13.90098-128.59753,36.73214-92.89005,44.09345-202.5844,116.23037-306.3428,206.70017-68.36693,59.61099-130.03391,122.11705-180.3372,182.60301c15.33101,12.91367,31.78665,25.60524,49.20204,37.94071c47.54376-56.8745,106.52584-116.82938,171.8802-173.81364c99.70426-86.93488,205.96135-156.49016,292.18555-197.41943c41.45959-19.6802,79.588-28.60793,107.27444-30.9669c6.92161-.58975,13.20254-.75221,18.61181-.62382s9.94543.54765,13.37416,1.11675c.12005.0199.17272.0624.28957.0842.003.0612.02.0903.0224.15222.26302,6.71437-.5774,17.60617-3.42735,30.88448-4.42924,20.63634-13.56311,47.17413-29.15467,76.56563c5.53157,22.70926,10.11889,45.98355,13.74412,69.68412c3.65807,2.94281,7.2739,5.90611,10.84669,8.88797c4.43806-6.5636,8.69879-13.07686,12.7752-19.53042c28.73396-45.49006,44.97078-87.95009,52.40717-122.59712c3.71819-17.32352,5.29812-32.63983,4.76214-46.32249s-5.105884-24.450561-17.170044-38.547651c-12.73243-14.87799-21.169826-18.138549-34.943856-20.424739-6.88701-1.14309-14.25233-1.80218-22.1393-1.98389ZM783.43667,452.71313C736.43113,509.14611,678.02186,568.50014,614.1421,624.19866c-44.68745,38.9642-90.42193,74.30595-135.04902,105.1316c23.6006,9.59065,47.35881,18.13767,71.0012,25.60608c34.95813-25.68384,70.14302-53.79375,104.79482-84.00761c50.4439-43.98342,97.59266-89.96333,139.09543-135.70536-.15927-26.35275-1.63393-52.46439-4.32955-78.06128-2.05887-1.48763-4.13162-2.97131-6.21831-4.44896ZM187.54234,667.9443c-3.27022,4.77063-6.44999,9.51408-9.5356,14.22565-29.04147,44.34484-46.31081,86.5421-54.26831,121.98723-3.97875,17.72256-5.70241,33.7233-4.88237,48.41114s3.05881,28.92327,14.96004,42.29153c12.12685,13.6217,25.70694,16.88891,39.97032,19.27527s30.18895,2.54061,48.17342.76068c15.96482-1.58004,33.52406-4.74615,52.29763-9.76239-9.86253-18.25488-18.88957-37.36507-27.0657-57.20523-11.47072,2.6323-22.00335,4.34701-31.33797,5.27085-13.78479,1.36428-24.99173.93054-31.83585-.21453-1.1701-.19576-1.96419-.47785-2.81898-.7428-.1776-.92652-.36918-1.84701-.44072-3.12826-.38508-6.89724.46503-17.97554,3.47323-31.375c6.01641-26.79892,20.36971-63.01112,45.64093-101.59897c2.2202-3.39014,4.50148-6.80633,6.84075-10.24841-17.15112-12.24708-33.57353-24.91456-49.17082-37.94676ZM381.17468,790.84879c-15.01023,8.45888-29.66771,16.24621-43.87207,23.32127c8.22027,19.80802,17.31648,38.46079,27.20518,55.71804c27.81499-13.82339,56.89023-29.98994,86.70495-48.28084-9.25217-3.68169-18.48582-7.50433-27.69259-11.4643-14.32185-6.16006-28.44797-12.59719-42.34547-19.29417Z"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-linecap="square"
      />
      <circle
        r="508"
        transform="matrix(.999982-.006022 0.006022 0.999982 537.447709 540.018284)"
        paint-order="markers stroke fill"
        fill="none"
        :stroke="iconColor"
        stroke-width="63.9997"
        stroke-linecap="square"
      />
      <circle
        id="eWZEfwPv3ti7"
        r="55"
        transform="matrix(.999982-.006022 0.006022 0.999982 257.765025 375.030787)"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-width="0"
        stroke-linecap="square"
      />
      <circle
        id="eWZEfwPv3ti8"
        r="55"
        transform="matrix(.999982-.006022 0.006022 0.999982 443.849515 432.418277)"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-width="0"
        stroke-linecap="square"
      />
      <circle
        id="eWZEfwPv3ti9"
        r="55"
        transform="matrix(.999982-.006022 0.006022 0.999982 608.048084 819.113285)"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-width="0"
        stroke-linecap="square"
      />
      <circle
        id="eWZEfwPv3ti10"
        r="55"
        transform="matrix(.999982-.006022 0.006022 0.999982 948.195876 536.597303)"
        paint-order="markers stroke fill"
        :fill="iconColor"
        stroke-width="0"
        stroke-linecap="square"
      />
    </g>
  </svg>
</template>
