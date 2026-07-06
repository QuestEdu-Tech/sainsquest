"use client"

import { useCallback, useRef } from "react"

type SoundType = "correct" | "wrong" | "tick" | "fanfare" | "combo" | "click"

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const playCorrect = useCallback(() => {
    try {
      const ctx = getContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.type = "sine"
      g.gain.setValueAtTime(0.15, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      o.frequency.setValueAtTime(523, ctx.currentTime)
      o.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
      o.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
      o.start(ctx.currentTime)
      o.stop(ctx.currentTime + 0.3)
    } catch {}
  }, [getContext])

  const playWrong = useCallback(() => {
    try {
      const ctx = getContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.type = "sawtooth"
      g.gain.setValueAtTime(0.1, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      o.frequency.setValueAtTime(200, ctx.currentTime)
      o.frequency.setValueAtTime(150, ctx.currentTime + 0.15)
      o.start(ctx.currentTime)
      o.stop(ctx.currentTime + 0.3)
    } catch {}
  }, [getContext])

  const playTick = useCallback(() => {
    try {
      const ctx = getContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.type = "sine"
      g.gain.setValueAtTime(0.08, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
      o.frequency.setValueAtTime(880, ctx.currentTime)
      o.start(ctx.currentTime)
      o.stop(ctx.currentTime + 0.05)
    } catch {}
  }, [getContext])

  const playFanfare = useCallback(() => {
    try {
      const ctx = getContext()
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g)
        g.connect(ctx.destination)
        o.type = "sine"
        g.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.15)
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4)
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
        o.start(ctx.currentTime + i * 0.15)
        o.stop(ctx.currentTime + i * 0.15 + 0.4)
      })
    } catch {}
  }, [getContext])

  const playCombo = useCallback(() => {
    try {
      const ctx = getContext()
      const notes = [440, 554, 659, 880]
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g)
        g.connect(ctx.destination)
        o.type = "triangle"
        g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08)
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.2)
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
        o.start(ctx.currentTime + i * 0.08)
        o.stop(ctx.currentTime + i * 0.08 + 0.2)
      })
    } catch {}
  }, [getContext])

  const playClick = useCallback(() => {
    try {
      const ctx = getContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.type = "sine"
      g.gain.setValueAtTime(0.06, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
      o.frequency.setValueAtTime(660, ctx.currentTime)
      o.start(ctx.currentTime)
      o.stop(ctx.currentTime + 0.04)
    } catch {}
  }, [getContext])

  const play = useCallback(
    (sound: SoundType) => {
      switch (sound) {
        case "correct":
          playCorrect()
          break
        case "wrong":
          playWrong()
          break
        case "tick":
          playTick()
          break
        case "fanfare":
          playFanfare()
          break
        case "combo":
          playCombo()
          break
        case "click":
          playClick()
          break
      }
    },
    [playCorrect, playWrong, playTick, playFanfare, playCombo, playClick]
  )

  return { play }
}
