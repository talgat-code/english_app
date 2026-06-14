import { useCallback } from 'react'

export function useSpeech() {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window

  const speak = useCallback((text: string) => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      return
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      const englishVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase() === 'en-us')

      utterance.lang = 'en-US'
      utterance.rate = 0.9
      if (englishVoice) utterance.voice = englishVoice

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch {
      // Speech is an optional enhancement; unsupported browsers stay silent.
    }
  }, [])

  return { speak, isSupported }
}
