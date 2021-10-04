import create from 'zustand'

import { Series, } from './types'



type State = {
  series: Series | null
  seriesLoading: boolean
  searchId: string | null
  setSeries: (series: Series) => void
  setSearchId: (searchId: string) => void
  setSeriesLoading: (loading: boolean) => void
}

const useStore = create<State>(set => ({
  series: null,
  seriesLoading: false,
  searchId: null,
  setSeries: (series: Series) => set(state => ({ series, seriesLoading: false })),
  setSeriesLoading: (loading: boolean) => set(state => ({ seriesLoading: loading })),
  setSearchId: (searchId: string) => set(state => ({ searchId }))
}))

export default useStore
