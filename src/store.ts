import create from 'zustand'

import { Series, } from './types'



type State = {
  series: Series | null
  seriesLoading: boolean
  seriesError: string | null
  setSeries: (series: Series) => void
  setSeriesLoading: (loading: boolean) => void
  setSeriesError: (error: string) => void
}

const useStore = create<State>(set => ({
  series: null,
  seriesLoading: false,
  seriesError: null,
  setSeries: (series: Series) => set(state => ({ series, seriesLoading: false, seriesError: null })),
  setSeriesLoading: (loading: boolean) => set(state => ({ seriesLoading: loading })),
  setSeriesError: (error: string) => set(state => ({ series: null, seriesLoading: false, seriesError: error }))
}))

export default useStore
