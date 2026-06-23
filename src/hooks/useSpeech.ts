'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
  interrupt?: boolean
}

function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

function findVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const normalizedLang = lang.toLowerCase()
  const baseLang = normalizedLang.split('-')[0]

  return (
    voices.find((voice) => voice.lang.toLowerCase() === normalizedLang) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(baseLang)) ??
    voices.find((voice) => voice.default) ??
    null
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function useSpeech() {
  const [isSupported] = useState(isSpeechSupported)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!isSpeechSupported()) return

    const synth = window.speechSynthesis

    const loadVoices = () => {
      setVoices(synth.getVoices())
    }

    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const stop = useCallback(() => {
    if (!isSpeechSupported()) return

    utteranceRef.current = null
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!isSpeechSupported()) return

      const message = text.trim()
      if (!message) return

      const {
        lang = 'en-US',
        rate = 0.9,
        pitch = 1,
        volume = 1,
        interrupt = true,
      } = options

      const synth = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(message)

      utterance.lang = lang
      utterance.rate = clamp(rate, 0.1, 10)
      utterance.pitch = clamp(pitch, 0, 2)
      utterance.volume = clamp(volume, 0, 1)

      const voice = findVoice(voices, lang)
      if (voice) {
        utterance.voice = voice
      }

      utterance.onstart = () => {
        if (utteranceRef.current === utterance) {
          setIsSpeaking(true)
        }
      }

      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null
          setIsSpeaking(false)
        }
      }

      utterance.onerror = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null
          setIsSpeaking(false)
        }
      }

      utteranceRef.current = utterance

      if (interrupt) {
        synth.cancel()
      }

      synth.speak(utterance)
    },
    [voices],
  )

  return {
    speak,
    stop,
    isSupported,
    isSpeaking,
    voices,
  }
}
