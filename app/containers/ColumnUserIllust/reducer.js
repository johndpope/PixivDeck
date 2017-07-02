// @flow
import { handleRehydrate } from 'util/handleReydrate'
import type { Action } from './actionTypes'
import * as Actions from './constants'
import { REHYDRATE } from 'redux-persist/constants'

export type ColumnId = number

export type ColumnUserIllust = {|
  illustIds: Array<number>,
  nextUrl: ?string,
|}

export type State = $Shape<{ [ColumnId]: ColumnUserIllust }>

const initialState: State = {}

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.ADD_USER_ILLUST_COLUMN_SUCCESS:
      return { ...state, [action.id]: { illustIds: [], nextUrl: null } }

    case Actions.SET_NEXT_URL: {
      const id = action.id
      return {
        ...state,
        [id]: { ...state[id], nextUrl: action.nextUrl },
      }
    }

    case Actions.FETCH_USER_ILLUST_SUCCESS:
    case Actions.FETCH_NEXT_USER_ILLUST_SUCCESS: {
      const id = action.id
      return {
        ...state,
        [id]: { ...state[id], illustIds: action.ids },
      }
    }

    case REHYDRATE:
      return handleRehydrate(state, action, 'ColumnUserIllust')
    default:
      return state
  }
}
