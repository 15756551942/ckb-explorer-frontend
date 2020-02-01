import { useEffect, useState } from 'react'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import { RESIZE_LATENCY, CachedKeys } from '../../utils/const'
import { initNodeVersion } from '../../service/app/nodeInfo'
import { AppDispatch, AppActions } from './reducer'
import { fetchCachedData } from '../../utils/cached'
import { changeLanguage } from '../../utils/i18n'
import { useAppState, useDispatch } from '.'

const useWindowResize = (dispatch: AppDispatch) => {
  useEffect(() => {
    let resizeTimer: any = null
    const resizeListener = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        dispatch({
          type: AppActions.ResizeWindow,
          payload: {
            appWidth: window.innerWidth,
            appHeight: window.innerHeight,
          },
        })
        resizeTimer = null
      }, RESIZE_LATENCY)
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [dispatch])
}

const initAppLanguage = (app: State.App, dispatch: AppDispatch) => {
  const language = fetchCachedData<'zh' | 'en'>(CachedKeys.AppLanguage) || app.language
  if (language) {
    dispatch({
      type: AppActions.UpdateAppLanguage,
      payload: {
        language,
      },
    })
    changeLanguage(language)
  }
}

export const useInitApp = () => {
  const [init, setInit] = useState(false)
  const { app } = useAppState()
  const dispatch = useDispatch()

  if (!init) {
    setInit(true)
    initAxiosInterceptors(dispatch)
    initNodeVersion(dispatch)
    initAppLanguage(app, dispatch)
  }
  useWindowResize(dispatch)
}

export default useInitApp
