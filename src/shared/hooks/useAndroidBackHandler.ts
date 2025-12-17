import { App } from '@capacitor/app'
import { useEffect } from 'react'

export function useAndroidBackHandler(
  isLibraryOpen: boolean,
  closeLibrary: () => void
) {
  useEffect(() => {
    const sub = App.addListener('backButton', () => {
      if (isLibraryOpen) {
        closeLibrary()
      } else {
        App.exitApp()
      }
    })

    return () => {
      sub.then(h => h.remove())
    }
  }, [isLibraryOpen, closeLibrary])
}
